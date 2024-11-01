"use client";
import { createContext, useContext, useState, useEffect } from "react";

type PlacesMenuListOpentype = any;

const PlacesMenuListContext = createContext<PlacesMenuListOpentype>(false);

export function PlacesMenuListOpenWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<PlacesMenuListOpentype>(false);
  const [hideCreateFences, setHideCreateFences] = useState(false);
  const [refetchDataOnMap, setRefetchDataOnMap] = useState(false);

  const handleClick = () => {
    setState(!state);
  };
  const handleHide = () => {
    setState(false);
  };

  return (
    <PlacesMenuListContext.Provider
      value={{
        refetchDataOnMap,
        setRefetchDataOnMap,
        open: state,
        handleClick: handleClick,
        handleHide: handleHide,
        hideCreateFences,
        setHideCreateFences,
      }}
    >
      {children}
    </PlacesMenuListContext.Provider>
  );
}

export function usePlacesMenuListOpenContext() {
  return useContext(PlacesMenuListContext);
}
