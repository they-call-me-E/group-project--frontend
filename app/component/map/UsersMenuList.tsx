"use client";
import Grid from "@mui/material/Grid2";
import { Colors } from "../../theme/colors";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useUsersMenuListOpenContext } from "../../context/map/UsersMenuListContext";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import DefaultUser from "./../../../assets/default_user.png";
import Image from "next/image";
import { Typography } from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import { TiBatteryHigh } from "react-icons/ti";
import { convertToDMS } from "./../../utils/convertToDMS";
import { convertToMph } from "./../../utils/convertToMPH";

interface MapWithUsersProps {
  userList: any[];
  flytoMemberLocation: (
    membersWithPlacesData: any,
    mapInstance: mapboxgl.Map
  ) => void;
  mapMain: mapboxgl.Map | null;
  userInformationData: any;
  userInfoWithSocket: any;
}

const UsersMenuList = ({
  userInfoWithSocket,
  userList,
  flytoMemberLocation,
  mapMain,
  userInformationData,
}: MapWithUsersProps) => {
  const {
    open: usersMenuListModalOpen,
    handleClick: usersMenuListHandleClick,
  } = useUsersMenuListOpenContext();
  const [activeIndex, setActiveIndex] = useState<number | null>();

  const handleListItemClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <Grid
      sx={{
        backgroundColor: Colors.blue,
        position: "absolute",
        top: "100%",
        left: "0",
        width: "100%",
        minHeight: "60px",
        maxHeight: {
          xs: "250px",
          sm: "250px",
          md: "340px",
        },
        borderTopLeftRadius: "6px",
        borderTopRightRadius: "6px",
        marginTop: "3px",
        overflowY: "auto",
        padding: "0 10px",
        // Hide scrollbar for WebKit browsers (Chrome, Safari)
        "&::-webkit-scrollbar": {
          display: "none",
        },
        // Hide scrollbar for Firefox
        scrollbarWidth: "none",
        // Hide scrollbar for Internet Explorer
        msOverflowStyle: "none",
      }}
    >
      {/* <CloseIcon
        onClick={usersMenuListHandleClick}
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
      /> */}
      <List sx={{ padding: 0 }}>
        <Grid sx={{ marginBottom: "6px" }}></Grid>
        {userList.map((user, index) => {
          if (user?.uuid === userInformationData?.uuid) {
            user = {
              ...user,
              ...userInformationData,
            };
          }
          if (user?.uuid === userInfoWithSocket?.uuid) {
            user = {
              ...user,
              ...userInfoWithSocket,
            };
          }

          return (
            <ListItem
              onClick={() => {
                if (
                  mapMain &&
                  user?.location?.latitude &&
                  user?.location?.longitude
                ) {
                  flytoMemberLocation(user, mapMain);
                }
                handleListItemClick(index);
              }}
              sx={{
                cursor: "pointer",
                display: "flex",
                columnGap: "6px",
                alignItems: "center",
                position: "relative",
                paddingTop:
                  user?.status?.device?.wifi ||
                  user?.status?.device?.battery_level ||
                  user?.status?.device?.charging
                    ? "22px"
                    : "5px",
                paddingBottom: "5px",
                paddingLeft: "3px",
                paddingRight: "3px",
                marginBottom: "3px",
                backgroundColor:
                  activeIndex === index ? Colors.activeBlue : "transparent",
                "&:hover": {
                  backgroundColor: Colors.lightBlue,
                },
              }}
            >
              <Grid
                sx={{
                  display: "flex",
                  columnGap: "12px",
                  alignItems: "center",
                  position: "absolute",
                  top: "0",
                  right: "0",
                }}
              >
                {user?.status?.device?.wifi && (
                  <WifiIcon style={{ fontSize: 24, color: Colors.black }} />
                )}
                <Typography
                  variant="body1"
                  sx={{
                    color: Colors.black,
                    fontWeight: "400",
                    fontSize: "14px",
                  }}
                >
                  {user?.status?.device?.battery_level
                    ? user?.status?.device?.battery_level + "%"
                    : ""}
                </Typography>
                {user?.status?.device?.charging && (
                  <TiBatteryHigh
                    style={{ fontSize: 24, color: Colors.black }}
                  />
                )}
              </Grid>

              {user?.avatar ? (
                <Image
                  src={`${user?.avatar}`}
                  width={36}
                  height={36}
                  alt="User Icon"
                  className="w-[60px] h-[60px] object-contain rounded-full"
                />
              ) : (
                <Image
                  src={DefaultUser}
                  width={36}
                  height={36}
                  alt="User Icon"
                  className="w-[60px] h-[60px] object-contain rounded-full"
                />
              )}

              <Grid
                sx={{
                  paddingRight: {
                    xs: 0,
                    sm: "12px",
                  },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: Colors.black,
                    fontWeight: "400",
                    fontSize: "14px",
                  }}
                >
                  <Typography component="span" sx={{ fontWeight: "bold" }}>
                    Name:
                  </Typography>{" "}
                  {user?.name}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: Colors.black,
                    fontWeight: "400",
                    fontSize: "14px",
                  }}
                >
                  <Typography component="span" sx={{ fontWeight: "bold" }}>
                    GPS:
                  </Typography>
                  {user?.location?.latitude && user?.location?.longitude
                    ? `${convertToDMS(
                        user?.location?.latitude
                      )} and ${convertToDMS(user?.location?.longitude)}`
                    : ""}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: Colors.black,
                    fontWeight: "400",
                    fontSize: "14px",
                  }}
                >
                  {user?.status?.speed ? (
                    <Typography component="span" sx={{ fontWeight: "bold" }}>
                      Speed:
                    </Typography>
                  ) : (
                    ""
                  )}

                  {user?.status?.speed
                    ? user?.status?.speed +
                      "km/h" +
                      " " +
                      "(" +
                      convertToMph(user?.status?.speed) +
                      "mph" +
                      ")"
                    : ""}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: Colors.black,
                    fontWeight: "400",
                    fontSize: "14px",
                  }}
                >
                  <Typography component="span" sx={{ fontWeight: "bold" }}>
                    Screen:
                  </Typography>{" "}
                  {user?.status?.device?.screen ? "On" : "Off"}
                </Typography>
              </Grid>
            </ListItem>
          );
        })}
      </List>
    </Grid>
  );
};

export default UsersMenuList;
