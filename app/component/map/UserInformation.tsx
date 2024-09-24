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

const UserInformation = ({
  userInformationData,
}: {
  userInformationData: any;
}) => {
  const {
    open: placesMenuListModalOpen,
    handleHide: placesMenuListHandleHide,
  } = usePlacesMenuListOpenContext();
  const { open: userActionModalOpen, handleClick: userActionHandleClick } =
    useUserActionOpenContext();
  const { open: usersMenuListModalOpen, handleHide: usersMenuListHandleHide } =
    useUsersMenuListOpenContext();
  const { data: session, status } = useSession();

  const handleUserMenuList = () => {
    placesMenuListHandleHide();
    userActionHandleClick();
    usersMenuListHandleHide();
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

            <Typography
              variant="body1"
              sx={{
                color: Colors.white,
                fontWeight: "300",
                letterSpacing: 0.8,
              }}
            >
              {/* @ts-ignore*/}
              {userInformationData?.name && userInformationData?.name}
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
