function getAmbientFilePaths(ambient, darkMode) {
  const mode = darkMode ? "Dark" : "Light";
  let prefix = "";
  if (ambient.name === "Antebaño") {
    prefix = "Bath-";
  } else if (ambient.name === "Baño") {
    prefix = "ShowerArea-";
  }
  if (prefix) {
    return {
      url: `ambientes/${prefix}${mode}.webp`,
      preview: `ambientes/${prefix}${mode}.webp`,
    };
  }
  return {
    url: ambient.url,
    preview: ambient.preview,
  };
}

export default getAmbientFilePaths;
