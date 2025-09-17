# Imágenes del Landing Page

Esta carpeta contiene todas las imágenes específicas para el landing page de EWA Box Water.

## Estructura recomendada:

```
landing/
├── hero/
│   ├── water-bottles.jpg          # Botellas de agua para el hero
│   ├── water-drops.jpg            # Gotas de agua decorativas
│   └── background-pattern.jpg     # Patrón de fondo
├── products/
│   ├── natural-water.jpg          # Agua natural
│   ├── electrolyte-water.jpg      # Agua con electrolitos
│   ├── alkaline-water.jpg         # Agua alcalina
│   └── product-lineup.jpg         # Lineup de productos
├── testimonials/
│   ├── customer-photos/           # Fotos de clientes
│   └── brand-logos/               # Logos de marcas mencionadas
├── about/
│   ├── team-photo.jpg             # Foto del equipo
│   ├── facility.jpg               # Instalaciones
│   └── process.jpg                # Proceso de producción
└── icons/
    ├── features/                  # Iconos de características
    ├── steps/                     # Iconos de pasos
    └── social/                    # Iconos sociales
```

## Uso en componentes:

```tsx
// Ejemplo de uso en componentes
<img 
  src="/images/landing/hero/water-bottles.jpg" 
  alt="Botellas de agua EWA" 
  className="w-full h-auto"
/>
```

## Formatos recomendados:
- **JPG**: Para fotos con muchos colores
- **PNG**: Para imágenes con transparencia
- **SVG**: Para iconos y gráficos vectoriales
- **WebP**: Para optimización (con fallback)

## Tamaños recomendados:
- **Hero images**: 1920x1080px (16:9)
- **Product images**: 800x800px (1:1)
- **Thumbnails**: 400x400px (1:1)
- **Icons**: 64x64px o SVG
