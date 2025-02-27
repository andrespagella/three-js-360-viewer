import React, { useEffect, useState, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Stats } from "@react-three/drei";
import * as THREE from "three";
import Pin from "./Pin";
import WarpZoom from "./WarpZoom";
import TransparentCanvasSphere from "./TransparentCanvasSphere";
import CameraController from "./CameraController";

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

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <Canvas style={{ height: "100%" }}>
        {/* La cámara rota hacia el pin seleccionado */}
        <CameraController selectedPin={selectedPin} />

        {/* Mostrar el panel de estadísticas solo en modo desarrollo */}
        {developmentMode && <StatsPanel />}

        {texture && (
          <>
            <mesh renderOrder={1}>
              <sphereGeometry args={[500, 60, 40]} />
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