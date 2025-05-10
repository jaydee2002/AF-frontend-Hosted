import React, { useRef, useEffect } from "react";
import Globe from "react-globe.gl";

const GlobeComponent = ({ latlng, name, population }) => {
  const globeRef = useRef();

  // Focus the globe on the country's coordinates
  useEffect(() => {
    if (globeRef.current && latlng) {
      const [lat, lng] = latlng;
      globeRef.current.pointOfView(
        {
          lat,
          lng,
          altitude: 2.5, // Zoom level
        },
        1000 // Animation duration
      );
    }
  }, [latlng]);

  // Define marker with population-based scaling
  const markers = latlng
    ? [
        {
          id: name,
          name,
          lat: latlng[0],
          lng: latlng[1],
          size: Math.min(1), // Scale size based on population, max 1
          color: "#ff0000",
        },
      ]
    : [];

  return (
    <div
      className="w-full h-64 sm:h-80 rounded-xl overflow-hidden"
      aria-label={`Interactive 3D globe showing ${name}`}
    >
      <Globe
        ref={globeRef}
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-day.jpg"
        backgroundColor="#ffffff"
        width={500}
        height={320}
        pointsData={markers}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointRadius="size"
        pointAltitude={0.1}
        pointsMerge={true}
        pointLabel="name"
        labelSize={0.5}
        labelColor={() => "#ffffff"}
        labelDotRadius={0.3}
        labelAltitude={0.1}
        onPointClick={(point) => {
          console.log("Clicked:", point.name);
        }}
      />
    </div>
  );
};

export default GlobeComponent;
