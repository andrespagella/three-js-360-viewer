import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// Obtener el directorio actual en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directorios que contienen imágenes
const imageDirectories = [
  'public/thumbnails',
  'public/closeups',
  'public/overlays'
];

// Función para procesar una imagen y crear su versión móvil
async function processMobileImage(imagePath) {
  try {
    // Obtener información de la ruta
    const dir = path.dirname(imagePath);
    const ext = path.extname(imagePath);
    const baseName = path.basename(imagePath, ext);
    const outputPath = path.join(dir, `${baseName}-mobile${ext}`);
    
    // Verificar si la imagen móvil ya existe
    if (fs.existsSync(outputPath)) {
      console.log(`La imagen móvil ya existe: ${outputPath}`);
      return;
    }
    
    // Procesar la imagen con sharp
    const metadata = await sharp(imagePath).metadata();
    await sharp(imagePath)
      .resize({ width: Math.floor(metadata.width / 2) }) // Reducir a la mitad del ancho
      .webp({ quality: 50 }) // Reducir la calidad al 50%
      .toFile(outputPath);
    
    console.log(`Imagen móvil generada: ${outputPath}`);
  } catch (error) {
    console.error(`Error al procesar la imagen ${imagePath}:`, error);
  }
}

// Función para recorrer un directorio y procesar todas las imágenes
async function processDirectory(directory) {
  try {
    // Verificar si el directorio existe
    if (!fs.existsSync(directory)) {
      console.log(`El directorio ${directory} no existe. Saltando...`);
      return;
    }
    
    const files = fs.readdirSync(directory);
    
    for (const file of files) {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // Si es un directorio, procesarlo recursivamente
        await processDirectory(filePath);
      } else if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
        // Si es una imagen, procesarla
        await processMobileImage(filePath);
      }
    }
  } catch (error) {
    console.error(`Error al procesar el directorio ${directory}:`, error);
  }
}

// Función principal
async function main() {
  console.log('Iniciando generación de imágenes para dispositivos móviles...');
  
  // Verificar si sharp está disponible
  try {
    // En ES modules no podemos usar require.resolve, así que simplemente
    // confiamos en que la importación de sharp ya habría fallado si no estuviera instalado
    console.log('Usando sharp para procesar imágenes...');
  } catch (error) {
    console.error('Error al inicializar sharp:', error);
    process.exit(1);
  }
  
  // Procesar cada directorio de imágenes
  for (const directory of imageDirectories) {
    console.log(`Procesando directorio: ${directory}`);
    await processDirectory(directory);
  }
  
  console.log('Generación de imágenes para dispositivos móviles completada.');
}

main(); 