"use client";
import Grid from "@mui/material/Grid2";
import { Colors } from "../../theme/colors";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { usePlacesMenuListOpenContext } from "../../context/map/PlacesMenuListContext";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Typography } from "@mui/material";
import { convertToDMS } from "./../../utils/convertToDMS";
import LocationSVGIcon from "./../../utils/LocationSVGIcon";

interface MapWithUsersProps {
  placesList: any[];
  flytoMemberLocation: (
    membersWithPlacesData: any,
    mapInstance: mapboxgl.Map
  ) => void;
  mapMain: mapboxgl.Map | null;
}

const PlacesMenuList = ({
  placesList,
  flytoMemberLocation,
  mapMain,
}: MapWithUsersProps) => {
  const {
    open: placesMenuListModalOpen,
    handleClick: placesMenuListHandleClick,
  } = usePlacesMenuListOpenContext();
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
        onClick={placesMenuListHandleClick}
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
        {placesList.map((place, index) => (
          <ListItem
            onClick={() => {
              handleListItemClick(index);
              if (mapMain && place?.latitude && place?.longitude) {
                flytoMemberLocation(
                  {
                    id: place?.uuid,
                    name: place?.name,
                    location: {
                      latitude: place?.latitude,
                      longitude: place?.longitude,
                    },
                    status: {},
                    avatar:
                      "https://raw.githubusercontent.com/they-call-me-E/Sharptools/main/CustomeTile/Mapviewer/pngimg.com%20-%20deadpool_PNG15.png",
                    badgeImageUrl:
                      "https://raw.githubusercontent.com/they-call-me-E/Sharptools/main/CustomeTile/Mapviewer/driving.png",
                  },
                  mapMain
                );
              }
            }}
            sx={{
              cursor: "pointer",
              display: {
                xs: "flex !important",
                sm: "flex",
              },
              columnGap: {
                xs: "15px !important",
                sm: "8px",
              },
              alignItems: "center",
              position: "relative",
              paddingTop: "5px",
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
            <Grid>
              <LocationSVGIcon />
            </Grid>
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
                {place?.name}
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
                </Typography>{" "}
                {place?.latitude && place?.longitude
                  ? `${convertToDMS(place?.latitude)} and ${convertToDMS(
                      place?.longitude
                    )}`
                  : ""}
              </Typography>
            </Grid>
          </ListItem>
        ))}
      </List>
    </Grid>
  );
};

export default PlacesMenuList;
