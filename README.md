# Mi Guardarropa — PWA de outfits con motor cromático HSL

App web progresiva (PWA) de uso personal para gestionar inventario de ropa y generar outfits basados en teoría del color. Funciona como app instalada en iPhone/Android sin necesidad de App Store.

**URL:** https://roscas84.github.io/wardrobe/

---

## Estado actual

### Lo que funciona hoy

| Módulo | Estado |
|---|---|
| Inventario (Closet) con foto, flip-card y búsqueda por color | Completo |
| Carga de prendas con rembg (fondo eliminado automáticamente) | Completo |
| Extracción automática de colores dominantes al subir foto | Completo |
| Motor cromático HSL — 7 armonías de la color wheel | Completo |
| Pre-check por armonía: todos los ángulos deben tener prenda real | Completo |
| Tolerancia ±15° por posición harmónica (C1 exacto + C2 flexible) | Completo |
| Prendas ancla y prendas del mismo hue que el ancla incluidas | Completo |
| Neutros excluidos de esCompatible (solo entran como fallback) | Completo |
| Paleta de colores en cada outfit (agrupada por posición harmónica) | Completo |
| Badge Sanzo Wada en outfits validados cromáticamente | Completo |
| Layout 60/40 — izquierda: exterior+superior+inferior / derecha: calzado+accesorios | Completo |
| Carrusel horizontal con scroll-snap | Completo |
| Ver todos los outfits en un solo carrusel | Completo |
| Material / composición de tela con porcentajes | Completo |
| Símbolos de cuidado (lavado, secado, plancha) con auto-sugerencia | Completo |
| Service Worker v47 — network-first para HTML, cache-first para imágenes | Completo |

### Inventario actual
- 49 prendas cargadas con foto procesada (rembg)
- 1 foto pendiente: sandalia rope beige (necesita foto sin pie, fondo oscuro)

---

## TODO — Pendientes

### Datos (trabajo manual)
- [ ] Actualizar **cuidados de lavado/secado/plancha** en las 49 prendas existentes (el campo existe pero está vacío en prendas antiguas — requiere editar el JSON o Excel)
- [ ] Foto nueva de **sandalia rope beige** — sin pie, fondo oscuro → rembg → reemplazar `IMG_0625 2.png`
- [ ] Verificar y corregir **tallas reales** en todas las prendas del Excel
- [ ] Revisar prendas con colores multicolor ya cargadas y confirmar que el hex registrado representa el color cromático correcto (no el neutro)

### Lógica / Bugs conocidos
- [ ] **Dos capas exteriores**: el sistema puede generar outfits con blazer + chamarra como exterior simultáneamente — agregar regla que excluya la segunda capa exterior si el ancla ya es exterior
- [ ] **Cuidados en prendas existentes**: las 49 prendas necesitan que alguien llene los campos lavado/secado/plancha manualmente o via Excel

### UX pequeñas
- [ ] Revisar que el menú Outfit esté bien centrado en todos los iPhone (probar en SE y Pro Max)

---

## Lluvia de ideas — Mejoras posibles

### Funcionales (alta prioridad)
1. **Favoritos de outfit** — corazón para guardar outfits que te gustaron; se guardan en localStorage para no perderse al cerrar la app
2. **Historial / calendario** — "¿qué usé esta semana?" para no repetir outfits; fecha + outfit guardados en localStorage
3. **Prendas faltantes** — pestaña o sección que analice el inventario y diga qué colores te faltan para completar armonías (ej: "para cuadrada con el blazer burdeos te falta un tono H≈107°")
4. **Fix bug dos capas exteriores** — el sistema puede generar outfits con blazer + chaqueta denim simultáneamente (ambos son 'exterior'). Regla a implementar: máximo 1 pieza exterior por outfit. Si el ancla ya es exterior, pool('exterior') debe retornar vacío.
5. **Filtro por ocasión** — casual / trabajo / noche — outfits filtrados por contexto antes de escoger ancla

### Colorimetría personal (nueva pestaña)
6. **Análisis de Colorimetría Estacional** — el sistema clasifica personas en 4 estaciones (Primavera / Verano / Otoño / Invierno) según tono de piel, color de ojos y cabello. Cada estación define una paleta de colores que favorece a esa persona.
   - Formulario: usuario ingresa hex de tono de piel, hex de ojos, hex de cabello
   - Sistema calcula si es warm/cool y light/deep
   - Resultado: estación + paleta recomendada
   - Integración con outfits: filtrar o destacar outfits que usen colores de la paleta personal
   - **Nombres de las estaciones:** Primavera (warm+light), Verano (cool+light), Otoño (warm+deep), Invierno (cool+deep)

### Inventario
7. **Estadísticas de uso** — qué prendas aparecen más en outfits, cuáles casi nunca, cuáles nunca
8. **Wishlist de compras** — lista de prendas que falta comprar con el hex objetivo

### Color
9. **Color secundario** — para prendas 50/50 (ej: Lacoste rayas navy/blanco). Regla:
   - Si color1 es neutro → usar color2 como color cromático de la prenda
   - Si color2 es neutro → usar color1
   - Si ambos son cromáticos → usar el de mayor saturación como primario, el otro como secundario
   - El secundario puede ampliar compatibilidad: si color primario no pasa esCompatible pero el secundario sí → la prenda entra al outfit
10. **Detección de patrón en foto** — liso / rayas / cuadros / estampado detectado automáticamente al subir foto

### Experiencia
11. **Compartir outfit** — botón que genera imagen del outfit para compartir por WhatsApp/Instagram
12. **Modo empaque de viaje** — seleccionar N días y clima, genera los outfits para el viaje con las prendas mínimas necesarias
13. **Swipe para descartar** — deslizar un outfit hacia abajo para descartarlo y no verlo en esa sesión

### Técnico
14. **Sincronización en la nube** — actualmente el JSON vive en GitHub; migrar a una base de datos real para edición sin necesidad de Excel
15. **Notificación de mañana** — push notification a las 8am con un outfit sugerido para el día

---

## Arquitectura técnica actual

```
index.html          — App completa (single-file PWA, todo inline)
sw.js               — Service Worker v47
guardarropa.json    — 49 prendas (fuente de verdad)
images/             — PNGs procesados con rembg, 600×800 px
manifest.json       — PWA manifest
```

### Motor de color (HSL)

```
Ancla → getHuesObjetivo() → [target1°, target2°, ...]
Pre-check: cada target debe tener ≥1 prenda no-neutra en inventario
esCompatible: !esNeutro && (dist ≤ 15° de cualquier target || dist ≤ 15° del ancla)
pool(): compatibles → fallback neutros (nunca "todo")
Paleta: agrupar por posición harmónica más cercana → 1 color real por posición
```

### Armonías implementadas

| Armonía | Ángulos objetivo | Colores en paleta |
|---|---|---|
| Análoga | ±30° | 3 |
| Complementaria | +180° | 2 |
| Split complementaria | +150°, +210° | 3 |
| Triádica | +120°, +240° | 3 |
| Tetrádica | +60°, +180°, +240° | 4 |
| Cuadrada | +90°, +180°, +270° | 4 |
| Abstracta | +30°, +150°, +210° | 4 |

---

## Arranque de sesión de desarrollo

```bash
git clone https://ghp_TOKEN@github.com/Roscas84/wardrobe.git /tmp/wardrobe
# trabajar en /tmp/wardrobe/index.html y sw.js
# siempre subir CACHE version en sw.js al hacer push
git add index.html sw.js && git commit -m "descripción" && git push origin main
```
