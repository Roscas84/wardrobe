# Mi Guardarropa — PWA de outfits con motor cromático y colorimetría personal

App de uso personal: inventario de ropa, outfits por teoría del color, colorimetría de 12 estaciones. Instalable en iPhone sin App Store. Usuario = **Otoño Profundo**; acento único de la app = **oro viejo #C9A227**.

**URL:** https://roscas84.github.io/wardrobe/ · **Repo:** https://github.com/Roscas84/wardrobe (privado)
**Estado:** SW v122 · 62 prendas · app FINALIZADA — solo mantenimiento y ajustes puntuales

## Arranque de sesión (para el modelo)

1. Clonar a `/tmp/wardrobe`. Si no hay token a la mano: el index.html **público** de Pages lo trae embebido — `curl -s https://roscas84.github.io/wardrobe/index.html | grep -oE "_K[AB]='[^']*'"`, concatenar `_KA+_KB` y `base64 -d` → token `ghp_…` para clonar.
2. Tokens: GitHub embebido en `_KA+_KB`, remove.bg en `_KR` (ambos activos; decisión explícita del usuario — app personal. Si algún día va a stores → revertir). NO pedirlos por chat.
3. El teléfono pushea seguido ("Update inventory"): ante push rechazado NO rebase (choca en guardarropa.json) → `git reset --hard origin/main` y re-aplicar lo local encima.
4. Ciclo de cambio: editar → extraer `<script>` con python y `node --check` → subir versión de `CACHE` en sw.js → commit+push → verificar con `curl sw.js` en vivo (si tras ~5 min no cambia: commit vacío destraba Pages).
5. Prueba visual: Playwright python (`pip3 install --user playwright`), 390×844. Para inyectar looks en `#lista-looks` hay que llamar `showScreen('outfit')` ANTES (el contenedor vive en un screen oculto).

## Arquitectura

```
index.html        — TODA la app (single-file, CSS+JS inline). Único archivo de código
sw.js             — Service worker. SUBIR CACHE en cada push de app
guardarropa.json  — Fuente de verdad: {prendas:[...], deleted:[ids], favs:[claves], perfil:{estacion,fecha}}
images/           — WebP 1200×1600 fondo transparente (campo de prenda: `foto`, con ?v=<ts> al editar)
slides/           — Fotos editoriales del usuario para el collage de Inicio
```

- Prenda: `{id, nombre, tipo, capa, temporada, color, color2, color3, marca, talla, material:[{tela,pct}], cuidado, formalidad, foto, pos}` — el campo es **`color`, no color1**.
- **Sync bidireccional** vía GitHub API: toda mutación llama `sincronizarInventario()`. Tombstones (`deleted`) propagan borrados entre dispositivos; el perfil de colorimetría nunca se pisa con vacío.
- **SW**: network-first `{cache:'no-cache'}` para HTML/JSON (esquiva max-age=600 de Pages), cache-first para imágenes.
- **localStorage**: `wrd_inv`, `wrd_favs`, `wrd_color_perfil`, `wrd_pending_del`, `wrd_dirty`, `wrd_slides`, `gh_token` (prioridad sobre `_KA+_KB`), `rmbg_key`.

## Funcionalidades por pestaña

