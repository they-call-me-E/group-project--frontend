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
  const handleClick = () => {
    setState(!state);
  };
  const handleHide = () => {
    setState(false);
  };

  return (
    <PlacesMenuListContext.Provider
      value={{ open: state, handleClick: handleClick, handleHide: handleHide }}
    >
      {children}
    </PlacesMenuListContext.Provider>
  );
}

export function usePlacesMenuListOpenContext() {
  return useContext(PlacesMenuListContext);
}
