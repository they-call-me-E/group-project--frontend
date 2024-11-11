"use client";

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoidGhleWNhbGxtZWUiLCJhIjoiY2xhZXF6anQxMHgzazNxczNzd2I5em10dyJ9.fa-pBQ_2cMg9H2fD-FBCDg";

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [circleAdded, setCircleAdded] = useState(false);

  useEffect(() => {
    // Initialize the map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-74.5, 40], // Initial map center
      zoom: 8,
    });

    // Add event listener for zoom events
    mapRef.current.on("zoom", handleZoom);

    return () => mapRef.current.remove();
  }, []);

  // Function to handle the zoom event
  const handleZoom = () => {
    const currentZoom = mapRef.current.getZoom();

    // Add circle when zoom level is greater than 10, if not already added
    if (currentZoom > 10 && !circleAdded) {
      addCircle();
    }
  };

  // Function to add a circle to the map
  const addCircle = () => {
    const center = mapRef.current.getCenter().toArray();

    // Circle center GeoJSON data
    const circleData = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: center,
          },
        },
      ],
    };

    // Add a GeoJSON source and a circle layer
    mapRef.current.addSource("circle-source", {
      type: "geojson",
      data: circleData,
    });

    mapRef.current.addLayer({
      id: "circle-layer",
      type: "circle",
      source: "circle-source",
      paint: {
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          5,
          50,
          10,
          100,
          15,
          200,
        ],
        "circle-color": "#007cbf",
        "circle-opacity": 0.4,
      },
    });

    // Attach move event to keep the circle centered
    mapRef.current.on("move", updateCircleCenter);
    setCircleAdded(true);
  };

  // Function to remove the circle from the map
  const removeCircle = () => {
    if (mapRef.current.getLayer("circle-layer")) {
      mapRef.current.removeLayer("circle-layer");
    }
    if (mapRef.current.getSource("circle-source")) {
      mapRef.current.removeSource("circle-source");
    }

    // Remove the move event listener
    mapRef.current.off("move", updateCircleCenter);
    setCircleAdded(false);
  };

  // Update the circle center to match map center when map moves
  const updateCircleCenter = () => {
    const center = mapRef.current.getCenter().toArray();

    const updatedCircleData = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: center,
          },
        },
      ],
    };

    const source = mapRef.current.getSource("circle-source");
    if (source) {
      source.setData(updatedCircleData);
    }
  };

  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />
      {circleAdded && (
        <button
          onClick={removeCircle}
          style={{ position: "absolute", top: 10, left: 10, zIndex: 1 }}
        >
          Remove Circle
        </button>
      )}
    </div>
  );
};

export default MapComponent;
