function getAmbientFilePaths(ambient, darkMode) {
  const mode = darkMode ? "Dark" : "Light";
  let prefix = "";
  
  // Para las imágenes de ambiente (vista 360)
  if (ambient.name === "ambientes.bathroom") {
    prefix = "Bath-";
  } else if (ambient.name === "ambientes.shower") {
    prefix = "ShowerArea-";
  }
  
  // Para las imágenes de preview en la sidebar
  let previewPath = "";
  if (ambient.name === "ambientes.bathroom") {
    previewPath = `/previews/ante-${darkMode ? 'dark' : 'light'}.webp`;
  } else if (ambient.name === "ambientes.shower") {
    previewPath = `/previews/ducha-${darkMode ? 'dark' : 'light'}.webp`;
  }
  
  if (prefix) {
    return {
      url: `ambientes/${prefix}${mode}.webp`,
      preview: previewPath || `ambientes/${prefix}${mode}.webp`,
    };
  }
  
  return {
    url: ambient.url,
    preview: previewPath || ambient.preview,
  };
}

export default getAmbientFilePaths;
