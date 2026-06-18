# 👔 Sistema Inteligente de Combinación de Ropa y Construcción de Outfits

> **Estilista digital personal** capaz de generar outfits visualmente armoniosos, adecuados para el clima y coherentes con las reglas de colorimetría, estilo y layering.

---

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Objetivos](#objetivos)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Módulos Principales](#módulos-principales)
  - [Inventario de Prendas](#1-inventario-de-prendas)
  - [Sistema de Colorimetría](#2-sistema-de-colorimetría)
  - [Motor de Combinación Cromática](#3-motor-de-combinación-cromática)
  - [Reglas de Estilo](#4-integración-de-reglas-de-estilo)
  - [Sistema de Layering](#5-sistema-de-layering)
  - [Adaptación Climática](#6-adaptación-climática)
  - [Generación de Outfits](#7-generación-de-outfits)
  - [Sistema de Puntuación](#8-sistema-de-puntuación)
  - [Sistema de Filtrado](#9-sistema-de-filtrado)
  - [Visualización del Outfit](#10-visualización-del-outfit)
  - [Inteligencia Artificial](#11-inteligencia-artificial-fase-avanzada)
- [Stack Tecnológico](#stack-tecnológico)
- [Instalación](#instalación)
- [Uso](#uso)
- [Roadmap](#roadmap)
- [Contribución](#contribución)
- [Licencia](#licencia)

---

## Descripción General

El **Sistema Inteligente de Combinación de Ropa** es una herramienta digital que centraliza el guardarropa personal del usuario y, a partir de él, genera recomendaciones de outfits completos aplicando principios avanzados de:

- **Colorimetría** (valores RGB, HEX, HSL y armonías cromáticas)
- **Teoría del estilo** (menswear clásico, streetwear, minimalismo, etc.)
- **Layering estructurado** adaptado a condiciones climáticas
- **Puntuación multicritério** para ordenar y filtrar combinaciones

El sistema funciona como un asistente de moda personal: el usuario registra sus prendas una sola vez y, desde ese momento, puede obtener outfits curados en segundos, con explicación visual y justificación estilística.

---

## Objetivos

### Objetivo General
Desarrollar una herramienta digital capaz de generar recomendaciones de outfits a partir de un inventario personal de prendas, accesorios y calzado, utilizando principios avanzados de colorimetría, teoría del color, armonías cromáticas, reglas de estilo y sistemas de layering adaptados a diferentes condiciones climáticas.

### Objetivos Específicos
1. **Centralizar el inventario** personal de prendas con información visual y técnica.
2. **Almacenar y analizar colores** dominantes y secundarios de cada prenda.
3. **Clasificar prendas** por categoría, subcategoría, temporada y formalidad.
4. **Aplicar reglas de armonía visual** para combinar colores de forma coherente.
5. **Construir outfits completos** con múltiples capas y accesorios.
6. **Adaptar los outfits al clima** y nivel de formalidad requerido.
7. **Generar múltiples alternativas** ordenadas por puntuación de calidad.
8. **Aprender las preferencias** del usuario y mejorar con el tiempo (fase IA).

---

## Arquitectura del Sistema

```
┌──────────────────────────────────────────────────────┐
│                  FRONTEND / UI                       │
│         (Interfaz de usuario, visualización)         │
└─────────────────────┬────────────────────────────────┘
                      │
┌─────────────────────▼────────────────────────────────┐
│                  CORE ENGINE                         │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │ Inventario  │  │  Motor Color │  │   Layering  │ │
│  │  Manager    │  │  & Armonías  │  │   Engine    │ │
│  └─────────────┘  └──────────────┘  └─────────────┘ │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │   Estilo    │  │   Clima &    │  │  Scoring &  │ │
│  │   Rules     │  │  Temporada   │  │  Filtrado   │ │
│  └─────────────┘  └──────────────┘  └─────────────┘ │
└─────────────────────┬────────────────────────────────┘
                      │
┌─────────────────────▼────────────────────────────────┐
│              CAPA DE DATOS / IA                      │
│  ┌──────────────────┐   ┌──────────────────────────┐ │
│  │  Base de Datos   │   │   Módulo IA (Fase 2)     │ │
│  │  (Prendas, imgs) │   │  Análisis visual, ML     │ │
│  └──────────────────┘   └──────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

---

## Módulos Principales

### 1. Inventario de Prendas

Cada prenda registrada en el sistema almacena dos tipos de información:

#### Información Visual
| Campo | Descripción |
|---|---|
| `foto` | Fotografía de la prenda (JPG/PNG/WEBP) |
| `color_principal` | Color dominante detectado |
| `colores_secundarios` | Colores de acento o detalle |
| `textura` | Lisa, vaquera, lana, punto, etc. |
| `patron` | Sólido, rayas, cuadros, estampado, etc. |

#### Información Técnica
| Campo | Descripción |
|---|---|
| `nombre` | Nombre o descripción corta |
| `categoria` | Superior, Inferior, Calzado, Accesorio, etc. |
| `subcategoria` | Camisa, Pantalón, Zapatilla, Cinturón, etc. |
| `material` | Algodón, lana, cuero, sintético, etc. |
| `temporada` | Primavera, Verano, Otoño, Invierno, Todo el año |
| `formalidad` | Formal, Business, Smart Casual, Casual, Streetwear |
| `genero` | Masculino, Femenino, Unisex |
| `marca` | Marca o fabricante |

---

### 2. Sistema de Colorimetría

Cada prenda almacena sus valores de color en tres espacios:

```json
{
  "color_principal": {
    "nombre": "Azul marino",
    "hex": "#1B2A4A",
    "rgb": { "r": 27, "g": 42, "b": 74 },
    "hsl": { "h": 220, "s": 46, "l": 20 }
  },
  "colores_secundarios": [...]
}
```

El sistema utiliza los valores HSL para calcular distancias angulares en la rueda de color y determinar la armonía aplicable entre prendas.

---

### 3. Motor de Combinación Cromática

El motor aplica las siguientes **armonías de color** al combinar prendas:

| Armonía | Descripción | Ángulo HSL |
|---|---|---|
| **Monocromática** | Mismo matiz, variación de saturación/luminosidad | 0° |
| **Análoga** | Matices adyacentes en la rueda de color | ±30° |
| **Complementaria** | Matices opuestos en la rueda | 180° |
| **Complementaria dividida** | Un color + dos adyacentes a su complementario | 150° / 210° |
| **Triádica** | Tres colores equidistantes | 120° |
| **Tetrádica** | Cuatro colores en dos pares complementarios | 90° |
| **Neutros** | Combinaciones con negro, blanco, gris, beige, navy | — |

#### Regla 60/30/10

Distribución visual de color en el outfit completo:

```
60% → Color dominante (pantalón, chaqueta principal)
30% → Color secundario (camisa, abrigo exterior)
10% → Color de acento (accesorio, calzado, detalle)
```

---

### 4. Integración de Reglas de Estilo

El sistema incorpora principios de los siguientes estilos:

| Estilo | Descripción |
|---|---|
| **Menswear Clásico** | Sastrería tradicional, proporciones, tejidos nobles |
| **Business Casual** | Equilibrio entre formal y casual para entornos laborales |
| **Smart Casual** | Elegancia relajada, versatilidad de prendas |
| **Casual** | Comodidad, prendas cotidianas y accesibles |
| **Streetwear** | Influencia urbana, sneakers, prendas de gran tamaño |
| **Minimalismo** | Paleta reducida, siluetas limpias, sin excesos |
| **Estilo Japonés** | Capas, asimetría, texturas, funcionalidad estética |

Cada estilo define reglas específicas sobre:
- Combinaciones de prendas permitidas y no permitidas
- Número de patrones visibles simultáneos
- Proporciones de fit (slim, regular, oversized)
- Reglas de calzado por nivel de formalidad

---

### 5. Sistema de Layering

El sistema construye outfits por capas, considerando todos los elementos visuales:

```
CAPA 0 — Base interior (ropa interior, camiseta interior)
CAPA 1 — Prenda superior base (camisa, camiseta, polo)
CAPA 2 — Prenda intermedia (jersey, sudadera, cardigan)
CAPA 3 — Prenda exterior (chaqueta, abrigo, gabardina)
CAPA 4 — Prenda inferior (pantalón, vaqueros, shorts)
CAPA 5 — Calzado
──────────────────────────────────────────
ACCESORIOS VISIBLES:
  · Cinturón        · Sombrero / gorra
  · Reloj           · Bufanda / pañuelo
  · Gafas           · Calcetines visibles
  · Bolsa / mochila · Cualquier elemento de impacto visual
```

---

### 6. Adaptación Climática

El usuario configura las condiciones climáticas y el sistema ajusta automáticamente el número de capas recomendadas:

| Condición | Temperatura aprox. | Capas recomendadas |
|---|---|---|
| **Caluroso** | +25°C | 2–3 capas |
| **Templado** | 15–24°C | 3–5 capas |
| **Frío** | 5–14°C | 5–7 capas |
| **Nieve / Extremo** | < 5°C | 6–9 capas |

#### Parámetros configurables
- Temperatura en °C o °F
- Estación del año (Primavera / Verano / Otoño / Invierno)
- Intensidad del frío/calor (suave, moderado, intenso)
- Condiciones especiales (lluvia, viento, nieve, humedad)

---

### 7. Generación de Outfits

Al seleccionar una prenda ancla o configurar parámetros, el sistema:

1. Filtra el inventario según clima, temporada y formalidad.
2. Busca combinaciones cromáticamente armoniosas.
3. Construye conjuntos completos respetando las reglas de layering.
4. Genera **múltiples outfits alternativos**.
5. Ordena los resultados por **puntuación de calidad** (mayor a menor).

---

### 8. Sistema de Puntuación

Cada outfit recibe una puntuación compuesta por los siguientes criterios:

| Criterio | Peso | Descripción |
|---|---|---|
| **Compatibilidad cromática** | 30% | Coherencia de armonías de color entre prendas |
| **Coherencia estilística** | 25% | Respeto a las reglas del estilo seleccionado |
| **Adecuación climática** | 20% | Número y tipo de capas según el clima |
| **Equilibrio visual** | 15% | Distribución 60/30/10 y balance de patrones |
| **Coherencia general** | 10% | Consistencia global del outfit |

```
Puntuación Final = Σ (criterio × peso)   → Escala 0–100
```

---

### 9. Sistema de Filtrado

El usuario puede filtrar la generación de outfits por:

- **Temporada** (Primavera, Verano, Otoño, Invierno)
- **Clima** (Cálido, Templado, Frío, Nieve)
- **Formalidad** (Formal → Streetwear)
- **Color dominante** o familia de color
- **Material** (algodón, lana, cuero, etc.)
- **Categoría de prenda** (Superior, Inferior, Accesorio...)
- **Tipo de evento** (Trabajo, Casual, Deporte, Gala, etc.)
- **Número de capas**

---

### 10. Visualización del Outfit

Cada outfit generado se presenta con:

```
┌─────────────────────────────────────────────┐
│  OUTFIT #1  ·  Puntuación: 87/100           │
│  Estilo: Smart Casual  ·  Clima: Templado   │
├─────────────────────────────────────────────┤
│  📸 Imagen de cada prenda                   │
│  🎨 Paleta de colores del outfit            │
│  📋 Lista de prendas con detalle            │
│  🌡️  Capas utilizadas (3 de 5)             │
│  ⭐ Motivo de la recomendación             │
│  📊 Desglose de puntuación                  │
└─────────────────────────────────────────────┘
```

---

### 11. Inteligencia Artificial (Fase Avanzada)

La segunda fase del proyecto integra capacidades de IA:

| Función | Descripción |
|---|---|
| **Análisis de imagen** | Detecta automáticamente colores dominantes desde la foto |
| **Detección de patrones** | Identifica rayas, cuadros, estampados, logos, etc. |
| **Clasificación automática** | Sugiere categoría, subcategoría y formalidad de la prenda |
| **Aprendizaje de preferencias** | Aprende qué outfits el usuario acepta, guarda o descarta |
| **Mejora continua** | Ajusta pesos del scoring según historial del usuario |
| **Detección de tendencias** | Sugiere incorporar prendas según tendencias actuales |

---

## Stack Tecnológico

> ⚠️ El stack definitivo se definirá según las decisiones de implementación. Las opciones consideradas son:

### Frontend
- React / Next.js o Vue.js
- TailwindCSS para estilos
- Canvas API / Three.js para visualización de colores

### Backend
- Node.js + Express o Python + FastAPI
- API REST / GraphQL

### Base de Datos
- PostgreSQL (datos relacionales de prendas)
- MongoDB (documentos de outfits y preferencias)
- Redis (caché de combinaciones frecuentes)

### Almacenamiento de Imágenes
- Cloudinary o AWS S3

### Módulo de IA (Fase 2)
- Python + OpenCV (análisis de imagen)
- TensorFlow / PyTorch (clasificación y aprendizaje)
- API de visión (Google Vision / Clarifai como alternativa rápida)

### Colorimetría
- Librería `chroma.js` (frontend) / `colormath` (Python backend)

---

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/outfit-system.git
cd outfit-system

# Instalar dependencias (frontend)
cd frontend
npm install

# Instalar dependencias (backend)
cd ../backend
npm install   # o pip install -r requirements.txt si Python

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de base de datos, almacenamiento, etc.

# Iniciar en modo desarrollo
npm run dev
```

---

## Uso

### Registrar una prenda
1. Ve a **Inventario → Agregar prenda**.
2. Sube una fotografía de la prenda.
3. Completa los campos (o deja que la IA los complete automáticamente en Fase 2).
4. Guarda.

### Generar un outfit
1. Selecciona una prenda ancla **o** configura los parámetros de clima y formalidad.
2. El sistema genera múltiples outfits ordenados por puntuación.
3. Explora los detalles de cada outfit: prendas, colores, capas y justificación.
4. Guarda los outfits que más te gusten para consultarlos luego.

### Filtrar resultados
Usa los filtros laterales para acotar los resultados por temporada, evento, color, material o número de capas.

---

## Roadmap

### Fase 1 — MVP (en desarrollo)
- [x] Definición de arquitectura y módulos
- [x] Diseño del sistema de colorimetría
- [x] Diseño del motor de armonías cromáticas
- [x] Diseño del sistema de layering y clima
- [x] Diseño del sistema de puntuación
- [ ] Implementación del inventario de prendas (CRUD)
- [ ] Implementación del motor de combinación
- [ ] Interfaz de usuario básica
- [ ] Generación y visualización de outfits
- [ ] Sistema de filtrado

### Fase 2 — Inteligencia Artificial
- [ ] Análisis automático de fotografías
- [ ] Detección de colores dominantes con visión artificial
- [ ] Clasificación automática de prendas
- [ ] Sistema de aprendizaje de preferencias
- [ ] Mejora continua de recomendaciones

### Fase 3 — Funciones Avanzadas
- [ ] App móvil (iOS / Android)
- [ ] Integración con tiendas online para sugerir prendas faltantes
- [ ] Modo viaje (empacar maleta para X días y clima)
- [ ] Compartir outfits en redes sociales
- [ ] Comunidad y valoraciones de outfits

---

## Contribución

Las contribuciones son bienvenidas. Para contribuir:

1. Haz un fork del repositorio.
2. Crea una rama con tu feature: `git checkout -b feature/nombre-feature`
3. Haz commit de tus cambios: `git commit -m 'feat: descripción del cambio'`
4. Haz push a tu rama: `git push origin feature/nombre-feature`
5. Abre un Pull Request detallando los cambios realizados.

Por favor, sigue las convenciones de commits [Conventional Commits](https://www.conventionalcommits.org/).

---

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](./LICENSE) para más detalles.

---

<p align="center">
  Desarrollado con 🧠 lógica de colorimetría y ❤️ pasión por el estilo.
</p>
