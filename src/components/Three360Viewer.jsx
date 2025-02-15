import React, { useEffect, useState, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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
      fov: 30,
      duration: 0.5,
      ease: "power2.inOut",
      onUpdate: () => camera.updateProjectionMatrix(),
      onComplete: () => {
        onComplete();
        setTimeout(() => {
          camera.fov = originalFov;
          camera.updateProjectionMatrix();
        }, 500);
      },
    });
  }, [camera, onComplete, originalFov]);

  return null;
};

/**
 * Componente que genera una esfera overlay a partir de un canvas transparente.
 * El canvas se dimensiona para coincidir con el de la textura 360 (baseTexture)
 * y se actualiza a cada frame. Se le asigna un renderOrder mayor y se activa
 * polygonOffset para asegurarse de que se renderice por sobre la esfera base.
 */
const TransparentCanvasSphere = ({ baseTexture }) => {
  const canvasRef = useRef(document.createElement("canvas"));
  const [canvasTexture] = useState(() => new THREE.CanvasTexture(canvasRef.current));

  useEffect(() => {
    if (baseTexture?.image) {
      const width = baseTexture.image.width;
      const height = baseTexture.image.height;
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      
      // Limpiar el canvas para asegurarnos de que esté en blanco
      ctx.clearRect(0, 0, width, height);

      // Dibujar un rectángulo rojo centrado y proporcional al canvas
      const rectWidth = canvas.width * 0.3;
      const rectHeight = canvas.height * 0.3;
      const rectX = (canvas.width - rectWidth) / 2;
      const rectY = (canvas.height - rectHeight) / 2;
      ctx.fillStyle = "rgba(255, 0, 0, 1.0)";
      ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

      canvasTexture.needsUpdate = true;
    }
  }, [baseTexture, canvasTexture]);

  // Actualiza la textura del canvas en cada frame (en caso de contenido dinámico)
  useFrame(() => {
    canvasTexture.needsUpdate = true;
  });

  return (
    <mesh
      renderOrder={10} // Asegura que se renderice después de la esfera base.
      onBeforeRender={(renderer, scene, camera, geometry, material) => {
        material.polygonOffset = true;
        material.polygonOffsetFactor = -1;
        material.polygonOffsetUnits = -1;
      }}
    >
      {/* Radio ligeramente superior para evitar z-fighting */}
      <sphereGeometry args={[500.05, 60, 40]} />
      <meshBasicMaterial
        map={canvasTexture}
        transparent={true}
        opacity={1}
        depthTest={false}
        side={THREE.BackSide} // Como la cámara está dentro de la esfera, renderea el interior
      />
    </mesh>
  );
};

const Three360Viewer = ({ imageUrl, pins, onOpenCloseup }) => {
  const [texture, setTexture] = useState(null);
  // Estado para activar la animación warp drive
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
      setWarpTarget(pin.closeup);
    } else {
      alert(`Pin "${pin.label}" clicked!`);
    }
  };

  return (
    <Canvas style={{ height: "100vh" }}>
      <OrbitControls
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
        <>
          {/* Esfera base 360 */}
          <mesh renderOrder={1}>
            <sphereGeometry args={[500, 60, 40]} />
            <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
          </mesh>
          {/* Overlay generado a partir del canvas */}
          <TransparentCanvasSphere baseTexture={texture} />
        </>
      )}

      {pins.map((pin, index) => (
        <Pin
          key={pin.id || index}
          position={pin.position}
          onClick={() => handlePinClick(pin)}
        />
      ))}

      {warpTarget && (
        <WarpZoom
          onComplete={() => {
            onOpenCloseup(warpTarget);
            setWarpTarget(null);
          }}
        />
      )}
    </Canvas>
  );
};

export default Three360Viewer;