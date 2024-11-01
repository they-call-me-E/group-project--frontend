"use client";
import Grid from "@mui/material/Grid2";
import { Colors } from "../../theme/colors";
import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useSession } from "next-auth/react";
import AddMembers from "./group_management/AddMembers";
import RemoveMembers from "./group_management/RemoveMembers";
import AlertMessage from "../../component/message/AlertMessage";
import EditGroup from "./group_management/EditGroup";
import CreateFences from "./group_management/CreateFences";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import { MdOutlineVisibility } from "react-icons/md";
import ViewGroup from "./group_management/ViewGroup";
import { HiOutlineUserAdd } from "react-icons/hi";
import { HiOutlineUserRemove } from "react-icons/hi";
import { useUserActionOpenContext } from "../../context/map/UserActionContext";
import AlertModal from "../message/AlertModal";
import AddAdmin from "./group_management/AddAdmin";
import RemoveAdmin from "./group_management/RemoveAdmin";
import GroupInvite from "./group_management/GroupInvite";
import FencesManagement from "./FencesManagement";
import ViewFences from "./fences_management/ViewFences";
import EditFences from "./fences_management/EditFences";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMarkerOnMapContext } from "./../../context/map/MarkerOnMapContext";
import mapboxgl from "mapbox-gl";
import { getAddressFromCoordinates } from "./../../utils/getAddressFromCoordinates";

// Define custom styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    border: "1px solid #ddd",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    border: "1px solid #ddd", // Border for body cells
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: Colors.white, // Background color for odd rows
  },
  "&:nth-of-type(even)": {
    backgroundColor: Colors.white, // Custom background color for even rows
  },
  "&:hover": {
    backgroundColor: Colors.light, // Background color on hover
  },
  "& th,td": {
    paddingTop: "3px",
    paddingBottom: "3px",
    color: Colors.black,
  },
  "&:last-of-type": {
    "& th, td": {
      paddingTop: "3px",
      paddingBottom: "3px",
      color: Colors.black,
    },
  },
}));

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

