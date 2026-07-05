# Mi Guardarropa — PWA de outfits con motor cromático y colorimetría personal

App web progresiva de uso personal: inventario de ropa, generación de outfits por teoría del color y análisis de colorimetría de 12 estaciones. Instalable en iPhone sin App Store.

**URL:** https://roscas84.github.io/wardrobe/ · **Repo:** https://github.com/Roscas84/wardrobe (privado)
**Estado:** SW v103 · 52 prendas · roadmap completado 2026-07-04 · rediseño acento oro viejo 2026-07-05

---

## Arquitectura

```
index.html        — App completa (single-file, todo inline). Único archivo de código
sw.js             — Service worker. SUBIR versión de CACHE en cada push de app
guardarropa.json  — Fuente de verdad: {prendas:[...], deleted:[ids], favs:[claves], perfil:{estacion,fecha}}
images/           — WebP 1200×1600 fondo transparente (curadas + user_<id>.webp de la app)
slides/           — Fotos editoriales del usuario para el hero de Inicio
```

- **Sync bidireccional** vía GitHub API (token en localStorage `gh_token`): toda mutación llama `sincronizarInventario()`. Tombstones (`deleted`) propagan eliminaciones entre dispositivos; el perfil de colorimetría nunca se pisa con vacío; fotos editadas llevan `?v=<timestamp>` (SW cache-first en imágenes).
- **SW**: network-first con `{cache:'no-cache'}` para HTML/JSON (esquiva el max-age=600 de GitHub Pages), cache-first para imágenes.
- **localStorage**: `wrd_inv`, `wrd_favs`, `wrd_color_perfil`, `wrd_pending_del`, `wrd_dirty`, `wrd_slides` (lista de fotos del collage), `gh_token`, `rmbg_key` (remove.bg — nunca en código).

## Funcionalidades por pestaña

- **Inicio** — pantalla fija sin scroll: collage editorial rotativo (4 plantillas grid 4×6 de 13-15 fotos, algunas celdas B/N o sepia, crossfade cada 7s), "Mi Guardarropa" fijo en oro viejo. Fotos en `slides/slideN.jpg` — la lista se sondea al arrancar (`probeSlides`, N=1..40) y se pueden subir más desde Ajustes → Galería de Inicio (GitHub API; aparecen al publicarse Pages).
- **Closet** — Búsqueda por color (burbujas con conteo, incluye colores 2/3) · categorías · **Colores que te faltan** (colores de la paleta personal sin equivalente en clóset, con "+N looks"; sin perfil invita a Mi Color) · **Todo el clóset** agrupado por secciones.
- **Outfit** — motor HSL de 7 armonías con **capas base/medio/exterior** (4 niveles: básico, capa media, exterior, tres capas) · Favoritos ♥ · Modo Libre · **Modo Viaje** (días → clima frío/templado/cálido → prenda fija opcional → maleta mínima greedy; clima se deriva de `temporada` vía `climaPermite`; prioridad de looks: 1º Wada+✦ juntos, 2º Wada, 3º ✦, 4º resto; cada día cambia ≥2 prendas vs el anterior, se relaja a 1 si no alcanza) · badges por card: ♥ ✦ (paleta personal) W (Sanzo Wada) · botón **compartir** (canvas 1080×1920 → hoja nativa).
- **Mi Color** — quiz de 6 preguntas (venas, joyería, sol, ojos, tono de piel con muestras, cabello; contraste DERIVADO de piel vs cabello) → 1 de 12 estaciones (método característica dominante, umbral de dominancia ≥2, empates → estaciones puras) → paleta/neutros/evitar + **comparativa del clóset real en fotos en 4 niveles**: Te favorecen / Neutras / No recomendadas / Evítalas.
- **Cargar** — form: tipo (generado de CATEGORIAS), **capa override** (auto/base/media/exterior — la capa es de la prenda, no del tipo), hasta **3 colores** con **gotero** (EyeDropper en Chrome, tap-en-foto en iPhone), telas con %, cuidados auto-sugeridos, remove.bg. Ajustes plegable (Datos/GitHub/Remove.bg). Todo en negro.

## Motor de color — invariantes y umbrales

**NO cambiar:**
- `TOLERANCIA = 15` (±15° por posición armónica)
- Neutros NUNCA en esCompatible — solo fallback; `pool()` fallback solo neutros
- `esNeutro` (motor: navy/camel/oliva = comodines) ≠ `esNeutroColorim` (colorimetría: solo acromáticos)
- `object-fit: contain`, sin nombres en outfit cards, paleta 28px al pie

**Umbrales calibrados con datos reales del clóset:**
- `UMBRAL_MIO = 19` — "¿me favorece?" (camel entra a 18.1, rojo brillante fuera a 20.7)
- `UMBRAL_TENGO = 14` — "¿ya tengo este color?" (compras; 1 prenda no debe cubrir 5 tonos)
- Evitar (choque directo): LAB ≤ 28 contra arquetipos · Wada: LAB ≤ 30 · outfit ✦: ≥60% de colores cromáticos en paleta
- `nombreColor()` nombra por carácter HSL (Vino, Café oscuro, Óxido, Ocre, Terracota, Mostaza…), no por sector de tono

## Diseño — decisiones fijas del usuario

- Helvetica Neue 300, uppercase, letter-spacing (serif editorial RECHAZADA — no volver a proponer)
- Fondo negro en Closet/Outfit/Cargar; acento único **#C9A227 oro viejo** (decisión 2026-07-05: el rojo #ff1a00 se eliminó de toda la app; el oro es el metal de su estación, Otoño Profundo)
- Nav inferior: fondo negro, íconos 19px, inactivo #777, activo oro; altura ~52px (los `calc(100vh - 52px)` dependen de ella)
- Menús: 13px / weight 300 / 1px tracking / UPPERCASE en todas las pestañas
- Móvil <700px: listas de Closet/Outfit compactas (cat-link 6px, arm-link 8px) para caber sin scroll — la versión web no se toca
- Nada de rediseños masivos: mejoras puntuales con aprobación, referencia = app de Zara
- Web ≥700px: columna 1080px las 4 pestañas, grid 3-4 cols, outfits 2-3 lado a lado, modal 2 columnas

## Flujo de desarrollo

```bash
git clone https://ghp_TOKEN@github.com/Roscas84/wardrobe.git /tmp/wardrobe   # token: usuario lo pasa por chat
# editar → extraer <script> y validar con node --check → subir CACHE en sw.js → commit + push
# verificar deploy: curl sw.js en vivo; si se atasca >5 min → commit vacío lo destraba
```

## Pendientes (usuario)

1. Validar v101-v102 (compartir, modo viaje) y **repetir el quiz de Mi Color** (el perfil ya persiste)
2. Llenar cuidados N/O/P en el Excel de las 49 prendas originales → pasar al JSON
3. Cargar la ropa que falta; retomar fotos con maniquí (11) y las 3 que rembg no limpió; foto Overalls ID 49
4. Tallas reales (decisión: sin prioridad)

## Futuro (sin compromiso)

Historial/calendario (pospuesto — requiere registro manual) · estadísticas de uso · detección de patrón · monetización (requeriría backend con cuentas: Supabase/Firebase).
