import React, { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

const CameraController = ({ selectedPin }) => {
  const { camera } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    if (selectedPin && controlsRef.current) {
      // Ajusta este valor hasta alinear correctamente la vista.
      // Si la cámara apunta "demasiado a la derecha", prueba con un valor positivo para desplazar el objetivo hacia la izquierda.
      const correctionOffset = 50; // valor en unidades del mundo, ajústalo según necesites

      // Calcular la posición del pin en mundo; se invierte la X para compensar la inversión de la textura,
      // y se aplica el offset en X.
      const pinWorldPos = new THREE.Vector3(
        selectedPin.position[0]- correctionOffset,
        selectedPin.position[1],
        selectedPin.position[2]
      );

      // Generar la matriz "lookAt" (sin modificar la cámara)
      const matrix = new THREE.Matrix4();
      matrix.lookAt(camera.position, pinWorldPos, camera.up);

      // Extraer el cuaternión objetivo de la matriz
      const targetQuat = new THREE.Quaternion().setFromRotationMatrix(matrix);

      // Alternativa con corrección angular (comentada):
      // Si prefieres aplicar una corrección en la orientación,
      // descomenta las siguientes líneas y ajusta correctionAngle (en radianes).
      // const correctionAngle = 0.1; // prueba valores positivos o negativos según el resultado deseado
      // const correctionQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), correctionAngle);
      // targetQuat.multiply(correctionQuat);

      // Clonar el cuaternión actual de la cámara
      const initialQuat = camera.quaternion.clone();

      // Desactivar OrbitControls durante la animación para evitar interferencias
      controlsRef.current.enabled = false;

      gsap.to({ t: 0 }, {
        t: 1,
        duration: 0.5,
        onUpdate: function () {
          const progress = this.targets()[0].t;
          // Interpolar el cuaternión de la cámara sin modificar su posición
          camera.quaternion.slerpQuaternions(initialQuat, targetQuat, progress);
          camera.updateMatrixWorld();
        },
        onComplete: () => {
          // Actualizar el target de OrbitControls para que concuerde con la nueva dirección
          const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
          const newTarget = camera.position.clone().add(forward.multiplyScalar(100));
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