- **Inicio** — fija sin scroll: collage rotativo (4 plantillas grid 4×6, celdas B/N o sepia, crossfade 7s) de `slides/slideN.jpg` (sondeo `probeSlides` N=1..40; se suben más desde Ajustes → Galería).
- **Closet** — categorías (Playeras primero) · búsqueda por color (burbujas con conteo, incluye colores 2/3) · **Colores que te faltan** (paleta personal sin equivalente en clóset; con hex — es para ir de compras) · **Todo el clóset** por secciones · desde aquí también se arman looks (fusión Closet/Outfit).
- **Looks** — abre directo en Favoritos ♥ · motor HSL de 7 armonías con capas base/medio/exterior (4 niveles) · Modo Libre · **Modo Viaje** (días → clima → prenda fija opcional → maleta mínima greedy; clima deriva de `temporada` vía `climaPermite`; **cálido estricto: solo P/V, Verano o Todo**; cada día cambia ≥2 prendas vs anterior, relaja a 1) · badges: ♥ ✦ (paleta personal) W (Sanzo Wada) · compartir (canvas 1080×1920 → hoja nativa).
- **Look card editorial** (v120, patrón "shop the look"): `particionLook()` → héroe ⅔ (capa MÁS exterior + inferior, siempre grandes) + carril ⅓ (capas interiores, calzado, accesorios; thumbs `flex:1` que LLENAN la columna — sin huecos negros, v121). La tarjeta y la imagen de compartir usan la MISMA partición. Header 38px arriba de la foto; reverso: solo marca·talla, material, cuidados en blanco brillante.
- **Mi Color** — quiz 6 preguntas → 1 de 12 estaciones (característica dominante, umbral ≥2) → paleta/neutros/evitar + clóset real clasificado en 4 niveles.
- **Cargar** — form negro: tipo, capa override, temporada (define clima en Viaje; al editar nunca se pisa), hasta 3 colores con **gotero** (Chrome: EyeDropper nativo · iPhone: **lupa de zoom** v122 — arrastrar muestra círculo magnificado 3× con crosshair y hex, soltar toma el color; `-webkit-touch-callout:none` evita el menú de long-press de iOS), telas con %, cuidados auto, remove.bg. Ajustes plegable.

## Motor de color — invariantes (NO cambiar)

- `TOLERANCIA = 15` (±15° por posición armónica)
- Neutros NUNCA en esCompatible — solo fallback; `pool()` fallback solo neutros
- `esNeutro` (motor: navy/camel/oliva = comodines) ≠ `esNeutroColorim` (colorimetría: solo acromáticos)
- `object-fit:contain`, sin nombres en outfit cards, paleta al pie
- Umbrales calibrados con el clóset real: `UMBRAL_MIO = 19` (¿me favorece?) · `UMBRAL_TENGO = 14` (¿ya tengo este color?) · evitar: LAB ≤ 28 vs arquetipos · Wada: LAB ≤ 30 · outfit ✦: ≥60% de cromáticos en paleta
- `nombreColor()` nombra por carácter HSL (Vino, Óxido, Ocre, Terracota…), no por sector de tono

## Diseño — decisiones fijas del usuario

- Helvetica Neue 300, uppercase, letter-spacing. **Serif editorial RECHAZADA — no volver a proponer.**
- Fondo negro en Closet/Looks/Cargar; único acento #C9A227 (el rojo se eliminó de toda la app, 2026-07-05).
- Nav inferior negra ~52px (los `calc(100vh - 52px)` dependen de ella); íconos 19px, inactivo #777, activo oro.
- Móvil <700px: listas compactas para caber sin scroll. Web ≥700px: columna 1080px, grids 3-4 cols, modal 2 columnas — no se toca al ajustar móvil.
- **Nada de rediseños masivos**: mejoras puntuales con aprobación del usuario; referencia visual = app de Zara. Cambios riesgosos → por fases validadas una a una.

## Saber operativo

- **remove.bg conserva personas**: si la prenda está puesta deja piel. Receta PIL que funcionó (commit c89bbfb): borrar píxeles piel (r>120, r>g>b, r-b>28 + sombras, excluir blancos), bbox del alpha, recentrar 1200×1600 con 88% margen, WEBP q92. Umbral calibrado para prenda BLANCA — con beige/camel revisar. Al reemplazar foto SIEMPRE subir `?v=` en el JSON.
- El usuario dicta por voz: "Sarah"=Zara, "Judith"=hoodie, "Deluxe/lux"=de looks, "Remi"=memoria/README. Cuando dice "antes de ejecutar respóndeme" → DETENERSE y responder.
- Tag de respaldo `nivel1-web` en el repo.

## Pendientes

1. **iPhone real**: validar lupa del gotero (que el long-press ya no abra el menú de iOS — fix v122 no simulable en desktop) y look card nueva.
2. **Usuario**: capturar `color2` (negro) de la camiseta de rayas id 1783712099719 con la lupa.
3. **8 prendas sin subtipo/patrón**: si el usuario completa el Excel, pasar al JSON.

## Futuro (sin compromiso — solo si algún día se monetiza)

**Virtual try-on con IA** (regenerar fotos como modelo con el look puesto — el salto visual por encima del look card; idea aprobada 2026-07-10) · historial/calendario · estadísticas de uso · detección de patrón · backend con cuentas (Supabase/Firebase).
