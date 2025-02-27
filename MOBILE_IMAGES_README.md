# Optimización de Imágenes para Dispositivos Móviles

Este proyecto incluye una solución para optimizar automáticamente las imágenes en dispositivos móviles como iPads y iPhones, reduciendo su tamaño y calidad a la mitad para mejorar el rendimiento.

## Cómo funciona

1. **Detección de dispositivos móviles**: La aplicación detecta automáticamente si el usuario está utilizando un iPad o iPhone.

2. **Rutas de imágenes modificadas**: Cuando se detecta un dispositivo móvil, las rutas de las imágenes se modifican para usar versiones optimizadas con el sufijo `-mobile` antes de la extensión.

3. **Generación automática de imágenes**: Se incluye un script que genera automáticamente versiones optimizadas de todas las imágenes en las carpetas `thumbnails`, `closeups` y `overlays`.

## Cómo generar las imágenes optimizadas

1. Instala las dependencias necesarias:

```bash
npm install
```

2. Ejecuta el script de generación de imágenes:

```bash
npm run generate-mobile-images
```

Este script:
- Recorre todas las imágenes en las carpetas `public/thumbnails`, `public/closeups` y `public/overlays`.
- Crea versiones optimizadas con el sufijo `-mobile` antes de la extensión.
- Reduce el tamaño de las imágenes a la mitad y la calidad al 50%.

## Implementación técnica

La solución consta de los siguientes componentes:

1. **Utilidades de imágenes** (`src/utils/imageUtils.js`):
   - `isMobileDevice()`: Detecta si el dispositivo es un iPad o iPhone.
   - `getMobileOptimizedImagePath()`: Modifica la ruta de la imagen para usar la versión optimizada.
   - `processMobileImages()`: Procesa todos los campos de imagen en un objeto JSON.
   - `processMobileCollection()`: Procesa una colección completa de elementos.

2. **Modificaciones en los componentes**:
   - `TransparentCanvasSphere.jsx`: Usa imágenes optimizadas para los overlays.
   - `CollectionPanel.jsx`: Usa imágenes optimizadas para los thumbnails.
   - `App.jsx`: Usa imágenes optimizadas al cargar los datos de los pins.
   - `CloseupViewer.jsx`: Usa imágenes optimizadas para los closeups.

3. **Script de generación de imágenes** (`scripts/generateMobileImages.js`):
   - Genera automáticamente versiones optimizadas de todas las imágenes.

## Ventajas de esta solución

- No requiere modificar los archivos JSON originales.
- Es transparente para el resto de la aplicación.
- Solo carga las imágenes optimizadas en dispositivos móviles.
- Reduce el tamaño y la calidad de las imágenes a la mitad, mejorando el rendimiento en dispositivos móviles.

## Notas importantes

- Las imágenes optimizadas se generan con el mismo formato que las originales, pero con el sufijo `-mobile` antes de la extensión.
- Si una imagen optimizada ya existe, el script no la sobrescribirá.
- El script utiliza la biblioteca `sharp` para procesar las imágenes, que es una de las más eficientes para Node.js. 