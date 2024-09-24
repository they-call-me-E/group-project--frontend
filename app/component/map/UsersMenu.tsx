import Users from "./../../../assets/users.png";
import { Typography } from "@mui/material";
import Image from "next/image";
import { Colors } from "../../theme/colors";
import { useUsersMenuListOpenContext } from "../../context/map/UsersMenuListContext";
import { useUserActionOpenContext } from "../../context/map/UserActionContext";
import { Button } from "@mui/material";
import { useGroupSelectionContext } from "../../context/map/GroupSelectionContext";
import { usePlacesMenuListOpenContext } from "../../context/map/PlacesMenuListContext";

const UsersMenu = () => {
  const {
    open: placesMenuListModalOpen,
    handleHide: placesMenuListHandleHide,
  } = usePlacesMenuListOpenContext();

  const { groupId, handleClick: groupIdHandleClick } =
    useGroupSelectionContext();
  const {
    open: usersMenuListModalOpen,
    handleClick: usersMenuListHandleClick,
  } = useUsersMenuListOpenContext();
  const { open: userActionModalOpen, handleHide: userActionHandleHide } =
    useUserActionOpenContext();

  const handleUserMenuList = () => {
    placesMenuListHandleHide();
    usersMenuListHandleClick();
    userActionHandleHide();
  };

  return (
    <Button
      disabled={groupId ? false : true}
      variant="contained"
      onClick={handleUserMenuList}
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
        src={Users}
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
        Users Menu
      </Typography>
    </Button>
  );
};
export default UsersMenu;
