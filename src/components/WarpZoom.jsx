import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";

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

export default WarpZoom;