"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import Slider from "@mui/material/Slider";
import styles from "./MapComponent.module.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoidGhleWNhbGxtZWUiLCJhIjoiY2xhZXF6anQxMHgzazNxczNzd2I5em10dyJ9.fa-pBQ_2cMg9H2fD-FBCDg";

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

const MapComponent: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [radius, setRadius] = useState(30); // Initial radius in meters

  useEffect(() => {
    if (mapContainerRef.current) {
      mapInstanceRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-74.006, 40.7128],
        zoom: 12,
      });

      mapInstanceRef.current.on("load", () => {
        addCircleLayer();
        updateCircleCenter(mapInstanceRef.current!.getCenter()!);
      });

      mapInstanceRef.current.on("moveend", () => {
        const center = mapInstanceRef.current?.getCenter();
        if (center) {
          fetchAddress(center.lat, center.lng);
          updateCircleCenter(center);
        }
      });
    }

    return () => {
      mapInstanceRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current?.getLayer("circle-layer")) {
      mapInstanceRef.current.setPaintProperty(
        "circle-layer",
        "circle-radius",
        radius
      );
    }
  }, [radius]);

  const fetchAddress = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`
      );
      const address =
        response.data.features[0]?.place_name || "Address not found";
      setLocationData({ latitude, longitude, address });
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const addCircleLayer = () => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Add circle source and layer
    map.addSource("circle-source", {
      type: "geojson",

      // @ts-ignore
      data: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: map.getCenter()?.toArray() || [-74.006, 40.7128],
        },
      },
    });

    map.addLayer({
      id: "circle-layer",
      type: "circle",
      source: "circle-source",
      paint: {
        "circle-radius": radius,
        "circle-color": "#3FB1CE",
        "circle-opacity": 0.2,
      },
    });
  };

  const updateCircleCenter = (center: mapboxgl.LngLat) => {
    if (
      mapInstanceRef.current &&
      mapInstanceRef.current.getSource("circle-source")
    ) {
      const newCenter: any = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [center.lng, center.lat],
        },
      };
      (
        mapInstanceRef.current.getSource(
          "circle-source"
        ) as mapboxgl.GeoJSONSource
      ).setData(newCenter);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Map container with fixed width and height */}
      <div
        ref={mapContainerRef}
        style={{
          width: "500px",
          height: "500px",
          position: "relative",
        }}
      ></div>

      {/* Centered location icon */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="blue"
          width="24px"
          height="24px"
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 3.78 3.4 8.15 6.4 11.05.58.6 1.52.6 2.1 0C15.6 17.15 19 12.78 19 9c0-3.87-3.13-7-7-7zm0 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
        </svg>
      </div>

      {/* Address and location information display */}
      {locationData && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <p>Latitude: {locationData.latitude}</p>
          <p>Longitude: {locationData.longitude}</p>
          <p>Address: {locationData.address}</p>
        </div>
      )}

      {/* Radius slider */}
      <div style={{ marginTop: "20px", width: "80%" }}>
        <Slider
          value={radius}
          onChange={(e, newValue) => setRadius(newValue as number)}
          aria-labelledby="radius-slider"
          min={10}
          max={200}
          step={10}
        />
        <p>Radius: {radius} meters</p>
      </div>
    </div>
  );
};

export default MapComponent;
