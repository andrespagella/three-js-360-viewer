import React, { useEffect, useState, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import Stats from 'three/examples/jsm/libs/stats.module.js';
import Pin from "./Pin";
import WarpZoom from "./WarpZoom";
import TransparentCanvasSphere from "./TransparentCanvasSphere";
import CameraController from "./CameraController";

// Componente que utiliza el módulo Stats de Three.js
const StatsPanel = () => {
  const { gl } = useThree();
  const statsRef = useRef();
  
  useEffect(() => {
    const stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    statsRef.current.appendChild(stats.dom);
    
    // Estilo para el panel de stats
    stats.dom.style.cssText = 'position:absolute;top:0;left:0;';
    
    // Añadir stats al bucle de renderizado
    const originalRender = gl.render;
    gl.render = function() {
      stats.begin();
      originalRender.apply(this, arguments);
      stats.end();
    };
    
    return () => {
      // Limpiar cuando el componente se desmonte
      if (statsRef.current && statsRef.current.contains(stats.dom)) {
        statsRef.current.removeChild(stats.dom);
      }
      gl.render = originalRender;
    };
  }, [gl]);
  
  return (
    <Html style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      zIndex: 1000
    }}>
      <div ref={statsRef}></div>
    </Html>
  );
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