import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook to track user inactivity
 * @param {number} idleTime - Time in milliseconds before user is considered idle
 * @returns {Object} - Object containing isIdle state and resetTimer function
 */
const useIdleTimer = (idleTime = 120000) => { // Default to 2 minutes
  const [isIdle, setIsIdle] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const idleTimerRef = useRef(null);
  
  // Function to reset the idle state and timer
  const resetIdleState = useCallback(() => {
    console.log('Resetting idle state');
    setIsIdle(false);
    
    // Also restart the timer when manually resetting
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    
    if (!isMobile) {
      idleTimerRef.current = setTimeout(() => {
        console.log('Timer expired, setting idle state to true');
        setIsIdle(true);
      }, idleTime);
    }
  }, [idleTime, isMobile]);

  // Detectar cambios en el tamaño de la ventana para actualizar isMobile
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);
      
      // If switching from mobile to desktop, start the timer
      if (isMobile && !newIsMobile) {
        resetIdleState();
      }
      
      // If switching to mobile, clear the timer
      if (!isMobile && newIsMobile && idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile, resetIdleState]);

  useEffect(() => {
    // No rastrear inactividad en dispositivos móviles
    if (isMobile) {
      return;
    }
    
    console.log(`Setting up idle timer for ${idleTime}ms`);
    
    // Function to start the idle timer
    const startIdleTimer = () => {
      // Clear any existing timer
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      
      // Set a new timer
      idleTimerRef.current = setTimeout(() => {
        console.log('Timer expired, setting idle state to true');
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
        if (isIdle) {
          console.log('User activity detected while idle, resetting state');
          setIsIdle(false);
        }
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
        if (idleTimerRef.current) {
          clearTimeout(idleTimerRef.current);
        }
        events.forEach(event => {
          window.removeEventListener(event, handleUserActivity);
        });
      };
    }
  }, [isIdle, idleTime, isMobile]);

  return { isIdle, resetIdleState };
};

export default useIdleTimer; 