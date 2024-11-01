"use client";
import { createContext, useContext, useState } from "react";

const MarkerOnMapContext = createContext<any>(null);

export function MarkerOnMapContextWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [markersArray, setMarkersArray] = useState<any[]>([]);
  const [createFencesMarkersArray, setCreateFencesMarkersArray] = useState<
    any[]
  >([]);
  const [placesMarkersArray, setPlacesMarkersArray] = useState<any[]>([]);

  return (
    <MarkerOnMapContext.Provider
      value={{
        markersArray,
        setMarkersArray,
        placesMarkersArray,
        setPlacesMarkersArray,
        createFencesMarkersArray,
        setCreateFencesMarkersArray,
      }}
    >
      {children}
    </MarkerOnMapContext.Provider>
  );
}

export function useMarkerOnMapContext() {
  return useContext(MarkerOnMapContext);
}
