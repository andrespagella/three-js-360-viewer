import React, { useEffect, useState, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Stats } from "@react-three/drei";
import * as THREE from "three";
import Pin from "./Pin";
import WarpZoom from "./WarpZoom";
import TransparentCanvasSphere from "./TransparentCanvasSphere";
import CameraController from "./CameraController";
import InstructionsOverlay from "./InstructionsOverlay";
import HelpButton from "./HelpButton";

// Utilizamos el componente Stats de @react-three/drei que ya está optimizado para React Three Fiber
const StatsPanel = () => {
  return <Stats className="stats-panel" />;
};

const Three360Viewer = ({
  imageUrl,
  pins,
  onOpenCloseup,
  selectedPin,
  onSelectPin,
  developmentMode,
  darkMode,
  currentView,
  selectedItems,
}) => {
  const [texture, setTexture] = useState(null);
  const [warpTarget, setWarpTarget] = useState(null);
  
  // Always show instructions when component mounts (on page load/reload)
  const [showInstructions, setShowInstructions] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imageUrl, (loadedTexture) => {
      loadedTexture.wrapS = THREE.RepeatWrapping;
      loadedTexture.wrapT = THREE.RepeatWrapping;
      // Invertir la repetición en el eje X para corregir la orientación
      loadedTexture.repeat.x = -1;
      setTexture(loadedTexture);
    });
  }, [imageUrl]);

  // Cuando cambia el pin seleccionado, se agenda (tras 600 ms) la animación de warp
  useEffect(() => {
    if (selectedPin && selectedPin.closeup) {
      const timeout = setTimeout(() => {
        setWarpTarget(selectedPin.closeup);
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [selectedPin]);

  // Function to close the instructions overlay
  const handleCloseInstructions = () => {
    setShowInstructions(false);
    // No need to save anything in storage
  };

  // Function to show the instructions overlay
  const handleShowInstructions = () => {
    setShowInstructions(true);
  };

  return (
    <div style={{ position: 'relative', height: '100%', backgroundColor: 'white' }}>
      {showInstructions && <InstructionsOverlay onClose={handleCloseInstructions} />}
      
      {/* Help button to show instructions again */}
      {!showInstructions && <HelpButton onClick={handleShowInstructions} isMobile={isMobile} />}
      
      <Canvas
        camera={{
          fov: 55,
          near: 1,
          far: 2000,
        }}
        style={{ height: "100%" }}
      >
        {/* La cámara rota hacia el pin seleccionado */}
        <CameraController selectedPin={selectedPin} />

        {/* Mostrar el panel de estadísticas solo en modo desarrollo */}
        {developmentMode && <StatsPanel />}

        {texture && (
          <>
            <mesh renderOrder={1}>
              <sphereGeometry args={[5000, 60, 40]} />
              <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} />
            </mesh>

            <TransparentCanvasSphere 
              baseTexture={texture} 
              darkMode={darkMode} 
              currentView={currentView} 
              selectedItems={selectedItems}
            />
          </>
        )}

        {pins.map((pin, index) => (
          <Pin
            key={pin.id || index}
            position={pin.position}
            onClick={() => onSelectPin(pin)}
          />
        ))}

        {warpTarget && (
          <WarpZoom
            onComplete={() => {
              onOpenCloseup();
              setWarpTarget(null);
            }}
          />
        )}
      </Canvas>
    </div>
  );
};

export default Three360Viewer;