const GroupManagement = ({
  setMenuOpen,
  mapMain,
  moveCreateGroupForm,
  groupInformationData,
  setGroupInformationData,
  reFetchGroupListData,
}: {
  setMenuOpen: React.Dispatch<React.SetStateAction<any>>;
  mapMain: mapboxgl.Map | null;
  moveCreateGroupForm: any;
  groupInformationData: any[];
  setGroupInformationData: React.Dispatch<React.SetStateAction<any>>;
  reFetchGroupListData: () => void;
}) => {
  const { handleGroupsModalHide, groupsModalWithFences } =
    useUserActionOpenContext();
  const { data: session, status }: { data: any; status: any } = useSession();
  const [openEditGroupModal, setOpenEditGroupModal] = useState(false);
  const [openCreateFencesModal, setOpenCreateFencesModal] = useState(false);
  const [openFencesManagementModal, setOpenFencesManagementModal] =
    useState(false);
  const [openViewFencesModal, setOpenViewFencesModal] = useState(false);
  const [openEditFencesModal, setOpenEditFencesModal] = useState(false);
  const [editGroupInformation, setEditGroupInformation] = useState("");
  const [singleGroupInformation, setSingleGroupInformation] =
    useState<any>(null);
  const [openViewGroupModal, setOpenViewGroupModal] = useState(false);
  const [openAddMembersModal, setOpenAddMembersModal] = useState(false);
  const [addMemberSuccess, setAddMemberSuccess] = useState(false);
  const [addMembererror, setAddMembererror] = useState(false);
  const [addMemberErrorMsg, setaddMemberErrorMsg] = useState("");
  const [openRemoveMembersModal, setOpenRemoveMembersModal] = useState(false);
  const [removeMemberSuccess, setRemoveMemberSuccess] = useState(false);
  const [removeMembererror, setRemoveMembererror] = useState(false);
  const [removeMemberErrorMsg, setRemoveMemberErrorMsg] = useState("");
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [groupId, setGroupId] = useState("");
  const [leaveGrouperror, setLeaveGrouperror] = useState(false);
  const [leaveGrouperrorMsg, setLeaveGrouperrorMsg] = useState("");
  const [openAddAdminModal, setOpenAddAdminModal] = useState(false);
  const [addAdminSuccess, setAddAdminSuccess] = useState(false);
  const [addAdminerror, setAddAdminerror] = useState(false);
  const [addAdminErrorMsg, setaddAdminErrorMsg] = useState("");
  const [openRemoveAdminModal, setOpenRemoveAdminModal] = useState(false);
  const [removeAdminSuccess, setRemoveAdminSuccess] = useState(false);
  const [removeAdminerror, setRemoveAdminerror] = useState(false);
  const [removeAdminErrorMsg, setRemoveAdminErrorMsg] = useState("");
  const [createFencesSuccess, setCreateFencesSuccess] = useState(false);
  const [createFenceserror, setCreateFenceserror] = useState(false);
  const [createFencesErrorMsg, setCreateFencesErrorMsg] = useState("");
  const [openGroupInviteModal, setOpenGroupInviteModal] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [singleFences, setSingleFences] = useState<any>({});
  const [editFencesSuccess, setEditFencesSuccess] = useState(false);
  const [editFenceserror, setEditFenceserror] = useState(false);
  const [editFencesErrorMsg, setEditFencesErrorMsg] = useState("");
  const [mobileDeviceModal, setMobileDeviceModal] = useState(false);
  const [fencesLng, setFencesLng] = useState<any>(null);
  const [fencesLat, setFencesLat] = useState<any>(null);
  const [fencesAddress, setFencesAddress] = useState<string>("");

  const {
    markersArray,
    setMarkersArray,
    placesMarkersArray,
    setPlacesMarkersArray,
    createFencesMarkersArray,
    setCreateFencesMarkersArray,
  } = useMarkerOnMapContext();

  // create fences related marker code start
  const clearPreviousAllMarkers = () => {
    placesMarkersArray.forEach((marker: any) => {
      marker.remove();

      const [longitude, latitude] = marker.getLngLat().toArray();
      const sourceId = `circle-${latitude}-${longitude}`;
      const layerId = `circle-layer-${latitude}-${longitude}`;

      if (mapMain?.getLayer(layerId)) {
        mapMain?.removeLayer(layerId);
      }
      if (mapMain?.getSource(sourceId)) {
        mapMain?.removeSource(sourceId);
      }
    });
    // removePreMarkers code start
    markersArray.forEach((marker: any) => marker.remove());
    setMarkersArray([]);
    // removePreMarkers code end
    setPlacesMarkersArray([]);
    //  setHideCreateFences(!hideCreateFences);
  };

  const addCreateFencesNewMarker = (
    placesData: any,
    mapInstance: mapboxgl.Map
  ) => {
    let { latitude, longitude } = placesData;

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

    const marker = new mapboxgl.Marker({
      draggable: true,
      element: markerElement,
    });
    if (longitude && latitude) {
      marker.setLngLat([longitude, latitude]).addTo(mapInstance);
    }

    marker.on("drag", () => {
      const { lng, lat } = marker.getLngLat();

      // Update the circle's position
      const NewCircleMarker: any = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
      };
      const source = mapInstance.getSource(sourceId) as mapboxgl.GeoJSONSource;
      source.setData({
        type: "FeatureCollection",
        features: [NewCircleMarker],
      });
    });
    marker.on("dragend", () => {
      const { lng, lat } = marker.getLngLat();
      setFencesLng(lng);
      setFencesLat(lat);
      getAddressFromCoordinates(lat, lng)
        .then((res) => {
          setFencesAddress(res);
        })
        .catch((error) => {
          // setFencesAddressError()
        });
    });

    // Return the marker for later reference
    setCreateFencesMarkersArray((prevMarkers: any) => [...prevMarkers, marker]);
    return marker;
  };
  const clearCreateFencesNewMarker = () => {
    createFencesMarkersArray.forEach((marker: any) => {
      marker.remove();
      let prevLatitude = 40.7128;
      let prevLongitude = -74.006;
      const [longitude, latitude] = marker.getLngLat().toArray();
      // const sourceId = `circle-${latitude}-${longitude}`;
      // const layerId = `circle-layer-${latitude}-${longitude}`;
      const sourceId = `circle-${prevLatitude}-${prevLongitude}`;
      const layerId = `circle-layer-${prevLatitude}-${prevLongitude}`;

      if (mapMain?.getLayer(layerId)) {
        mapMain?.removeLayer(layerId);
      }
      if (mapMain?.getSource(sourceId)) {
        mapMain?.removeSource(sourceId);
      }
    });

    setCreateFencesMarkersArray([]);
  };

  const updateFencesNewMarker = (
    placesData: any,
    mapInstance: mapboxgl.Map,
    radiusValue: number
  ) => {
    let prevLatitude = 40.7128;
    let prevLongitude = -74.006;
    let { latitude, longitude } = placesData;
    const circleRadius = radiusValue;
    const prevSourceId = `circle-${prevLatitude}-${prevLongitude}`;
    const prevLayerId = `circle-layer-${prevLatitude}-${prevLongitude}`;
    const circleMarker: any = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    };
    if (!mapInstance.getSource(prevSourceId)) {
    } else {
      // If the source exists, update its data
      const source = mapInstance.getSource(
        prevSourceId
      ) as mapboxgl.GeoJSONSource;
      source.setData({
        type: "FeatureCollection",
        features: [circleMarker],
      });
      // If the layer exists, update its paint properties (like circle radius)
      if (mapInstance.getLayer(prevLayerId)) {
        mapInstance.setPaintProperty(
          prevLayerId,
          "circle-radius",
          circleRadius
        );
      }
    }
  };

  // create fences related marker code end

  const handleAddMemberSuccessModalClose = () => {
    setAddMemberSuccess(false);
  };
  const handleAddMemberErrorModalClose = () => {
    setAddMembererror(false);
  };

  const handleAddAdminSuccessModalClose = () => {
    setAddAdminSuccess(false);
  };
  const handleAddAdminErrorModalClose = () => {
    setAddAdminerror(false);
  };
  const handleRemoveAdminSuccessModalClose = () => {
    setRemoveAdminSuccess(false);
  };
  const handleCreateFencesSuccessModalClose = () => {
    setCreateFencesSuccess(false);
  };
  const handleRemoveAdminErrorModalClose = () => {
    setRemoveAdminerror(false);
  };
  const handleCreateFencesErrorModalClose = () => {
    setCreateFenceserror(false);
  };

  const handleRemoveMemberSuccessModalClose = () => {
    setRemoveMemberSuccess(false);
  };
  const handleRemoveMemberErrorModalClose = () => {
    setRemoveMembererror(false);
  };
  const handleLeaveGrouperrorModalClose = () => {
    setLeaveGrouperror(false);
  };

  const handleEditFencesSuccessModalClose = () => {
    setEditFencesSuccess(false);
  };
  const handleEditFencesErrorModalClose = () => {
    setEditFenceserror(false);
  };

  const handleSingleGroupInformation = async (group_id: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/groups/${group_id}`,
        {
          headers: {
            // @ts-ignore
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );

      if (response?.data?.document) {
        setSingleGroupInformation(response?.data?.document);
      }
    } catch (error) {}
  };

  const handleAlertModalClose = () => {
    setAlertModalOpen(false);
  };

  const handleLeaveGroup = () => {
    if (groupId) {
      axios
        .patch(
          // @ts-ignore
          `${process.env.NEXT_PUBLIC_API_URL}/groups/leave/${groupId}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              // @ts-ignore
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        )
        .then((res) => {
          setAlertModalOpen(false);
          reFetchGroupListData();
        })
        .catch((error) => {
          if (error?.response?.data?.message) {
            setAlertModalOpen(false);
            setLeaveGrouperrorMsg(error?.response?.data?.message);
          }
        });
    }
  };

  const handleGenerateInviteCode = (groupId: string) => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/groups/${groupId}/invite/generate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      )
      .then((res) => {
        setInviteCode(res?.data?.document?.invite_code);
      })
      .catch((error) => {});
  };

  return (
    <>
      {!groupsModalWithFences && (
        <Grid
          onClick={() => {
            handleGroupsModalHide();
          }}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 100,
            backgroundColor: Colors.white,
            opacity: 0.4,
          }}
        ></Grid>
      )}

      {alertModalOpen ? (
        <AlertModal
          message="Are you sure you want to leave this group?"
          onClose={handleAlertModalClose}
          onConfirm={handleLeaveGroup}
        />
      ) : (
        ""
      )}
      {/* Mobile device grid */}
      {!groupsModalWithFences && (
        <Grid
          onClick={() => {
            handleGroupsModalHide();
            setMobileDeviceModal(true);
          }}
          sx={{
            display: {
              xs: mobileDeviceModal ? "none" : "block",
              md: "none",
            },
            width: "100%",
            height: "100vh",
            backgroundColor: Colors.white,
            opacity: 0.4,
            position: "absolute",
            zIndex: 1000,
          }}
        ></Grid>
      )}

      {!groupsModalWithFences && (
        <Grid
          sx={{
            zIndex: 1000,
            position: "absolute",
            top: "50%",
            left: {
              xs: "50%",
              md: moveCreateGroupForm ? "360px" : "50%",
            },
            transform: {
              xs: "translate(-50%, -50%)",
              md: moveCreateGroupForm
                ? "translate(0, -50%)"
                : "translate(-50%, -50%)",
            },
            backgroundColor: Colors.black,
            minWidth: {
              xs: "80%",
              sm: "400px",
            },
            maxWidth: {
              xs: "80%",
              sm: "80%",
              md: "60%",
            },
            padding: "20px 20px",
            borderRadius: "8px",
            maxHeight: "100vh",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}

          // sx={{
          //   zIndex: 1000,
          //   position: "absolute",
          //   top: "50%",
          //   left: moveCreateGroupForm ? "360px" : "50%",
          //   transform: moveCreateGroupForm
          //     ? "translate(0, -50%)"
          //     : "translate(-50%, -50%)",
          //   backgroundColor: Colors.black,
          //   minWidth: "400px",
          //   padding: "20px 20px",
          //   borderRadius: "8px",
          //   maxHeight: "100vh",
          //   overflowY: "auto",
          //   "&::-webkit-scrollbar": {
          //     display: "none",
          //   },
          // }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="close"
            onClick={() => handleGroupsModalHide()}
            sx={{
              position: "absolute",
              right: "6px",
              top: "6px",
              backgroundColor: Colors.red,
              borderRadius: "50px",
              "&:hover": {
                backgroundColor: Colors.red,
              },
            }}
          >
            <CloseIcon sx={{ color: Colors.white, fontSize: "16px" }} />
          </IconButton>
          <Grid>
            <h6
              style={{ color: Colors.blue }}
              className="py-1 px-1 font-bold text-center mb-2"
            >
              Group List
            </h6>
            <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
              <Table
                sx={{
                  minWidth: 700,
                }}
                aria-label="customized table"
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell
                      align="left"
                      sx={{
                        paddingTop: "3px",
                        paddingBottom: "3px",
                        backgroundColor: `${Colors.black} !important`,
                        color: `${Colors.white} !important`,
                      }}
                    >
                      Group Name
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      sx={{
                        paddingTop: "3px",
                        paddingBottom: "3px",
                        backgroundColor: `${Colors.black} !important`,
                        color: `${Colors.white} !important`,
                      }}
                    >
                      Total Members
                    </StyledTableCell>

                    <StyledTableCell
                      align="right"
                      sx={{
                        paddingTop: "3px",
                        paddingBottom: "3px",
                        backgroundColor: `${Colors.black} !important`,
                        color: `${Colors.white} !important`,
                      }}
                    >
                      Action
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupInformationData.map((row: any, i) => (
                    <StyledTableRow key={row.uuid}>
                      <StyledTableCell
                        align="left"
                        sx={{
                          backgroundColor: `${Colors.black} !important`,
                          color: `${Colors.white} !important`,
                        }}
                      >
                        {row.name}
                      </StyledTableCell>

                      <StyledTableCell
                        align="center"
                        sx={{
                          backgroundColor: `${Colors.black} !important`,
                          color: `${Colors.white} !important`,
                        }}
                      >
                        {row.merberCount}
                      </StyledTableCell>

                      <StyledTableCell
                        align="right"
                        sx={{
                          backgroundColor: `${Colors.black} !important`,
                          color: `${Colors.white} !important`,
                        }}
                      >
                        <Grid
                          sx={{
                            display: "flex",
                            columnGap: "6px",
                            justifyContent: "end",
                            alignItems: "center",
                          }}
                        >
                          <Tooltip title="View Group">
                            <Button
                              onClick={() => {
                                setOpenViewGroupModal(true);
                                handleSingleGroupInformation(row?.uuid);
                                setAlertModalOpen(false);
                              }}
                              variant="contained"
                              color="primary"
                              sx={{
                                fontSize: "18px",
                                padding: "3px",
                                minWidth: 0,
                                backgroundColor: `${Colors.black} !important`,
                                color: `${Colors.white} !important`,
                                "&:hover": {
                                  backgroundColor: Colors.blue,
                                },
                              }}
                            >
                              <MdOutlineVisibility />
                            </Button>
                          </Tooltip>
                          <Tooltip title="Leave Group">
                            <Button
                              onClick={() => {
                                setGroupId(row?.uuid);
                                setAlertModalOpen(!alertModalOpen);
                              }}
                              variant="contained"
                              color="primary"
                              sx={{
                                fontSize: "18px",
                                padding: "3px",
                                minWidth: 0,
                                backgroundColor: `${Colors.black} !important`,
                                color: `${Colors.white} !important`,
                                "&:hover": {
                                  backgroundColor: Colors.blue,
                                },
                              }}
                            >
                              <HiOutlineUserRemove />
                            </Button>
                          </Tooltip>
                        </Grid>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}

      {/* view group */}

      {openViewGroupModal ? (
        <ViewGroup
          setMainSidebarMenuOpen={setMenuOpen}
          mapMain={mapMain}
          clearPreviousAllMarkers={clearPreviousAllMarkers}
          addCreateFencesNewMarker={addCreateFencesNewMarker}
          singleGroupInformation={singleGroupInformation}
          setOpenViewGroupModal={setOpenViewGroupModal}
          setEditGroupInformation={setEditGroupInformation}
          setOpenAddMembersModal={setOpenAddMembersModal}
          setOpenRemoveMembersModal={setOpenRemoveMembersModal}
          setOpenEditGroupModal={setOpenEditGroupModal}
          reFetchGroupListData={reFetchGroupListData}
          setOpenAddAdminModal={setOpenAddAdminModal}
          setOpenRemoveAdminModal={setOpenRemoveAdminModal}
          setOpenGroupInviteModal={setOpenGroupInviteModal}
          handleGenerateInviteCode={handleGenerateInviteCode}
          setOpenCreateFencesModal={setOpenCreateFencesModal}
          setOpenFencesManagementModal={setOpenFencesManagementModal}
        />
      ) : (
        ""
      )}
      {/* add member  */}
      {openAddMembersModal ? (
        <AddMembers
          setOpenViewGroupModal={setOpenViewGroupModal}
          setOpenAddMembersModal={setOpenAddMembersModal}
          editGroupInformation={editGroupInformation}
          setAddMemberSuccess={setAddMemberSuccess}
          setAddMembererror={setAddMembererror}
          setaddMemberErrorMsg={setaddMemberErrorMsg}
          reFetchGroupListData={reFetchGroupListData}
        />
      ) : (
        ""
      )}
      <AlertMessage
        open={addMemberSuccess}
        onClose={handleAddMemberSuccessModalClose}
        message="User successfully added to the group"
        severity="success"
      />
      <AlertMessage
        open={addMembererror}
        onClose={handleAddMemberErrorModalClose}
        message={addMemberErrorMsg}
        severity="error"
      />
      {/* Remove member */}
      {openRemoveMembersModal ? (
        <RemoveMembers
          setOpenViewGroupModal={setOpenViewGroupModal}
          setOpenRemoveMembersModal={setOpenRemoveMembersModal}
          editGroupInformation={editGroupInformation}
          setRemoveMemberSuccess={setRemoveMemberSuccess}
          setRemoveMembererror={setRemoveMembererror}
          reFetchGroupListData={reFetchGroupListData}
          setRemoveMemberErrorMsg={setRemoveMemberErrorMsg}
        />
      ) : (
        ""
      )}
      <AlertMessage
        open={removeMemberSuccess}
        onClose={handleRemoveMemberSuccessModalClose}
        message="User successfully removed from the group"
        severity="success"
      />
      <AlertMessage
        open={removeMembererror}
        onClose={handleRemoveMemberErrorModalClose}
        message={removeMemberErrorMsg}
        severity="error"
      />
      {/* Edit group */}
      {openEditGroupModal ? (
        <EditGroup
          setOpenViewGroupModal={setOpenViewGroupModal}
          setOpenEditGroupModal={setOpenEditGroupModal}
          editGroupInformation={editGroupInformation}
          reFetchGroupListData={reFetchGroupListData}
        />
      ) : (
        ""
      )}

      {/* Leave member from group error */}

      <AlertMessage
        open={leaveGrouperror}
        onClose={handleLeaveGrouperrorModalClose}
        message={leaveGrouperrorMsg}
        severity="error"
      />
      {/* Add Admin */}
      {openAddAdminModal ? (
        <AddAdmin
          setOpenViewGroupModal={setOpenViewGroupModal}
          setOpenAddAdminModal={setOpenAddAdminModal}
          editGroupInformation={editGroupInformation}
          setAddAdminSuccess={setAddAdminSuccess}
          setAddAdminerror={setAddAdminerror}
          setaddAdminErrorMsg={setaddAdminErrorMsg}
          reFetchGroupListData={reFetchGroupListData}
        />
      ) : (
        ""
      )}
      <AlertMessage
        open={addAdminSuccess}
        onClose={handleAddAdminSuccessModalClose}
        message="Admin successfully added to the group"
        severity="success"
      />
      <AlertMessage
        open={addAdminerror}
        onClose={handleAddAdminErrorModalClose}
        message={addAdminErrorMsg}
        severity="error"
      />
      {/* Remove Admin */}
      {openRemoveAdminModal ? (
        <RemoveAdmin
          setOpenViewGroupModal={setOpenViewGroupModal}
          setOpenRemoveAdminModal={setOpenRemoveAdminModal}
          editGroupInformation={editGroupInformation}
          setRemoveAdminSuccess={setRemoveAdminSuccess}
          setRemoveAdminerror={setRemoveAdminerror}
          setRemoveAdminErrorMsg={setRemoveAdminErrorMsg}
          reFetchGroupListData={reFetchGroupListData}
        />
      ) : (
        ""
      )}
      <AlertMessage
        open={removeAdminSuccess}
        onClose={handleRemoveAdminSuccessModalClose}
        message="Admin successfully removed from the group"
        severity="success"
      />
      <AlertMessage
        open={removeAdminerror}
        onClose={handleRemoveAdminErrorModalClose}
        message={removeAdminErrorMsg}
        severity="error"
      />
      {/* Group Invite */}
      {openGroupInviteModal ? (
        <GroupInvite
          setOpenViewGroupModal={setOpenViewGroupModal}
          openGroupInviteModal={openGroupInviteModal}
          setOpenGroupInviteModal={setOpenGroupInviteModal}
          editGroupInformation={editGroupInformation}
          reFetchGroupListData={reFetchGroupListData}
          inviteCode={inviteCode}
        />
      ) : (
        ""
      )}

      {/* Create Fences */}
      {openCreateFencesModal ? (
        <CreateFences
          updateFencesNewMarker={updateFencesNewMarker}
          fencesLng={fencesLng}
          setFencesLng={setFencesLng}
          fencesLat={fencesLat}
          setFencesLat={setFencesLat}
          fencesAddress={fencesAddress}
          setFencesAddress={setFencesAddress}
          clearCreateFencesNewMarker={clearCreateFencesNewMarker}
          mapMain={mapMain}
          setOpenViewGroupModal={setOpenViewGroupModal}
          setOpenFencesManagementModal={setOpenFencesManagementModal}
          setOpenCreateFencesModal={setOpenCreateFencesModal}
          editGroupInformation={editGroupInformation}
          setCreateFencesSuccess={setCreateFencesSuccess}
          setCreateFenceserror={setCreateFenceserror}
          setCreateFencesErrorMsg={setCreateFencesErrorMsg}
        />
      ) : (
        ""
      )}
      <AlertMessage
        open={createFencesSuccess}
        onClose={handleCreateFencesSuccessModalClose}
        message="Fences created successfully!"
        severity="success"
      />
      <AlertMessage
        open={createFenceserror}
        onClose={handleCreateFencesErrorModalClose}
        message={createFencesErrorMsg}
        severity="error"
      />
      {/* Fences Management */}
      {openFencesManagementModal ? (
        <FencesManagement
          setOpenViewGroupModal={setOpenViewGroupModal}
          setOpenFencesManagementModal={setOpenFencesManagementModal}
          editGroupInformation={editGroupInformation}
          setOpenViewFencesModal={setOpenViewFencesModal}
          setSingleFences={setSingleFences}
          handleSingleGroupInformation={handleSingleGroupInformation}
        />
      ) : (
        ""
      )}
      {/* View Fences */}
      {openViewFencesModal ? (
        <ViewFences
          setOpenFencesManagementModal={setOpenFencesManagementModal}
          setOpenEditFencesModal={setOpenEditFencesModal}
          setOpenViewFencesModal={setOpenViewFencesModal}
          singleFences={singleFences}
          singleGroupInformation={singleGroupInformation}
        />
      ) : (
        ""
      )}
      {/* Edit Fences */}
      {openEditFencesModal ? (
        <EditFences
          setOpenViewFencesModal={setOpenViewFencesModal}
          setOpenFencesManagementModal={setOpenFencesManagementModal}
          setOpenEditFencesModal={setOpenEditFencesModal}
          editGroupInformation={editGroupInformation}
          setEditFencesSuccess={setEditFencesSuccess}
          setEditFenceserror={setEditFenceserror}
          setEditFencesErrorMsg={setEditFencesErrorMsg}
          singleFences={singleFences}
        />
      ) : (
        ""
      )}

      <AlertMessage
        open={editFencesSuccess}
        onClose={handleEditFencesSuccessModalClose}
        message="Fences updated successfully!"
        severity="success"
      />
      <AlertMessage
        open={editFenceserror}
        onClose={handleEditFencesErrorModalClose}
        message={editFencesErrorMsg}
        severity="error"
      />
    </>
  );
};

export default GroupManagement;
