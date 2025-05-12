# Atrim 3D Showcase

Aplicación de visualización 3D basada en React, Three.js y Vite.

## Requisitos previos

- Node.js (versión recomendada: 18.x o superior)
- npm (incluido con Node.js)

## Instalación

```bash
# Clonar el repositorio (si aplica)
git clone <url-del-repositorio>
cd Atrim3DShowcase

# Instalar dependencias
npm install
```

## Scripts disponibles

- **Desarrollo**: Inicia un servidor de desarrollo local con hot-reload
  ```bash
  npm run dev
  ```

- **Construcción**: Genera archivos optimizados para producción en la carpeta `dist`
  ```bash
  npm run build
  ```

- **Generación de imágenes para móvil**: Crea versiones optimizadas de las imágenes para dispositivos móviles
  ```bash
  npm run generate-mobile-images
  ```

## Configuración HTTPS

El proyecto está configurado para usar HTTPS durante el desarrollo. Se requieren certificados en la carpeta `certs/`. Para modificar esta configuración, edita el archivo `vite.config.js`.

## Parámetros de URL

- **slow=true**: Fuerza el uso de imágenes optimizadas para móviles en cualquier dispositivo, útil para conexiones lentas.
  ```
  https://ejemplo.com/?slow=true
  ```

- **bigscreen=true**: Activa el modo pantalla completa cuando se selecciona un idioma.
  ```
  https://ejemplo.com/?bigscreen=true
  ```

- **lang=es|pt**: Establece el idioma directamente sin mostrar el selector de idiomas. Valores aceptados: 'es' (español) o 'pt' (portugués). Cualquier otro valor cargará por defecto el idioma español.
  ```
  https://ejemplo.com/?lang=es
  https://ejemplo.com/?lang=pt
  ```

- Los parámetros pueden combinarse:
  ```
  https://ejemplo.com/?lang=pt&bigscreen=true
  ```

## Optimización para dispositivos móviles

Este proyecto incluye una solución automática para optimizar imágenes en dispositivos móviles:

1. Las imágenes se reducen al 50% en tamaño y calidad para dispositivos móviles
2. La detección de dispositivos es automática (iPad, iPhone, Android)
3. Ver `MOBILE_IMAGES_README.md` para más información
