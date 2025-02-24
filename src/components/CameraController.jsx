import React, { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

const CameraController = ({ selectedPin }) => {
  const { camera } = useThree();
  const controlsRef = useRef();
  // Almacenar la posición inicial de la cámara
  const initialCameraPosition = useRef(camera.position.clone());

  useEffect(() => {
    if (selectedPin && controlsRef.current) {
      // Ajusta este valor según lo necesites
      const correctionOffset = 50;
      const pinWorldPos = new THREE.Vector3(
        selectedPin.position[0] - correctionOffset,
        selectedPin.position[1],
        selectedPin.position[2]
      );

      const matrix = new THREE.Matrix4();
      matrix.lookAt(camera.position, pinWorldPos, camera.up);
      const targetQuat = new THREE.Quaternion().setFromRotationMatrix(matrix);
      const initialQuat = camera.quaternion.clone();

      controlsRef.current.enabled = false;

      gsap.to({ t: 0 }, {
        t: 1,
        duration: 0.5,
        onUpdate: function () {
          const progress = this.targets()[0].t;
          // Interpolar la rotación
          camera.quaternion.slerpQuaternions(initialQuat, targetQuat, progress);
          // Reestablecer la posición fija
          camera.position.copy(initialCameraPosition.current);
          camera.updateMatrixWorld();
        },
        onComplete: () => {
          // Si OrbitControls utiliza un target relativo, puedes actualizarlo para que no modifique la posición
          const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
          // Usar un offset para que el target siga la dirección pero sin mover la posición base
          const newTarget = initialCameraPosition.current.clone().add(forward.multiplyScalar(100));
          controlsRef.current.target.copy(newTarget);
          controlsRef.current.enabled = true;
          controlsRef.current.update();
        },
      });
    }
  }, [selectedPin, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={true}
      enablePan={false}
      minPolarAngle={Math.PI / 4}
      maxPolarAngle={(3 * Math.PI) / 4}
      minDistance={50}
      maxDistance={100}
    />
  );
};

export default CameraController;