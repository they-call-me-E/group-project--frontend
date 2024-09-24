"use client";
import { createContext, useContext, useState, useEffect } from "react";

type UsersMenuListOpentype = any;

const UsersMenuListContext = createContext<UsersMenuListOpentype>(false);

export function UsersMenuListOpenWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<UsersMenuListOpentype>(false);
  const handleClick = () => {
    setState(!state);
  };
  const handleHide = () => {
    setState(false);
  };

  return (
    <UsersMenuListContext.Provider
      value={{ open: state, handleClick: handleClick, handleHide: handleHide }}
    >
      {children}
    </UsersMenuListContext.Provider>
  );
}

export function useUsersMenuListOpenContext() {
  return useContext(UsersMenuListContext);
}
