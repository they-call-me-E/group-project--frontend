"use client";
import { createContext, useContext, useState } from "react";

type UserActionOpentype = any;

const UserActionContext = createContext<UserActionOpentype>({});

export function UserActionOpenWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState(false);
  const [editProfileModalForm, setEditProfileModalForm] = useState(false);
  const [locationWithStatusModalForm, setlocationWithStatusModalForm] =
    useState(false);
  const [createGroupModalForm, setCreateGroupModalForm] = useState(false);
  const [groupsModal, setGroupsModal] = useState(false);
  const [joinGroupModal, setJoinGroupModal] = useState(false);
  const [profileModal, setProfileModal] = useState(false);

  const handleClick = () => {
    setState(!state);
  };
  const userProfileModalClick = () => {
    setProfileModal(!profileModal);
  };
  const userProfileModalHide = () => {
    setProfileModal(false);
  };
  const editProfleModalFormOpen = () => {
    setEditProfileModalForm(!editProfileModalForm);
  };
  const locationWithStatusModalFormOpen = () => {
    setlocationWithStatusModalForm(!locationWithStatusModalForm);
  };
  const editProfleModalFormHide = () => {
    setEditProfileModalForm(false);
  };
  const locationWithStatusModalFormHide = () => {
    setlocationWithStatusModalForm(false);
  };
  const createGroupModalFormOpen = () => {
    setCreateGroupModalForm(!createGroupModalForm);
  };
  const createGroupModalFormHide = () => {
    setCreateGroupModalForm(false);
  };

  const handleGroupsModalOpen = () => {
    setGroupsModal(!groupsModal);
  };
  const handleGroupsModalHide = () => {
    setGroupsModal(false);
  };

  const handleHide = () => {
    setState(false);
  };

  const handleJoinGroupModalOpen = () => {
    setJoinGroupModal(!joinGroupModal);
  };
  const handleJoinGroupModalHide = () => {
    setJoinGroupModal(false);
  };
  return (
    <UserActionContext.Provider
      value={{
        open: state,
        handleClick: handleClick,
        handleHide: handleHide,
        editProfileModalForm: editProfileModalForm,
        editProfleModalFormOpen: editProfleModalFormOpen,
        editProfleModalFormHide: editProfleModalFormHide,
        createGroupModalForm: createGroupModalForm,
        createGroupModalFormOpen: createGroupModalFormOpen,
        createGroupModalFormHide: createGroupModalFormHide,
        groupsModal: groupsModal,
        handleGroupsModalOpen: handleGroupsModalOpen,
        handleGroupsModalHide: handleGroupsModalHide,
        locationWithStatusModalFormHide: locationWithStatusModalFormHide,
        locationWithStatusModalForm: locationWithStatusModalForm,
        locationWithStatusModalFormOpen: locationWithStatusModalFormOpen,
        joinGroupModal: joinGroupModal,
        handleJoinGroupModalOpen: handleJoinGroupModalOpen,
        handleJoinGroupModalHide: handleJoinGroupModalHide,
        userProfileModalClick: userProfileModalClick,
        userProfileModalHide: userProfileModalHide,
        profileModal: profileModal,
      }}
    >
      {children}
    </UserActionContext.Provider>
  );
}

export function useUserActionOpenContext() {
  return useContext(UserActionContext);
}
