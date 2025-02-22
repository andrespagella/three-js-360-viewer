import React, { useEffect, useState, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import Pin from "./Pin";
import WarpZoom from "./WarpZoom";
import TransparentCanvasSphere from "./TransparentCanvasSphere";
import CameraController from "./CameraController";

const Three360Viewer = ({ imageUrl, pins, onOpenCloseup, selectedPin }) => {
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

  const handlePinClick = (pin) => {
    if (pin.closeup) {
      setWarpTarget(pin.closeup);
    } else {
      alert(`Pin "${pin.label}" clicked!`);
    }
  };

  return (
    <Canvas style={{ height: "100vh" }}>
      {/* Componente que maneja la rotación de la cámara basado en el pin seleccionado */}
      <CameraController selectedPin={selectedPin} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      {texture && (
        <>
          {/* Esfera 360 base */}
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