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
import ReactMapGL, { Source, Layer, Marker } from "react-map-gl";
import { Colors } from "../../theme/colors";
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

  // image list
  const badgeImageUrl =
    "https://raw.githubusercontent.com/they-call-me-E/Sharptools/main/CustomeTile/Mapviewer/driving.png";

  // map related function code start

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
        ? "padding:0px; padding-top:25px;"
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

    return popupContent;
  };

  // Function to remove previous markers from the map
  const removePreviousMarkers = () => {
    markersArray.forEach((marker) => marker.remove());
    setMarkersArray([]);
  };
  const addMember = (membersData: any, mapInstance: any) => {
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

  const addPlaces = (placesData: any, mapInstance: mapboxgl.Map) => {
    let { latitude, longitude } = placesData?.location;

    const sourceId = `circle-${latitude}-${longitude}`;
    const layerId = `circle-layer-${latitude}-${longitude}`;

    // Create a circle marker
    const circleMarker: any = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    };

    // Check if the source already exists
    if (!mapInstance.getSource(sourceId)) {
      // Add source for the circle
      mapInstance.addSource(sourceId, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [circleMarker],
        },
      });

      // Add a circle layer
      mapInstance.addLayer({
        id: `circle-layer-${latitude}-${longitude}`,
        type: "circle",
        source: `circle-${latitude}-${longitude}`,
        paint: {
        
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            5,
            30, 
            10,
            80, 
            15,
            120, 
          ],
          "circle-color": Colors.blue,
          "circle-opacity": 0.2,
        },
      });
    } else {
      // Update the existing source if necessary
      const source = mapInstance.getSource(sourceId) as mapboxgl.GeoJSONSource;
      source.setData({
        type: "FeatureCollection",
        features: [circleMarker],
      });
    }

    // Create the marker element with a custom SVG icon
    const markerElement = document.createElement("div");
    markerElement.innerHTML = `
      <div class="places_icon_parent">
           <svg display="block" height="41px" width="27px" viewBox="0 0 27 41">
          <g fillRule="nonzero">
              <g transform="translate(3.0, 29.0)" fill="#000000">
                  <ellipse opacity="0.04" cx="10.5" cy="5.80029008" rx="10.5" ry="5.25002273"></ellipse>
              </g>
              <g fill="#3FB1CE">
                  <path d="M27,13.5 C27,19.074644 20.250001,27.000002 14.75,34.500002 C14.016665,35.500004 12.983335,35.500004 12.25,34.500002 C6.7499993,27.000002 0,19.222562 0,13.5 C0,6.0441559 6.0441559,0 13.5,0 C20.955844,0 27,6.0441559 27,13.5 Z"></path>
              </g>
              <g opacity="0.25" fill="#000000">
                  <path d="M13.5,0 C6.0441559,0 0,6.0441559 0,13.5 C0,19.222562 6.7499993,27 12.25,34.5 C13,35.522727 14.016664,35.500004 14.75,34.5 C20.250001,27 27,19.074644 27,13.5 C27,6.0441559 20.955844,0 13.5,0 Z"></path>
              </g>
              <g transform="translate(6.0, 7.0)" fill="#FFFFFF"></g>
              <g transform="translate(8.0, 8.0)">
                  <circle fill="#000000" opacity="0.25" cx="5.5" cy="5.5" r="5.4999962"></circle>
                  <circle fill="#FFFFFF" cx="5.5" cy="5.5" r="5.4999962"></circle>
              </g>
          </g>
      </svg>
      </div>
    `;

    // Create and place the marker on the map
    let marker = new mapboxgl.Marker(markerElement);
    if (longitude && latitude) {
      marker.setLngLat([longitude, latitude]).addTo(mapInstance);
    }

    // Return the marker for later reference
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

      mapInstance.on("load", () => {});
      setMapMain(mapInstance);
      return () => {
        mapInstance.remove();
      };
    }
  }, []);

  useEffect(() => {
    if (mapMain) {
      let membersData: any[] = [];
      const placesData: any[] = [];
      // placesData
      if (placesList?.length > 0) {
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
      }

      //  membersData code
      if (session && userList?.length === 0) {
        // get user data if userList array length is 0 code start
        handleUserInformation(session?.user?.token, session?.user?.id)
          .then((res: any) => {
            membersData?.push({
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

            membersData.forEach(function (item) {
              addMember(item, mapMain);
            });
          })
          .catch((err) => {});
        // get user data if userList array length is 0 code end
      } else if (userList?.length > 0) {
        userList?.forEach((user) => {
          if (Object.keys(user?.location).length !== 0) {
            membersData.push({
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
      }

      removePreviousMarkers();
      placesData.forEach(function (item) {
        addPlaces(item, mapMain);
      });
      membersData.forEach(function (item) {
        addMember(item, mapMain);
      });
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
