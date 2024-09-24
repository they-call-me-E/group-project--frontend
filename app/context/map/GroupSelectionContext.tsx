"use client";
import { createContext, useContext, useState, useEffect } from "react";

type GroupSelectionValuetype = any;

const GroupSelectionContext = createContext<GroupSelectionValuetype>("");

export function GroupSelectionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [groupId, setGroupId] = useState<GroupSelectionValuetype>("");

  const handleClick = (id: string) => {
    setGroupId(id);
  };

  return (
    <GroupSelectionContext.Provider
      value={{
        groupId: groupId,
        handleClick: handleClick,
      }}
    >
      {children}
    </GroupSelectionContext.Provider>
  );
}

export function useGroupSelectionContext() {
  return useContext(GroupSelectionContext);
}
