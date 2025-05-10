import { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";

function CoverSection() {
  const globeEl = useRef();
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: Math.min(window.innerHeight, 1600),
  });
  const isMounted = useRef(false);

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: Math.min(
          window.innerHeight,
          window.innerWidth < 768 ? 400 : 600
        ),
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Globe setup and cube texture background
  useEffect(() => {
    isMounted.current = true;

    if (globeEl.current) {
      // Configure globe controls
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.6;
      globeEl.current.pointOfView({ altitude: 2 }, 1000);

      // Load starry cube texture background
      const cubeTextureLoader = new THREE.CubeTextureLoader();
      cubeTextureLoader.load(
        [
          "https://raw.githubusercontent.com/mrdoob/three.js/r129/examples/textures/cube/Bridge2/posx.jpg",
          "https://raw.githubusercontent.com/mrdoob/three.js/r129/examples/textures/cube/Bridge2/negx.jpg",
          "https://raw.githubusercontent.com/mrdoob/three.js/r129/examples/textures/cube/Bridge2/posy.jpg",
          "https://raw.githubusercontent.com/mrdoob/three.js/r129/examples/textures/cube/Bridge2/negy.jpg",
          "https://raw.githubusercontent.com/mrdoob/three.js/r129/examples/textures/cube/Bridge2/posz.jpg",
          "https://raw.githubusercontent.com/mrdoob/three.js/r129/examples/textures/cube/Bridge2/negz.jpg",
        ],
        (cubeTexture) => {
          if (isMounted.current && globeEl.current) {
            globeEl.current.scene().background = cubeTexture;
          }
        },
        undefined,
        (error) => {
          console.error("Error loading cube texture:", error);
        }
      );
    }

    // Cleanup on unmount
    return () => {
      isMounted.current = false;
      if (globeEl.current && globeEl.current.scene().background) {
        globeEl.current.scene().background.dispose();
        globeEl.current.scene().background = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[60vh] min-h-[400px] max-h-[600px] overflow-hidden">
      {/* Globe */}
      <Globe
        ref={globeEl}
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        showAtmosphere={true}
        atmosphereColor="#1e3a8a"
        atmosphereAltitude={0.25}
        // width={1500}
        height={900}
        width={dimensions.width}
        // height={dimensions.height}
      />

      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-lg">
          Explore the World
        </h1>
        <p className="mt-4 text-sm sm:text-base md:text-lg lg:text-xl max-w-xl drop-shadow">
          Dive into detailed data and learn more about countries around the
          globe.
        </p>
      </div>
    </div>
  );
}

export default CoverSection;
