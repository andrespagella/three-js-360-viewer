import React, { useRef } from "react";
import { Billboard } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { TextureLoader } from "three";

const Pin = ({ position, onClick }) => {
  const pulseRef = useRef();
  const pinTexture = useLoader(TextureLoader, "/pin.svg");
  const haloTexture = useLoader(TextureLoader, "/halo.svg");

  const pinRadius = 12;

  useFrame(({ clock }) => {
    // Animación del halo pulsante (ciclo sinusoidal de 2 segundos)
    const pulse = (1 - Math.cos(clock.getElapsedTime() * Math.PI)) / 2; // valor entre 0 y 1 de forma sinusoidal
    const pulseScaleFactor = 1 + pulse * 0.3; // escala de 1 a 1.3 de manera sinusoidal
    if (pulseRef.current) {
      pulseRef.current.scale.set(pulseScaleFactor, pulseScaleFactor, 1);
      // Se actualiza la opacidad del material para crear el efecto pulsante de manera sinusoidal
      pulseRef.current.material.opacity = 1 - pulse;
    }
  });

  return (
    <Billboard position={position}>
      <group onClick={(e) => { 
        e.stopPropagation(); 
        onClick && onClick(); 
      }}>
        {/* Halo pulsante utilizando una textura para bordes difuminados */}
        <mesh ref={pulseRef} renderOrder={11}>
          <circleGeometry args={[pinRadius + 2, 64]} />
          <meshBasicMaterial
            map={haloTexture}
            transparent
            depthWrite={false} // Evita que afecte el depth buffer
            opacity={1} // Se controla en la animación
            blending={THREE.NormalBlending}
          />
        </mesh>

        {/* Icono en el centro utilizando el sprite */}
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