"use client";
import Grid from "@mui/material/Grid2";
import { Colors } from "./../../theme/colors";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut } from "next-auth/react";
import { useUserActionOpenContext } from "../../context/map/UserActionContext";
import { FaRegEdit } from "react-icons/fa";
import { TbStatusChange } from "react-icons/tb";
import { TiGroupOutline } from "react-icons/ti";
import { useState } from "react";

const UserActions = () => {
  const {
    handleClick: userActionHandleClick,
    editProfleModalFormOpen,
    editProfleModalFormHide,
    createGroupModalFormOpen,
    createGroupModalFormHide,
    groupsModal,
    handleGroupsModalOpen,
    handleGroupsModalHide,
    locationWithStatusModalFormOpen,
    locationWithStatusModalFormHide,
    handleJoinGroupsModalOpen,
    handleJoinGroupModalOpen,
    handleJoinGroupModalHide,
  } = useUserActionOpenContext();
  const [activeButton, setActiveButton] = useState<string>();
  const handleActiveButton = (value: string) => {
    setActiveButton(value);
  };

  return (
    <Grid
      sx={{
        backgroundColor: Colors.blue,
        position: "absolute",
        bottom: "0",
        right: "0",
        width: "170px",
        minHeight: "40px",
        borderTopLeftRadius: "6px",
        borderTopRightRadius: "6px",
        padding: "3px 0",
      }}
    >
      <CloseIcon
        onClick={userActionHandleClick}
        sx={{
          zIndex: 10,
          cursor: "pointer",
          color: Colors.red,
          fontSize: "16px",
          position: "absolute",
          right: "5px",
          top: "5px",
          backgroundColor: "transparent",
          borderRadius: "50px",
          "&:hover": {
            backgroundColor: "transparent",
          },
        }}
      />
      <Grid
        sx={{
          marginTop: "18px",
          padding: "0 10px",
          display: "flex",
          flexDirection: "column",
          columnGap: "6px",
          rowGap: "2px",
        }}
      >
        <Button
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            textTransform: "capitalize",
            boxShadow: "0",
            backgroundColor:
              activeButton === "Edit Profile"
                ? Colors.activeBlue
                : "transparent",
            "&:hover": {
              backgroundColor: Colors.lightBlue,
              boxShadow: "0",
            },
          }}
          variant="contained"
          startIcon={<FaRegEdit className="text-[50px]" />}
          onClick={() => {
            handleActiveButton("Edit Profile");
            editProfleModalFormOpen();
            createGroupModalFormHide();
            handleGroupsModalHide();
            locationWithStatusModalFormHide();
            handleJoinGroupModalHide();
          }}
        >
          Edit Profile
        </Button>
        <Button
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            textTransform: "capitalize",
            boxShadow: "0",
            backgroundColor:
              activeButton === "Location/Status"
                ? Colors.activeBlue
                : "transparent",
            "&:hover": {
              backgroundColor: Colors.lightBlue,
              boxShadow: "0",
            },
          }}
          variant="contained"
          startIcon={<TbStatusChange className="text-[50px]" />}
          onClick={() => {
            handleActiveButton("Location/Status");
            editProfleModalFormHide();
            locationWithStatusModalFormOpen();
            createGroupModalFormHide();
            handleGroupsModalHide();
            handleJoinGroupModalHide();
          }}
        >
          Location/Status
        </Button>
        <Button
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            textTransform: "capitalize",
            boxShadow: "0",
            backgroundColor:
              activeButton === "Create Group"
                ? Colors.activeBlue
                : "transparent",
            "&:hover": {
              backgroundColor: Colors.lightBlue,
              boxShadow: "0",
            },
          }}
          variant="contained"
          startIcon={<FaRegEdit className="text-[50px]" />}
          onClick={() => {
            handleActiveButton("Create Group");
            editProfleModalFormHide();
            createGroupModalFormOpen();
            handleGroupsModalHide();
            locationWithStatusModalFormHide();
            handleJoinGroupModalHide();
          }}
        >
          Create Group
        </Button>
        <Button
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            textTransform: "capitalize",
            boxShadow: "0",
            backgroundColor:
              activeButton === "View Groups"
                ? Colors.activeBlue
                : "transparent",
            "&:hover": {
              backgroundColor: Colors.lightBlue,
              boxShadow: "0",
            },
          }}
          variant="contained"
          startIcon={<TiGroupOutline className="text-[50px]" />}
          onClick={() => {
            handleActiveButton("View Groups");
            handleGroupsModalOpen();
            editProfleModalFormHide();
            createGroupModalFormHide();
            locationWithStatusModalFormHide();
            handleJoinGroupModalHide();
          }}
        >
          View Groups
        </Button>
        <Button
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            textTransform: "capitalize",
            boxShadow: "0",
            backgroundColor:
              activeButton === "Join Group" ? Colors.activeBlue : "transparent",
            "&:hover": {
              backgroundColor: Colors.lightBlue,
              boxShadow: "0",
            },
          }}
          variant="contained"
          startIcon={<TiGroupOutline className="text-[50px]" />}
          onClick={() => {
            handleActiveButton("Join Group");
            handleJoinGroupModalOpen();
            handleGroupsModalHide();
            editProfleModalFormHide();
            createGroupModalFormHide();
            locationWithStatusModalFormHide();
          }}
        >
          Join Group
        </Button>
        <Button
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            textTransform: "capitalize",
            boxShadow: "0",
            backgroundColor:
              activeButton === "Logout" ? Colors.activeBlue : "transparent",
            "&:hover": {
              backgroundColor: Colors.lightBlue,
              boxShadow: "0",
            },
          }}
          variant="contained"
          startIcon={<LogoutIcon sx={{ fontSize: 50 }} />}
          onClick={() => {
            handleActiveButton("Logout");
            signOut({ callbackUrl: "/" });
          }}
        >
          Logout
        </Button>
      </Grid>
    </Grid>
  );
};

export default UserActions;
