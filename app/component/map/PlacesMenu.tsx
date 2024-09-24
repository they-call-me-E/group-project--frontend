import Places from "./../../../assets/places.png";
import { Typography } from "@mui/material";
import Image from "next/image";
import Grid from "@mui/material/Grid2";
import { Colors } from "../../theme/colors";
import { Button } from "@mui/material";
import { useGroupSelectionContext } from "../../context/map/GroupSelectionContext";
import { useUsersMenuListOpenContext } from "../../context/map/UsersMenuListContext";
import { usePlacesMenuListOpenContext } from "../../context/map/PlacesMenuListContext";
import { useUserActionOpenContext } from "../../context/map/UserActionContext";

const PlacesMenu = () => {
  const { groupId, handleClick: groupIdHandleClick } =
    useGroupSelectionContext();
  const { open: usersMenuListModalOpen, handleHide: usersMenuListHandleHide } =
    useUsersMenuListOpenContext();
  const {
    open: placesMenuListModalOpen,
    handleClick: placesMenuListHandleClick,
  } = usePlacesMenuListOpenContext();
  const { open: userActionModalOpen, handleHide: userActionHandleHide } =
    useUserActionOpenContext();

  const handlePlaceMenuList = () => {
    placesMenuListHandleClick();
    usersMenuListHandleHide();
    userActionHandleHide();
  };

  return (
    <Button
      onClick={handlePlaceMenuList}
      disabled={groupId ? false : true}
      variant="contained"
      className="cursor-pointer"
      sx={{
        backgroundColor: Colors.blue,
        padding: "10px",
        borderRadius: "12px",
        display: "flex",
        columnGap: "6px",
        alignItems: "center",
        justifyContent: "center",
        textTransform: "capitalize",
      }}
    >
      <Image
        src={Places}
        width={24}
        height={24}
        alt="Setting Icon"
        className="w-[24px] h-[24px] object-contain"
      />
      <Typography
        variant="body1"
        sx={{
          color: Colors.black,
          fontWeight: "500",
          letterSpacing: 0.8,
          fontSize: "16px",
        }}
      >
        Places Menu
      </Typography>
    </Button>
  );
};
export default PlacesMenu;
