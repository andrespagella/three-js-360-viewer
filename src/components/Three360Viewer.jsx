import React, { useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import Loader from "./Loader";
import Pin from "./Pin";

// Componente para realizar el efecto warp drive
const WarpZoom = ({ onComplete }) => {
  const { camera } = useThree();
  const originalFov = camera.fov;
  
  useEffect(() => {
    gsap.to(camera, {
      fov: 30, // Valor muy bajo para dar efecto de warp drive
      duration: 0.5, // Duración de la animación en segundos
      ease: "power2.inOut",
      onUpdate: () => camera.updateProjectionMatrix(),
      onComplete: () => {
        onComplete();
        // Restaurar el fov de inmediato para evitar rebotes
        setTimeout(() => {
          camera.fov = originalFov;
          camera.updateProjectionMatrix();
        }, 500); // pequeño delay para evitar que la imagen rebote antes de cambiar de vista 
      },
    });
  }, [camera, onComplete, originalFov]);
  
  return null;
};

const Three360Viewer = ({ imageUrl, pins, onOpenCloseup }) => {
  const [texture, setTexture] = useState(null);
  // Estado local para activar la animación warp
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

  const handlePinClick = (pin) => {
    if (pin.closeup) {
      // En lugar de llamar a onOpenCloseup inmediatamente, activamos el warp drive
      setWarpTarget(pin.closeup);
    } else {
      alert(`Pin "${pin.label}" clicked!`);
    }
  };

  return (
    <Canvas style={{ height: "100vh" }}>
      <OrbitControls
        // Desactiva el zoom mientras se ejecuta la animación warp para evitar interferencias
        enableZoom={warpTarget ? false : true}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(3 * Math.PI) / 4}
        minDistance={50}
        maxDistance={100}
      />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {texture && (
        <mesh>
          <sphereGeometry args={[500, 60, 40]} />
          <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
        </mesh>
      )}
      {pins.map((pin, index) => (
        <Pin
          key={pin.id || index}
          position={pin.position}
          onClick={() => handlePinClick(pin)}
        />
      ))}
      {/* Loader opcional */}
      {/* <Loader /> */}
      {warpTarget && (
        <WarpZoom
          onComplete={() => {
            // Una vez finaliza la animación, se llama al callback para mostrar el closeup y se restablece warpTarget
            onOpenCloseup(warpTarget);
            setWarpTarget(null);
          }}
        />
      )}
    </Canvas>
  );
};

export default Three360Viewer;