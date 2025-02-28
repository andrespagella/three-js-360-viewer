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

  // Establecer la rotación inicial de la cámara para mirar más hacia la derecha y un poco hacia abajo
  useEffect(() => {
    if (controlsRef.current) {
      
      // Rotar la cámara hacia la derecha para que vea la union entre ducha y ventana
      const horizontalRotationAngle = -Math.PI / 3;
      
      // Añadir una rotación sutil hacia abajo
      const verticalRotationAngle = Math.PI / -10; // Ángulo sutil hacia abajo
      
      // Crear quaternions para ambas rotaciones
      const horizontalQuaternion = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0), // Eje Y para rotación horizontal
        horizontalRotationAngle
      );
      
      const verticalQuaternion = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(1, 0, 0), // Eje X para rotación vertical
        verticalRotationAngle
      );
      
      // Combinar ambas rotaciones
      const quaternion = new THREE.Quaternion().multiplyQuaternions(verticalQuaternion, horizontalQuaternion);
      
      // Aplicar la rotación a la cámara
      camera.quaternion.copy(quaternion);
      camera.updateMatrixWorld();
      
      // Actualizar el target de OrbitControls para que coincida con la nueva dirección
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      const newTarget = camera.position.clone().add(forward.multiplyScalar(100));
      controlsRef.current.target.copy(newTarget);
      controlsRef.current.update();
    }
  }, [camera]);

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