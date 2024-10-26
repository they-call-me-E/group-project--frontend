import DefaultUser from "./../../../assets/default_user.png";
import Settings from "./../../../assets/settings.png";
import { Typography } from "@mui/material";
import Image from "next/image";
import Grid from "@mui/material/Grid2";
import { Colors } from "../../theme/colors";
import { useSession } from "next-auth/react";
import { useUserActionOpenContext } from "../../context/map/UserActionContext";
import { useUsersMenuListOpenContext } from "../../context/map/UsersMenuListContext";
import { usePlacesMenuListOpenContext } from "../../context/map/PlacesMenuListContext";
import UserActions from "./UserActions";
import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FaRegEdit } from "react-icons/fa";
import { useState } from "react";

const UserInformation = ({
  userInformationData,
}: {
  userInformationData: any;
}) => {
  const {
    handleHide: userActionHandleHide,
    handleClick: userActionHandleClick,
    editProfleModalFormOpen,
    createGroupModalFormHide,
    handleGroupsModalHide,
    locationWithStatusModalFormHide,
    handleJoinGroupModalHide,
    open: userActionModalOpen,
    userProfileModalClick,
    profileModal,
    userProfileModalHide,
  } = useUserActionOpenContext();
  const [activeButton, setActiveButton] = useState<string>();
  const {
    open: placesMenuListModalOpen,
    handleHide: placesMenuListHandleHide,
  } = usePlacesMenuListOpenContext();

  const { open: usersMenuListModalOpen, handleHide: usersMenuListHandleHide } =
    useUsersMenuListOpenContext();
  const { data: session, status } = useSession();

  const handleUserMenuList = () => {
    placesMenuListHandleHide();
    userActionHandleClick();
    usersMenuListHandleHide();
    userProfileModalHide();
  };

  const handleActiveButton = (value: string) => {
    setActiveButton(value);
  };

  const userProfileModal = () => {
    return (
      <Grid sx={{ position: "relative" }}>
        {" "}
        <Grid
          sx={{
            backgroundColor: Colors.blue,
            position: "absolute",
            bottom: "2px",
            left: "0",
            width: "170px",
            minHeight: "40px",
            borderTopLeftRadius: "6px",
            borderTopRightRadius: "6px",
            padding: "3px 0",
          }}
        >
          <CloseIcon
            onClick={userProfileModalClick}
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
                userActionHandleHide();
              }}
            >
              Edit Profile
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <Grid className="mt-8 absolute left-0 bottom-0 w-full px-5 mb-4">
        {/* User Actions */}
        {userActionModalOpen && (
          <Grid sx={{ position: "relative" }}>
            <UserActions />
          </Grid>
        )}
        {/*  userProfileModal  open code start */}
        {profileModal && userProfileModal()}
        {/*  userProfileModal  open code end */}

        {/* Sign in information */}
        <Grid
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Grid
            sx={{ display: "flex", columnGap: "6px", alignItems: "center" }}
          >
            <Button
              onClick={() => {
                placesMenuListHandleHide();
                userActionHandleHide();
                usersMenuListHandleHide();
                userProfileModalClick();
              }}
              variant="contained"
              className="cursor-pointer"
              sx={{ backgroundColor: "transparent", padding: 0, minWidth: 0 }}
            >
              {userInformationData?.avatar ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_API_URL}/img/users/${userInformationData?.avatar}`}
                  width={36}
                  height={36}
                  alt="User Icon"
                  className="w-[48px] h-[48px] object-contain cursor-pointer rounded-[12px]"
                />
              ) : (
                <Image
                  src={DefaultUser}
                  width={36}
                  height={36}
                  alt="User Icon"
                  className="w-[48px] h-[48px] object-contain cursor-pointer"
                />
              )}
            </Button>

            <Typography
              variant="body1"
              sx={{
                color: Colors.white,
                fontWeight: "300",
                letterSpacing: 0.8,
              }}
            >
              {/* @ts-ignore*/}
              {userInformationData?.name &&
                userInformationData?.name?.split(" ")[0]}
            </Typography>
          </Grid>

          <Grid
            onClick={handleUserMenuList}
            className="cursor-pointer"
            sx={{
              backgroundColor: Colors.blue,
              padding: "10px",
              display: "inline-block",
              borderRadius: "12px",
            }}
          >
            <Image
              src={Settings}
              width={24}
              height={24}
              alt="Setting Icon"
              className="w-[24px] h-[24px] object-contain"
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
export default UserInformation;
