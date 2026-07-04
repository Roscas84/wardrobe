# Mi Guardarropa — PWA de outfits con motor cromático HSL

App web progresiva (PWA) de uso personal para gestionar inventario de ropa y generar outfits basados en teoría del color. Funciona como app instalada en iPhone/Android sin necesidad de App Store.

**URL:** https://roscas84.github.io/wardrobe/
**Repo:** https://github.com/Roscas84/wardrobe (privado)

---

## Estado actual — SW v89

### Lo que funciona hoy

| Módulo | Estado |
|---|---|
| Inventario (Closet) con foto flip-card | Completo |
| Búsqueda por color — burbujas con conteo | Completo |
| Carga de prendas con rembg (fondo eliminado automáticamente) | Completo |
| Normalización automática de proporciones al subir foto | Completo |
| Extracción automática de colores dominantes al subir foto | Completo |
| Sincronización GitHub: fotos nuevas se suben al repo automáticamente | Completo |
| Motor cromático HSL — 7 armonías de la color wheel | Completo |
| Pre-check por armonía: todos los ángulos deben tener prenda real | Completo |
| Tolerancia ±15° por posición harmónica (C1 exacto + C2 flexible) | Completo |
| Neutros excluidos de esCompatible (solo entran como fallback) | Completo |
| Paleta de colores en cada outfit (agrupada por posición harmónica) | Completo |
| Badge Sanzo Wada en outfits validados cromáticamente | Completo |
| Layout 60/40 — izquierda: exterior+superior+inferior / derecha: calzado+accesorios | Completo |
| Carrusel horizontal con scroll-snap | Completo |
| Material / composición de tela con porcentajes | Completo |
| Símbolos de cuidado (lavado, secado, plancha) con auto-sugerencia | Completo |
| Service Worker v89 — network-first para HTML/JSON, cache-first para imágenes | Completo |
| Sección "Ajustes" colapsable en Cargar (Datos/GitHub/Remove.bg) | Completo |
| Eliminaciones propagadas entre dispositivos (tombstones en guardarropa.json) | Completo |
| API key de remove.bg en localStorage por dispositivo (nunca en el código) | Completo |

### Inventario actual
- 52 prendas cargadas con foto procesada (WebP, 1200×1600 px, fondo transparente)
- Imágenes respaldadas en: `/Users/angelalcantara/Claude/Proyects/Wardrobe/Inventory/images_procesadas/`
- Excel fuente de verdad: `/Users/angelalcantara/Claude/Proyects/Wardrobe/Inventory/Mi_Guardarropa_v3.xlsx`

---

## TODO — Pendientes

### Datos (trabajo manual)
- [ ] Actualizar **cuidados de lavado/secado/plancha** en las 49 prendas originales (Excel con dropdowns listo)
- [ ] Verificar y corregir **tallas reales** en todas las prendas (decisión 2026-07-01: no prioridad)
- [ ] Pegar la **API key de remove.bg** en cada dispositivo (app → Cargar → Remove.bg) — desde 2026-07-04 ya no va en el código

### Lógica / Bugs conocidos
- [ ] **ID 49 Overalls**: canvas fill 23.1% con bbox sospechosamente angosto (346px wide) — posible artefacto rembg
- Nota: el bug "dos capas exteriores" (blazer + chamarra juntos) **no es reproducible en el código actual** (revisión 2026-07-04) — ninguna ruta de `generarParaArmonia` agrega dos exteriores; verificar en la app antes de reabrir

### UX pequeñas
- [ ] Revisar que el menú Outfit esté bien centrado en todos los iPhone (SE y Pro Max)

### Diseño
- [x] ~~Ejecutar el skill ui-ux-pro-max~~ — se aplicó el paquete "Minimalist Monochrome + Playfair Display" (SW v73) y **se revirtió el mismo día**: al usuario no le gustó; solo se conservó el acordeón "Ajustes" en Cargar. NO volver a proponer serif editorial ni cambios masivos de estilo.
- [ ] **Nueva dirección de diseño basada en referencias de Zara**: el usuario subirá capturas de la app de Zara a una carpeta local para extraer ideas (tipografía, arquitectura de pantallas) y aplicar mejoras puntuales sobre la base actual, sin romperla

