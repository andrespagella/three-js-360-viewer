import React, { useRef } from "react";
import { Billboard } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { TextureLoader } from "three";

const Pin = ({ position, onClick }) => {
  const pulseRef = useRef();
  const pinTexture = useLoader(TextureLoader, "/pin.svg");

  // Parámetros para el círculo blanco y su stroke
  const innerRadius = 10; // Radio del círculo blanco
  const strokeWidth = 2; // Grosor del stroke
  const outerRadius = innerRadius + strokeWidth; // Radio para el stroke y el halo

  useFrame(({ clock }) => {
    // Animación de halo pulsante (ciclo de 2 segundos)
    const t = (clock.getElapsedTime() % 2) / 2; // valor entre 0 y 1
    const pulseScaleFactor = 1 + t * 0.3; // de 1 a 1.3
    if (pulseRef.current) {
      pulseRef.current.scale.set(pulseScaleFactor, pulseScaleFactor, 1);
      pulseRef.current.material.opacity = 1 - t;
    }
  });

  return (
    <Billboard position={position}>
      <group>
        {/* Halo pulsante (círculo blanco expandiéndose) */}
        <mesh ref={pulseRef} renderOrder={11}>
          <circleGeometry args={[outerRadius, 64]} />
          <meshBasicMaterial
            color="violet"
            transparent
            opacity={1}
            depthWrite={false} // Evita que afecte el depth buffer
            blending={THREE.AdditiveBlending} // Sutil efecto de glow
          />
        </mesh>

        {/* Icono en el centro utilizando el sprite nativo de THREE */}
        <sprite renderOrder={14} position={[0, 0, 0.1]} scale={[20, 20, 1]}>
          <spriteMaterial
            attach="material"
            map={pinTexture}
            transparent
            depthTest={false}
          />
        </sprite>
      </group>
    </Billboard>
  );
};

export default Pin;