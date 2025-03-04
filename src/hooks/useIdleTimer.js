import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to track user inactivity
 * @param {number} idleTime - Time in milliseconds before user is considered idle
 * @returns {Object} - Object containing isIdle state and resetTimer function
 */
const useIdleTimer = (idleTime = 20000) => {
  const [isIdle, setIsIdle] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Function to reset the idle state and timer
  const resetIdleState = useCallback(() => {
    setIsIdle(false);
  }, []);

  // Detectar cambios en el tamaño de la ventana para actualizar isMobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // No rastrear inactividad en dispositivos móviles
    if (isMobile) {
      return;
    }
    
    let idleTimer;

    // Function to start the idle timer
    const startIdleTimer = () => {
      // Clear any existing timer
      clearTimeout(idleTimer);
      
      // Set a new timer
      idleTimer = setTimeout(() => {
        setIsIdle(true);
      }, idleTime);
    };

    // Only set up event listeners if not already idle
    if (!isIdle) {
      // Events that should reset the timer
      const events = [
        'mousedown', 'mousemove', 'keypress', 
        'scroll', 'touchstart', 'click', 'touchmove'
      ];
      
      // Event handler function
      const handleUserActivity = () => {
        startIdleTimer();
      };
      
      // Add event listeners
      events.forEach(event => {
        window.addEventListener(event, handleUserActivity);
      });
      
      // Start the initial timer
      startIdleTimer();
      
      // Cleanup function
      return () => {
        clearTimeout(idleTimer);
        events.forEach(event => {
          window.removeEventListener(event, handleUserActivity);
        });
      };
    }
  }, [isIdle, idleTime, isMobile]);

  return { isIdle, resetIdleState };
};

export default useIdleTimer; 