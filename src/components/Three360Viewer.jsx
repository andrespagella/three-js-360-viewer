import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Pin from "./Pin";
import WarpZoom from "./WarpZoom";
import TransparentCanvasSphere from "./TransparentCanvasSphere";
import CameraController from "./CameraController";
import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

const Three360Viewer = ({
  imageUrl,
  pins,
  onOpenCloseup,
  selectedPin,
  onSelectPin,
  developmentMode,
  darkMode,
  currentView,
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
    <Canvas style={{ height: "100%" }}>
      {/* La cámara rota hacia el pin seleccionado */}
      <CameraController selectedPin={selectedPin} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      {texture && (
        <>
          {/* Esfera 360 con textura - ahora transparente */}
          <mesh renderOrder={1}>
            <sphereGeometry args={[500, 60, 40]} />
            <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} />
          </mesh>
          <TransparentCanvasSphere baseTexture={texture} darkMode={darkMode} currentView={currentView} />
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

      {developmentMode && <DebugCameraInfo />}
    </Canvas>
  );
};

function DebugCameraInfo() {
  const { camera } = useThree();
  const [camInfo, setCamInfo] = useState({
    posX: camera.position.x,
    posY: camera.position.y,
    posZ: camera.position.z,
    rotX: camera.rotation.x,
    rotY: camera.rotation.y,
    rotZ: camera.rotation.z,
    fov: camera.fov,
  });

  // Update the camera info every 100ms (useful for a development overlay)
  useEffect(() => {
    const interval = setInterval(() => {
      setCamInfo({
        posX: camera.position.x,
        posY: camera.position.y,
        posZ: camera.position.z,
        rotX: camera.rotation.x,
        rotY: camera.rotation.y,
        rotZ: camera.rotation.z,
        fov: camera.fov,
      });
    }, 100);
    return () => clearInterval(interval);
  }, [camera]);

  return (
    <Html
      style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        width: "250px",
        background: "rgba(0,0,0,0.5)",
        color: "#fff",
        padding: "5px",
        fontSize: "12px",
        pointerEvents: "none",
      }}
    >
      <div>
        <div>
          Position: x: {camInfo.posX.toFixed(2)}, y: {camInfo.posY.toFixed(2)}, z: {camInfo.posZ.toFixed(2)}
        </div>
        <div>
          Rotation: x: {camInfo.rotX.toFixed(2)}, y: {camInfo.rotY.toFixed(2)}, z: {camInfo.rotZ.toFixed(2)}
        </div>
        <div>FOV: {camInfo.fov.toFixed(2)}</div>
      </div>
    </Html>
  );
}

export default Three360Viewer;