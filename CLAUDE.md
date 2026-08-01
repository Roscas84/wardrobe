# Mi Guardarropa — Guía de sesión para Claude

App PWA personal de inventario + outfits por teoría del color. Usuario = **Otoño Profundo**. Estado actual: **v122, FINALIZADA** — solo mantenimiento y ajustes puntuales.

- **App en vivo:** https://roscas84.github.io/wardrobe/
- **Repo:** https://github.com/Roscas84/wardrobe (privado)
- **Clon permanente en esta Mac:** `/Users/angelalcantara/wardrobe` (este directorio)
- **Clon de trabajo en sesión:** `/tmp/wardrobe`

## Leer primero

El `README.md` de este repo es el mapa completo: arquitectura, motor de color, invariantes, saber operativo y pendientes. No re-derivar nada que esté ahí.

## Arranque de sesión

1. Clonar/actualizar a `/tmp/wardrobe`:
   ```bash
   # Si ya existe:
   git -C /tmp/wardrobe pull
   # Si no existe — extraer token del index público:
   curl -s https://roscas84.github.io/wardrobe/index.html | grep -oE "_K[AB]='[^']*'"
   # concatenar _KA+_KB y base64 -d → token ghp_…
   git clone "https://<token>@github.com/Roscas84/wardrobe.git" /tmp/wardrobe
   ```
2. Tokens embebidos en `index.html`: GitHub en `_KA+_KB`, remove.bg en `_KR`. No pedirlos por chat.
3. El token de GitHub no tiene expiración (renovado 2026-08-01). Si da 401: generar nuevo en GitHub → Settings → Developer settings → Personal access tokens (classic) → scope `repo` → actualizar `_KA`/`_KB`.

## Ciclo de cambio

```
editar index.html → subir CACHE en sw.js → commit + push → verificar con curl sw.js en vivo
```
Si tras ~5 min GitHub Pages no actualiza: hacer commit vacío para destrabar.

## Invariantes del motor (NO tocar sin aprobación)

- `TOLERANCIA = 15`, `UMBRAL_MIO = 19`, `UMBRAL_TENGO = 14`
- Neutros nunca en `esCompatible`
- `object-fit:contain`, sin nombres en outfit cards
- Fondo negro, acento único `#C9A227`, Helvetica Neue 300 uppercase
- **Serif editorial RECHAZADA** — no volver a proponer
- No rediseños masivos; cambios riesgosos por fases con aprobación

## Pendientes activos

1. iPhone real: validar lupa del gotero (v122) y look card nueva
2. Capturar `color2` de camiseta de rayas id `1783712099719` — campo es `color2`, no `color1`
3. 8 prendas sin subtipo/patrón (si el usuario completa el Excel)

## Cómo trabaja el usuario

Dicta por voz — errores frecuentes de transcripción:
- "Sarah" = Zara · "Judith" = hoodie · "Deluxe/lux" = de looks · "Remi" = memoria/README · "Rhythm" = README

Cuando dice **"antes de ejecutar respóndeme"** → DETENERSE y responder antes de tocar código.
