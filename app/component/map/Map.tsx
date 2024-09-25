"use client";
// @ts-nocheck
import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import Grid from "@mui/material/Grid2";
import { useGroupSelectionContext } from "../../context/map/GroupSelectionContext";
import { convertToDMS } from "./../../utils/convertToDMS";
import { convertToMph } from "./../../utils/convertToMPH";
import { handleUserInformation } from "./../../utils/api/userInformation";
import { useSession } from "next-auth/react";
// @ts-ignore
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface MapProps {
  locationWithStatusSuccess: boolean;
  placesList: any[];
  userList: any[];
  flytoMemberLocation: (membersData: any, mapInstance: mapboxgl.Map) => void;
  mapMain: mapboxgl.Map | null;
  setMapMain: (mapInstance: mapboxgl.Map | null) => void;
}

const Map = ({
  locationWithStatusSuccess,
  placesList,
  userList,
  flytoMemberLocation,
  mapMain,
  setMapMain,
}: MapProps) => {
  const { data: session, status }: { data: any; status: string } = useSession();
  const [markersArray, setMarkersArray] = useState<any[]>([]);
  const { groupId, handleClick: groupIdHandleClick } =
    useGroupSelectionContext();
  let activeMarker: any;

  let geodataArray = [
    {
      center: [-81.96075, 35.07042],
      radiusInFeet: 230,
      geofenceId: "geofence1",
      pinImageUrl:
        "https://raw.githubusercontent.com/they-call-me-E/Sharptools/main/CustomeTile/Mapviewer/geo-pin.png",
    },
    {
      center: [-81.95, 35.08],
      radiusInFeet: 150,
      geofenceId: "geofence2",
      pinImageUrl: "",
    },
  ];

  // image list
  const badgeImageUrl =
    "https://raw.githubusercontent.com/they-call-me-E/Sharptools/main/CustomeTile/Mapviewer/driving.png";

  // map related function code start
  const addHexagon = (
    lat: any,
    lon: any,
    sizeInMeters: any,
    hexagonId: any,
    borderColor: any,
    borderWidth: any,
    mapInstance: any
  ) => {
    let coordinates = [];
    let angleDeg, angleRad, x, y;
    let latDelta = sizeInMeters / 111320;

    for (let i = 0; i < 6; i++) {
      angleDeg = 60 * i + 90;
      angleRad = (angleDeg * Math.PI) / 180;
      x = lon + latDelta * Math.cos(angleRad);
      y = lat + latDelta * Math.sin(angleRad);
      coordinates.push([x, y]);
    }

    coordinates.push(coordinates[0]);
    mapInstance.addLayer({
      id: hexagonId + "-fill",
      type: "fill",
      source: {
        type: "geojson",
        // @ts-ignore
        data: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [coordinates],
          },
        },
      },
      layout: {},
      paint: {
        "fill-color": "#007cbf",
        "fill-opacity": 0.5,
      },
    });

    mapInstance.addLayer({
      id: hexagonId + "-line",
      type: "line",
      source: {
        type: "geojson",
        // @ts-ignore
        data: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [coordinates],
          },
        },
      },
      layout: {},
      paint: {
        "line-color": borderColor,
        "line-width": borderWidth,
      },
    });
  };

  const addGeofence = (geodata: any, mapInstance: any) => {
    let center = geodata.center;
    let radiusInMeters = 200;
    let options = { steps: 64, units: "meters" };
    // @ts-ignore
    let circle = turf.circle(center, radiusInMeters, options);

    mapInstance.addLayer({
      id: geodata.geofenceId,
      type: "fill",
      source: {
        type: "geojson",
        data: circle,
      },
      paint: {
        "fill-color": "#007cbf",
        "fill-opacity": 0.25,
      },
    });

    const defaultMarker = new mapboxgl.Marker({
      anchor: "bottom",
      offset: [0, 24],
    });

    defaultMarker.setLngLat(geodata.center).addTo(mapInstance);
    mapInstance.addLayer({
      id: geodata.geofenceId + "-circle",
      type: "circle",
      source: {
        type: "geojson",
        // @ts-ignore
        data: {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: geodata.center,
          },
        },
      },
      paint: {
        "circle-radius": 22,
        "circle-color": "#FFFFFF",
        "circle-opacity": 1,
      },
    });
  };
  const addMultipleGeofences = (geodataArray: any, mapInstance: any) => {
    geodataArray.forEach(function (geodata: any) {
      addGeofence(geodata, mapInstance);
    });
  };

  const getPopupContent = (member: any) => {
    let batteryIcon;
    if (member?.status?.device?.charging === true) {
      batteryIcon =
        "https://raw.githubusercontent.com/they-call-me-E/Sharptools/main/CustomeTile/Mapviewer/battery_charging.png";
    } else {
      batteryIcon =
        "https://raw.githubusercontent.com/they-call-me-E/Sharptools/main/CustomeTile/Mapviewer/battery.png";
    }

    let popupContent = `<div class="location-popup-content" style="${
      member?.status?.device?.wifi ||
      member?.status?.device?.battery_level ||
      member?.status?.device?.charging
        ? "padding:0px; padding-top:25px;" // Separate properties with a semicolon
        : "padding:0 3px;"
    }">
      ${
        member?.status
          ? `  <div class="screen_icon_list">
          ${
            member?.status?.device?.wifi
              ? `<img src="/wifi.png" alt="wifi_icon" />`
              : ""
          } 
          <p>${
            member?.status?.device?.battery_level
              ? member?.status?.device?.battery_level + "%"
              : ""
          }</p>
            ${
              member?.status?.device?.charging
                ? `<img src="/battery.png" alt="wifi_icon" />`
                : ""
            } 
          
      </div>`
          : ""
      }
    
      <div class="location-popup-content__img">
       ${
         member?.fences
           ? `<div>
              <svg display="block" height="51px" width="37px" viewBox="0 0 27 41">
              <g fill-rule="nonzero">
                <g transform="translate(3.0, 29.0)" fill="#000000">
                  <ellipse
                    opacity="0.04"
                    cx="10.5"
                    cy="5.80029008"
                    rx="10.5"
                    ry="5.25002273"
                  ></ellipse>
                  <ellipse
                    opacity="0.04"
                    cx="10.5"
                    cy="5.80029008"
                    rx="10.5"
                    ry="5.25002273"
                  ></ellipse>
                  <ellipse
                    opacity="0.04"
                    cx="10.5"
                    cy="5.80029008"
                    rx="9.5"
                    ry="4.77275007"
                  ></ellipse>
                  <ellipse
                    opacity="0.04"
                    cx="10.5"
                    cy="5.80029008"
                    rx="8.5"
                    ry="4.29549936"
                  ></ellipse>
                  <ellipse
                    opacity="0.04"
                    cx="10.5"
                    cy="5.80029008"
                    rx="7.5"
                    ry="3.81822308"
                  ></ellipse>
                  <ellipse
                    opacity="0.04"
                    cx="10.5"
                    cy="5.80029008"
                    rx="6.5"
                    ry="3.34094679"
                  ></ellipse>
                  <ellipse
                    opacity="0.04"
                    cx="10.5"
                    cy="5.80029008"
                    rx="5.5"
                    ry="2.86367051"
                  ></ellipse>
                  <ellipse
                    opacity="0.04"
                    cx="10.5"
                    cy="5.80029008"
                    rx="4.5"
                    ry="2.38636864"
                  ></ellipse>
                </g>
                <g fill="#3FB1CE">
                  <path d="M27,13.5 C27,19.074644 20.250001,27.000002 14.75,34.500002 C14.016665,35.500004 12.983335,35.500004 12.25,34.500002 C6.7499993,27.000002 0,19.222562 0,13.5 C0,6.0441559 6.0441559,0 13.5,0 C20.955844,0 27,6.0441559 27,13.5 Z"></path>
                </g>
                <g opacity="0.25" fill="#000000">
                  <path d="M13.5,0 C6.0441559,0 0,6.0441559 0,13.5 C0,19.222562 6.7499993,27 12.25,34.5 C13,35.522727 14.016664,35.500004 14.75,34.5 C20.250001,27 27,19.074644 27,13.5 C27,6.0441559 20.955844,0 13.5,0 Z M13.5,1 C20.415404,1 26,6.584596 26,13.5 C26,15.898657 24.495584,19.181431 22.220703,22.738281 C19.945823,26.295132 16.705119,30.142167 13.943359,33.908203 C13.743445,34.180814 13.612715,34.322738 13.5,34.441406 C13.387285,34.322738 13.256555,34.180814 13.056641,33.908203 C10.284481,30.127985 7.4148684,26.314159 5.015625,22.773438 C2.6163816,19.232715 1,15.953538 1,13.5 C1,6.584596 6.584596,1 13.5,1 Z"></path>
                </g>
                <g transform="translate(6.0, 7.0)" fill="#FFFFFF"></g>
                <g transform="translate(8.0, 8.0)">
                  <circle
                    fill="#000000"
                    opacity="0.25"
                    cx="5.5"
                    cy="5.5"
                    r="5.4999962"
                  ></circle>
                  <circle fill="#FFFFFF" cx="5.5" cy="5.5" r="5.4999962"></circle>
                </g>
              </g>
            </svg>
           </div>`
           : `<img
        src="https://raw.githubusercontent.com/they-call-me-E/Sharptools/main/CustomeTile/Mapviewer/pngimg.com%20-%20deadpool_PNG15.png"
        alt="image"
      />`
       }
       
      </div>
      <div class="location-popup-content__text">
        <p>
          <span class="span_bold">Name:</span>
          <span class="span_normal"> ${member?.name}</span>
        </p>
        <p>
        ${
          Object.entries(member?.location)?.length === 0
            ? ""
            : '<span class="span_bold">GPS:</span>'
        }
       
          <span class="span_normal"
            >
           ${
             member?.location?.latitude && member?.location?.longitude
               ? `${convertToDMS(
                   member?.location?.latitude
                 )} and ${convertToDMS(member?.location?.longitude)}`
               : ""
           }
          </span
          >
        </p>
        <p>
        ${
          member?.status?.speed ? '<span class="span_bold">Speed:</span>' : ""
        }      
          <span class="span_normal">${
            member?.status?.speed ? member?.status?.speed : ""
          }</span>
        </p>
        ${
          member?.fences
            ? ""
            : `<p>
          <span class="span_bold">Screen:</span>
          <span class="span_normal">${
            member?.status?.device?.screen ? "On" : "Off"
          }</span>
        </p>`
        }
       
      </div>
    </div>`;

    // apply css code start

    // apply css code end
    return popupContent;
  };

  // Function to remove previous markers from the map
  const removePreviousMarkers = () => {
    markersArray.forEach((marker) => marker.remove());
    setMarkersArray([]);
  };
  const addMemberWithPlace = (membersData: any, mapInstance: any) => {
    let el = document.createElement("div");
    el.className = "marker " + membersData.id;
    let circle = document.createElement("div");
    circle.classList.add("circle-div");
    let img = document.createElement("img");
    img.src = membersData.avatar;

    if (membersData?.status?.location_sharing === "off") {
      img.style.filter = "grayscale(100%)";
    }
    circle.appendChild(img);
    let tail = document.createElement("div");
    tail.classList.add("tail-div");

    el.appendChild(tail);
    el.appendChild(circle);
    let badge = document.createElement("div");
    badge.className = "badge";
    badge.style.borderRadius =
      membersData?.status?.speed !== 0 ? "15px" : "50%";
    let image = document.createElement("img");
    image.src = badgeImageUrl;
    let imageDiv = document.createElement("div");
    imageDiv.style.width = "50px";
    imageDiv.appendChild(image);
    badge.appendChild(imageDiv);

    if (!membersData?.status?.speed) {
      imageDiv.style.marginLeft = "7px";
    }

    if (membersData?.status?.speed !== 0) {
      let speedText = document.createElement("span");
      speedText.className = "badge-text";
      speedText.textContent = membersData?.status?.speed
        ? membersData?.status?.speed +
          "km/h" +
          "" +
          "(" +
          convertToMph(membersData?.status?.speed) +
          "mph" +
          ")"
        : "";

      badge.appendChild(speedText);
    }

    el.appendChild(badge);
    el.style.backgroundColor = "blue";
    let { latitude, longitude } = membersData?.location;
    let marker = new mapboxgl.Marker(el);

    let popup = new mapboxgl.Popup({
      focusAfterOpen: false,
      offset: [0, -70],
    });

    let popupContent = getPopupContent(membersData);
    popup.setHTML(popupContent);
    if (longitude && latitude) {
      marker
        .setPopup(popup)
        .setLngLat([longitude, latitude])
        .addTo(mapInstance);
    }

    popup.on("close", (e) => {
      // @ts-ignore
      if (activeMarker == marker) {
        // @ts-ignore
        activeMarker.getElement().classList.remove("active-marker");
        activeMarker = null;
      }
    });

    marker.getElement().addEventListener("click", function (e) {
      marker.getElement().classList.add("active-marker");
      // @ts-ignore
      if (activeMarker) {
        activeMarker.getElement().classList.remove("active-marker");
      }

      activeMarker = marker;
      flytoMemberLocation(membersData, mapInstance);
    });
    setMarkersArray((prevMarkers) => [...prevMarkers, marker]);
    return marker;
  };
  // map related function code end

  useEffect(() => {
    if (!mapMain) {
      const mapInstance = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/dark-v10",
        zoom: 8,
        center: [-82.04842360357094, 35.18969231143789],
        // showLogo: false,
      });

      const navigationControl = new mapboxgl.NavigationControl({
        showCompass: false,
      });

      mapInstance.addControl(navigationControl, "top-right");

      mapInstance.on("load", () => {
        // @ts-ignore
        addMultipleGeofences(geodataArray, mapInstance);

        const lat = 35.07042;
        const lon = -81.96075;
        const sizeInMeters = 260;
        const hexagonId = "myHexagon";
        const fillColor = "orange";
        const fillOpacity = 0.75;
        addHexagon(
          lat,
          lon,
          sizeInMeters,
          hexagonId,
          fillColor,
          fillOpacity,
          mapInstance
        );
      });
      setMapMain(mapInstance);
      return () => {
        mapInstance.remove();
      };
    }
  }, []);

  useEffect(() => {
    if (mapMain) {
      let membersWithPlacesData: any[] = [];
      if (placesList?.length > 0) {
        const placesData: any[] = [];
        placesList?.forEach((place) => {
          if (place?.latitude && place?.longitude) {
            placesData.push({
              fences: true,
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
            });
          }
        });

        membersWithPlacesData?.push(...placesData);
      }
      if (userList?.length > 0) {
        const usersData: any[] = [];
        userList?.forEach((user) => {
          if (Object.keys(user?.location).length !== 0) {
            usersData.push({
              id: user?.uuid,
              name: user?.name,
              location: user?.location,
              status: user?.status,
              avatar:
                "https://raw.githubusercontent.com/they-call-me-E/Sharptools/main/CustomeTile/Mapviewer/pngimg.com%20-%20deadpool_PNG15.png",
              badgeImageUrl:
                "https://raw.githubusercontent.com/they-call-me-E/Sharptools/main/CustomeTile/Mapviewer/driving.png",
            });
          }
        });

        membersWithPlacesData?.push(...usersData);
      }

      if (session && userList?.length === 0) {
        // get user data if userList array length is 0 code start
        handleUserInformation(session?.user?.token, session?.user?.id)
          .then((res: any) => {
            membersWithPlacesData?.push({
              id: res?.data?.user?.uuid,
              name: res?.data?.user?.name,
              location: res?.data?.user?.location,
              status: res?.data?.user?.status,
              avatar:
                "https://raw.githubusercontent.com/they-call-me-E/Sharptools/main/CustomeTile/Mapviewer/pngimg.com%20-%20deadpool_PNG15.png",
              badgeImageUrl:
                "https://raw.githubusercontent.com/they-call-me-E/Sharptools/main/CustomeTile/Mapviewer/driving.png",
            });
            removePreviousMarkers();
            membersWithPlacesData.forEach(function (item) {
              addMemberWithPlace(item, mapMain);
            });
          })
          .catch((err) => {});
        // get user data if userList array length is 0 code end
      } else {
        removePreviousMarkers();
        membersWithPlacesData.forEach(function (item) {
          addMemberWithPlace(item, mapMain);
        });
      }
    }
  }, [groupId, locationWithStatusSuccess, mapMain]);

  return (
    <>
      <Grid className="map-container">
        <Grid
          id="map"
          style={{
            position: "absolute",
            top: "0px",
            left: "0px",
            bottom: "0px",
            width: "100%",
            zIndex: 20,
          }}
        ></Grid>
      </Grid>
    </>
  );
};

export default Map;
