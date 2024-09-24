"use client";
import { Colors } from "../../theme/colors";
import { useSession } from "next-auth/react";
import {
  FormControl,
  Typography,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useState, useEffect } from "react";
import axios from "axios";
import { useGroupSelectionContext } from "../../context/map/GroupSelectionContext";
import { useUsersMenuListOpenContext } from "../../context/map/UsersMenuListContext";
import { useUserActionOpenContext } from "../../context/map/UserActionContext";
import { usePlacesMenuListOpenContext } from "../../context/map/PlacesMenuListContext";

const GroupSelection = ({
  groupArr,
  placesMenuDataList,
  usersMenuDataList,
}: {
  groupArr: any;
  placesMenuDataList: (group_id: any) => Promise<boolean>;
  usersMenuDataList: (group_id: any) => Promise<boolean>;
}) => {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { groupId, handleClick: groupIdHandleClick } =
    useGroupSelectionContext();
  const { open: usersMenuListModalOpen, handleHide: usersMenuListHandleHide } =
    useUsersMenuListOpenContext();
  const { open: userActionModalOpen, handleHide: userActionHandleHide } =
    useUserActionOpenContext();
  const {
    open: placesMenuListModalOpen,
    handleHide: placesMenuListHandleHide,
  } = usePlacesMenuListOpenContext();

  const placeHolderWithEdit = () => {
    if (groupId) {
      // @ts-ignore
      return groupArr.find((item) => groupId === item?.uuid)?.name;
    } else {
      return "Group Selection";
    }
  };

  return (
    <FormControl fullWidth>
      <Typography
        variant="body1"
        sx={{
          color: Colors.white,
          fontWeight: "500",
          marginBottom: "10px",
          letterSpacing: 0.8,
        }}
      >
        Group Selection
      </Typography>
      <Select
        labelId="select-label"
        id="select-menu"
        defaultValue=""
        IconComponent={() => (open ? <ExpandLess /> : <ExpandMore />)}
        displayEmpty
        onClose={handleClose}
        onOpen={handleOpen}
        MenuProps={{
          PaperProps: {
            style: {
              borderRadius: "8px",
              maxHeight: 200,
            },
          },
        }}
        sx={{
          borderRadius: "8px",
          borderWidth: "0",
          borderColor: Colors.blue,
          borderStyle: "solid",
          padding: "0.5rem",
          paddingLeft: "0.8rem",
          paddingRight: "0.8rem",
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            padding: "0 !important",
          },

          "&:hover": {
            borderColor: Colors.blue,
          },
          "&:focus, &:focus-visible, &.Mui-focused": {
            borderWidth: "0 !important",
            outline: "none",
            boxShadow: "none",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderWidth: "1px",
            borderColor: Colors.blue,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: Colors.blue,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: "1px",
            borderColor: Colors.blue,
          },
        }}
      >
        <MenuItem value="" disabled>
          <InputAdornment
            position="start"
            sx={{
              display: "flex",
              columnGap: "6px",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body1"
              sx={{ color: "rgba(255, 255, 255, 0.5)", fontWeight: 400 }}
            >
              {placeHolderWithEdit()}
            </Typography>
          </InputAdornment>
        </MenuItem>
        {groupArr.map((item: any, i: number) => {
          return (
            <MenuItem
              key={i}
              value={item?.uuid}
              onFocus={() => {
                if (usersMenuListModalOpen === true) {
                  usersMenuListHandleHide();
                }
                if (userActionModalOpen === true) {
                  userActionHandleHide();
                }
                if (placesMenuListModalOpen) {
                  placesMenuListHandleHide();
                }
              }}
              onClick={async () => {
                let usersRes, placesRes;

                try {
                  usersRes = await usersMenuDataList(item?.uuid);
                } catch (error) {}

                try {
                  placesRes = await placesMenuDataList(item?.uuid);
                } catch (error) {}

                // Check for different scenarios
                if (usersRes && placesRes) {
                  groupIdHandleClick(item?.uuid);
                } else if (usersRes) {
                  groupIdHandleClick(item?.uuid);
                } else if (placesRes) {
                  groupIdHandleClick(item?.uuid);
                } else {
                }
              }}
            >
              {item.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
export default GroupSelection;
