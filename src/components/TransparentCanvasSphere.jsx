import React, { useMemo } from "react";
import * as THREE from "three";

const TransparentCanvasSphere = ({ baseTexture }) => {
  // Usamos useMemo para crear una textura de canvas que se instancie sólo una vez.
  const overlayTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    // Ejemplo: dibujar un fondo semi-transparente o un gradiente.
    const gradient = ctx.createRadialGradient(256, 256, 10, 256, 256, 256);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.5)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial
        map={overlayTexture}
        side={THREE.DoubleSide}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
};

export default TransparentCanvasSphere;