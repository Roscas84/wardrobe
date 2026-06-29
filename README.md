# Mi Guardarropa — PWA de outfits con motor cromático HSL

App web progresiva (PWA) de uso personal para gestionar inventario de ropa y generar outfits basados en teoría del color. Funciona como app instalada en iPhone/Android sin necesidad de App Store.

**URL:** https://roscas84.github.io/wardrobe/
**Repo:** https://github.com/Roscas84/wardrobe (privado)

---

## Estado actual — SW v67

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
| Service Worker v67 — network-first para HTML/JSON, cache-first para imágenes | Completo |

### Inventario actual
- 49 prendas cargadas con foto procesada (WebP, 1200×1600 px, fondo transparente)
- Imágenes respaldadas en: `/Users/angelalcantara/Claude/Proyects/Wardrobe/Inventory/images_procesadas/`
- Excel fuente de verdad: `/Users/angelalcantara/Claude/Proyects/Wardrobe/Inventory/Mi_Guardarropa_v3.xlsx`

---

## TODO — Pendientes

### Datos (trabajo manual)
- [ ] Actualizar **cuidados de lavado/secado/plancha** en las 49 prendas existentes
- [ ] Foto nueva de **sandalia rope beige** (ID 28) — sin pie, fondo oscuro
- [ ] Verificar y corregir **tallas reales** en todas las prendas

### Lógica / Bugs conocidos
- [ ] **Dos capas exteriores**: puede generar outfits con blazer + chamarra simultáneamente — excluir segunda capa exterior si el ancla ya es exterior
- [ ] **ID 49 Overalls**: canvas fill 23.1% con bbox sospechosamente angosto (346px wide) — posible artefacto rembg

### UX pequeñas
- [ ] Revisar que el menú Outfit esté bien centrado en todos los iPhone (SE y Pro Max)

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

---

## Lluvia de ideas — Mejoras posibles

### Funcionales (alta prioridad)
1. **Favoritos de outfit** — corazón para guardar outfits; guardados en localStorage
2. **Historial / calendario** — "¿qué usé esta semana?" para no repetir outfits
3. **Prendas faltantes** — analiza el inventario y dice qué colores faltan para completar armonías
4. **Filtro por ocasión** — casual / trabajo / noche

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
sw.js               — Service Worker v67
guardarropa.json    — 49 prendas (fuente de verdad, siempre se carga al iniciar)
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
