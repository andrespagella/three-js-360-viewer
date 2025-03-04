/**
 * Utility functions for handling fullscreen mode
 * 
 * Note: On iOS and some mobile browsers, fullscreen can only be triggered by a user gesture
 * (like a click or tap) and may have limitations. The fullscreen request must be made
 * within an event handler that was triggered by a user interaction.
 */

/**
 * Request fullscreen mode for the entire document
 * @returns {Promise} A promise that resolves when fullscreen is entered
 */
export const enterFullscreen = () => {
  const docEl = document.documentElement;
  
  if (docEl.requestFullscreen) {
    return docEl.requestFullscreen();
  } else if (docEl.webkitRequestFullscreen) { /* Safari */
    return docEl.webkitRequestFullscreen();
  } else if (docEl.msRequestFullscreen) { /* IE11 */
    return docEl.msRequestFullscreen();
  }
  
  return Promise.reject("Fullscreen API not supported");
};

/**
 * Exit fullscreen mode
 * @returns {Promise} A promise that resolves when fullscreen is exited
 */
export const exitFullscreen = () => {
  if (document.exitFullscreen) {
    return document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    return document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    return document.msExitFullscreen();
  }
  
  return Promise.reject("Fullscreen API not supported");
};

/**
 * Check if the document is currently in fullscreen mode
 * @returns {boolean} True if in fullscreen mode, false otherwise
 */
export const isFullscreen = () => {
  return !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  );
};

/**
 * Toggle fullscreen mode
 * @returns {Promise} A promise that resolves when the fullscreen state changes
 */
export const toggleFullscreen = () => {
  if (isFullscreen()) {
    return exitFullscreen();
  } else {
    return enterFullscreen();
  }
}; 