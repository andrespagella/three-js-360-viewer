import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, useProgress, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const Loader = () => {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
};

const Three360Viewer = ({ imageUrl }) => {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imageUrl, (loadedTexture) => {
      loadedTexture.wrapS = THREE.RepeatWrapping;
      loadedTexture.wrapT = THREE.RepeatWrapping;
      loadedTexture.repeat.x = -1;
      setTexture(loadedTexture);
    });
  }, [imageUrl]);

  return (
    <Canvas style={{ height: "100vh" }}>
      <OrbitControls
        enableZoom={true}
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
          <meshBasicMaterial
            attach="material"
            map={texture}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      {/* <Loader /> */}
    </Canvas>
  );
};

export default Three360Viewer;