---

## Pipeline de imágenes

### Procesamiento estándar (Python)
```
Fuente: /Inventory/Images/{nombre}.png o .webp
→ Verificar modo PIL:
   - RGBA → usar directamente (usuario ya removió fondo)
   - RGB  → rembg isnet-general-use (elimina fondo)
→ PIL enhance: Contrast×1.12, Color×1.15, Sharpness×1.30, UnsharpMask(1.0,50,3)
→ auto_crop_dominant: bbox no-transparente + 5% margen → escalar por dimensión dominante al 90% fill → canvas 1200×1600 RGBA
→ Guardar WebP quality=85
→ Respaldar en images_procesadas/
→ git add + commit + push
```

### Normalización automática al subir desde la app
```
cargarFoto() → removerFondo() (rembg en browser) → normalizarProporcion() (Canvas API)
→ misma lógica: bbox + escala por dimensión dominante al 90% fill → 1200×1600
→ si token GitHub configurado: subirFotoGitHub() + subirJsonGitHub()
→ si no hay token: guardar en localStorage del dispositivo
```

### Sincronización GitHub desde la app
El token se guarda en `localStorage` del dispositivo (nunca en el código).
Configurar en: app → pestaña Cargar → sección "Sincronización GitHub".
Permisos necesarios: `repo` (Personal Access Token classic).

La API key de remove.bg también vive en `localStorage` (`rmbg_key`), configurable en
app → Cargar → "Remove.bg — quitar fondo". Sin key, la foto se guarda sin quitar el fondo.

**Formato de `guardarropa.json` (desde 2026-07-04):** `{prendas: [...], deleted: [ids]}`.
`deleted` son tombstones: IDs eliminados que ningún dispositivo debe revivir. Al subir el JSON
se hace unión con los tombstones remotos para no pisar eliminaciones de otros dispositivos.
El loader también acepta el formato legado (array plano).

**Fotos editadas:** al resubir una foto se guarda la ruta con `?v=<timestamp>` para invalidar
el cache-first del service worker (misma URL nunca se revalida).

---

## Roadmap decidido con el usuario — 2026-07-04

| # | Función | Descripción acordada | Estado |
|---|---|---|---|
| 1 | **Favoritos** | ♥ en outfit card (rojo #ff1a00 al activar) + link "Favoritos" en Outfit paso 1; sync en guardarropa.json (`favs`) | ✅ Hecho (SW v80) |
| 2 | **Color secundario** | Campo opcional color2; el motor combina por ambos colores (rayas = combinación de fábrica); búsqueda por color y paleta lo incluyen | ✅ Hecho (SW v80) |
| 3 | **Desbloqueo de looks** | Franjas de color a lo ancho (nombre + hex como referencia de compra) con el número de looks que desbloquea; en Closet | ✅ Hecho (SW v80) |
| 3b | **Gotero de color** | Botón gotero en las 3 barras de color: toma el color exacto tocando la foto (iPhone) o con el gotero nativo del sistema (Chrome escritorio) | ✅ Hecho (SW v83) |
| 4 | **Colorimetría personal** | Pestaña independiente: cuestionario (piel/ojos/cabello) → estación → paleta personal → badge en outfits que favorecen. Requiere cargar BD de 4 estaciones | Pendiente — sesión dedicada |
| 5 | **Compartir outfit** | Genera imagen del look (canvas: collage + paleta + marca) → hoja de compartir iOS (WhatsApp/IG/Fotos) | Pendiente |
| 6 | **Sistema de capas medio/base** | (pendiente previo) hoodie+playera combinables; ver sección de migración abajo | Pendiente |
| 7 | **Modo viaje** | N días → cápsula mínima de prendas + look por día | Al final |
| — | ~~Filtro por ocasión~~ | Descartado por el usuario (ya existe campo formalidad) | ✗ |
| — | ~~Historial/calendario~~ | Pospuesto: requiere registro manual diario, dudosa adopción | ⏸ |
| — | Estadísticas de uso / Wishlist | Fusionadas conceptualmente con Desbloqueo de looks | → #3 |

### Ideas restantes (sin compromiso)

### Sistema de capas — rediseño de posiciones (pendiente)

**Problema actual:** `exterior`, `superior`, `inferior` — hoodie y playera caen en `superior`, nunca se combinan.

**Solución propuesta:** agregar posición `medio` (hoodie/suéter) y `base` (playera/camisa).

| Posición actual | Propuesta | Prendas |
|---|---|---|
| `exterior` | `exterior` | abrigo, chamarra, trench |
| `exterior` | `medio` | blazer, cardigan, chaqueta denim |
| `superior` | `medio` | hoodie, suéter |
| `superior` | `base` | playera, camiseta, camisa, polo |

**Combinaciones válidas:**
```
Nivel 1: [base + inferior]
Nivel 2a: [medio + base + inferior]
Nivel 2b: [exterior + base + inferior]
Nivel 3: [exterior + medio + base + inferior]
```

**Migración necesaria:**
1. Renombrar `superior` → `base` o `medio` en `guardarropa.json`
2. Actualizar `getPosicion()` en `index.html`
3. Reescribir `generarParaArmonia()`
4. Actualizar layout de outfit card

### Colorimetría personal
5. **Análisis Estacional** — Primavera/Verano/Otoño/Invierno según tono de piel, ojos y cabello
   - warm+light = Primavera, cool+light = Verano, warm+deep = Otoño, cool+deep = Invierno
   - Integrar con outfits: destacar outfits de la paleta personal

### Inventario
6. **Estadísticas de uso** — qué prendas aparecen más/menos en outfits
7. **Wishlist** — prendas por comprar con hex objetivo

### Color
8. **Color secundario** — prendas 50/50 (rayas, etc.) con dos hexes
9. **Detección de patrón** — liso / rayas / cuadros / estampado al subir foto

### Experiencia
10. **Compartir outfit** — imagen para WhatsApp/Instagram
11. **Modo viaje** — N días + clima → outfits mínimos
12. **Swipe para descartar** — deslizar outfit hacia abajo

---

## Arquitectura técnica

```
index.html          — App completa (single-file PWA, todo inline)
sw.js               — Service Worker v89
guardarropa.json    — {prendas, deleted} — 52 prendas (fuente de verdad, siempre se carga al iniciar)
images/             — WebPs procesados con rembg, 1200×1600 px, fondo transparente
manifest.json       — PWA manifest
```

### Motor de color (HSL)

```
Ancla → getHuesObjetivo() → [target1°, target2°, ...]
Pre-check: cada target debe tener ≥1 prenda no-neutra en inventario
esCompatible: !esNeutro && (dist ≤ 15° de cualquier target || dist ≤ 15° del ancla)
pool(): compatibles → fallback neutros (nunca "todo el inventario")
Paleta: agrupar por posición harmónica → 1 color real por posición
```

### Armonías implementadas

| Armonía | Ángulos objetivo | Colores |
|---|---|---|
| Análoga | ±30° | 3 |
| Complementaria | +180° | 2 |
| Split complementaria | +150°, +210° | 3 |
| Triádica | +120°, +240° | 3 |
| Tetrádica | +60°, +180°, +240° | 4 |
| Cuadrada | +90°, +180°, +270° | 4 |
| Abstracta | +30°, +150°, +210° | 4 |

### Invariantes que NO deben cambiar
- `TOLERANCIA = 15` — garantiza sin solapamiento entre armonías adyacentes
- Neutros NUNCA en `esCompatible` — solo fallback
- `pool()` fallback: solo neutros, nunca "todo el inventario"
- `object-fit: contain` — nunca recortar prendas
- Sin nombres en outfit cards — solo imagen + paleta + badge Wada
- Fondo negro en Closet y Outfit

---

## Arranque de sesión de desarrollo

```bash
git clone https://ghp_TOKEN@github.com/Roscas84/wardrobe.git /tmp/wardrobe
# trabajar en /tmp/wardrobe/index.html y sw.js
# siempre subir versión de CACHE en sw.js al hacer push
git add index.html sw.js && git commit -m "descripción" && git push
```

**Backup local de imágenes:**
```bash
# Respaldar imágenes procesadas a carpeta local
cp /tmp/wardrobe/images/*.webp "/Users/angelalcantara/Claude/Proyects/Wardrobe/Inventory/images_procesadas/"
```
