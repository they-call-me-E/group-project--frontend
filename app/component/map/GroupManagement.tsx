"use client";
import Grid from "@mui/material/Grid2";
import { Colors } from "../../theme/colors";
import React, { useState, useRef, useEffect } from "react";
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
import { createGeoJSONCircle } from "./../../utils/createGeoJSONCircle";

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

const GroupManagement = ({
  moveEditProfileForm,
  setMenuOpen,
  mapMain,
  moveCreateGroupForm,
  groupInformationData,
  setGroupInformationData,
  reFetchGroupListData,
}: {
  moveEditProfileForm: any;
  setMenuOpen: React.Dispatch<React.SetStateAction<any>>;
  mapMain: mapboxgl.Map | null;
  moveCreateGroupForm: any;
  groupInformationData: any[];
  setGroupInformationData: React.Dispatch<React.SetStateAction<any>>;
  reFetchGroupListData: () => void;
}) => {
  const createFencesMapCircleRef = useRef<HTMLDivElement | null>(null);
  const editFencesMapCircleRef = useRef<HTMLDivElement | null>(null);
  const { handleGroupsModalHide, groupsModalWithFences } =
    useUserActionOpenContext();
  const { data: session }: { data: any; status: any } = useSession();
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
  const [editFencesLng, setEditFencesLng] = useState<any>(null);
  const [editFencesLat, setEditFencesLat] = useState<any>(null);
  const [editFencesAddress, setEditFencesAddress] = useState<string>("");
  const circleSourceId = "center-circle-source";
  const circleLayerId = "center-circle-layer";
  const [radiusValue, setRadiusValue] = useState<any>(250);
  const [currentRadius, setCurrentRadius] = useState(250);
  const [centerMarker, setCenterMarker] = useState<mapboxgl.Marker | null>(
    null
  );
  const [editFencesMarkersArray, setEditFencesMarkersArray] = useState<any>([]);

  const [currentEditFenceRadius, setCurrentEditFenceRadius] = useState(250);
  const [currentEditFenceCenterMarker, setCurrentEditFenceCenterMarker] =
    useState<mapboxgl.Marker | null>(null);

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
    setPlacesMarkersArray([]);
  };

  useEffect(() => {
    if (!mapMain) return;

    const handleMapMove = () => {
      if (!centerMarker || !currentRadius) return;

      const center = mapMain.getCenter();
      centerMarker.setLngLat(center);

      // @ts-ignore
      mapMain
        .getSource("geofence")
        // @ts-ignore
        .setData(createGeoJSONCircle(center, currentRadius));
    };

    const handleMapMoveEnd = () => {
      const center = mapMain.getCenter();
      const [lng, lat] = center.toArray();

      setFencesLng(lng);
      setFencesLat(lat);
      getAddressFromCoordinates(lat, lng)
        .then((res) => {
          setFencesAddress(res);
        })
        .catch((error) => {});
    };

    mapMain.on("move", handleMapMove);
    mapMain.on("moveend", handleMapMoveEnd);

    return () => {
      mapMain.off("move", handleMapMove);
      mapMain.off("moveend", handleMapMoveEnd);
    };
  }, [mapMain, centerMarker, currentRadius]);
  useEffect(() => {
    if (!mapMain) return;

    // const [currentEditFenceRadius, setCurrentEditFenceRadius] = useState(250);
    // const [currentEditFenceCenterMarker, setCurrentEditFenceCenterMarker] =
    //    useState<mapboxgl.Marker | null>(null);

    const handleMapMove = () => {
      if (!currentEditFenceCenterMarker || !currentEditFenceRadius) return;

      const center = mapMain.getCenter();
      currentEditFenceCenterMarker.setLngLat(center);

      // @ts-ignore
      mapMain
        .getSource("geofence")
        // @ts-ignore
        .setData(createGeoJSONCircle(center, currentEditFenceRadius));
    };

    const handleMapMoveEnd = () => {
      const center = mapMain.getCenter();
      const [lng, lat] = center.toArray();
      //       setEditFencesLng(lng);
      //       setEditFencesLat(lat);
      //       getAddressFromCoordinates(lat, lng)

      setEditFencesLng(lng);
      setEditFencesLat(lat);
      getAddressFromCoordinates(lat, lng)
        .then((res) => {
          setEditFencesAddress(res);
        })
        .catch((error) => {});
    };

    mapMain.on("move", handleMapMove);
    mapMain.on("moveend", handleMapMoveEnd);

    return () => {
      mapMain.off("move", handleMapMove);
      mapMain.off("moveend", handleMapMoveEnd);
    };
  }, [mapMain, currentEditFenceRadius, currentEditFenceCenterMarker]);

  // Initialize listeners once and update only the radius
  const addCreateFencesNewMarker = (
    placesData: any,
    mapInstance: mapboxgl.Map,
    radiusValue: any = 250
  ) => {
    setCurrentRadius(radiusValue);

    // Remove existing layer and source if they exist
    if (mapInstance.getLayer("geofence-layer")) {
      mapInstance.removeLayer("geofence-layer");
    }
    if (mapInstance.getSource("geofence")) {
      mapInstance.removeSource("geofence");
    }

    // Add or update the marker at the center
    let marker = centerMarker;
    if (!marker) {
      marker = new mapboxgl.Marker({ draggable: false })
        .setLngLat(mapInstance.getCenter())
        .addTo(mapInstance);
      setCenterMarker(marker);
    } else {
      marker.setLngLat(mapInstance.getCenter());
    }

    setCreateFencesMarkersArray((prevMarkers: any) => [...prevMarkers, marker]);

    // Add the new source for the geofence
    mapInstance.addSource("geofence", {
      type: "geojson",
      // @ts-ignore
      data: createGeoJSONCircle(mapInstance.getCenter(), radiusValue),
    });

    // Add the new layer for the geofence
    mapInstance.addLayer({
      id: "geofence-layer",
      type: "fill",
      source: "geofence",
      layout: {},
      paint: {
        "fill-color": Colors.blue,
        "fill-opacity": 0.2,
      },
    });
  };

  const clearCreateFencesNewMarker = () => {
    const geofenceSourceId = "geofence";
    const geofenceLayerId = "geofence-layer";
    createFencesMarkersArray.forEach((marker: any) => marker.remove());
    setCreateFencesMarkersArray([]);
    if (mapMain?.getSource(geofenceSourceId)) {
      mapMain?.removeSource(geofenceSourceId);
    }
    if (mapMain?.getLayer(geofenceLayerId)) {
      mapMain?.removeLayer(geofenceLayerId);
    }
  };

  const updateFencesNewMarker = (
    placesData: any,
    mapInstance: mapboxgl.Map,
    radiusValue: number
  ) => {
    if (mapInstance.getSource(circleSourceId)) {
      if (mapInstance.getLayer(circleLayerId)) {
        mapInstance.removeLayer(circleLayerId);
      }
      if (mapInstance.getSource(circleSourceId)) {
        mapInstance.removeSource(circleSourceId);
      }
      localStorage.removeItem("create_fences_radius_circle");
    }
    if (createFencesMapCircleRef.current) {
      createFencesMapCircleRef.current.style.width = `${radiusValue}px`;
      createFencesMapCircleRef.current.style.height = `${radiusValue}px`;
    }
  };
  const addUpdateFencesNewMarker = (
    placesData: any,
    mapInstance: mapboxgl.Map,
    radiusValue: any = 250
  ) => {
    setCurrentEditFenceRadius(radiusValue);

    // Remove existing layer and source if they exist
    if (mapInstance.getLayer("geofence-layer")) {
      mapInstance.removeLayer("geofence-layer");
    }
    if (mapInstance.getSource("geofence")) {
      mapInstance.removeSource("geofence");
    }

    // Add or update the marker at the center
    let marker = currentEditFenceCenterMarker;
    if (!marker) {
      marker = new mapboxgl.Marker({ draggable: false })
        .setLngLat(mapInstance.getCenter())
        .addTo(mapInstance);
      setCurrentEditFenceCenterMarker(marker);
    } else {
      marker.setLngLat(mapInstance.getCenter());
    }

    // const [currentEditFenceRadius, setCurrentEditFenceRadius] = useState(250);
    // const [currentEditFenceCenterMarker, setCurrentEditFenceCenterMarker] = useState<mapboxgl.Marker | null>(
    //   null
    // );

    // const [editFencesMarkersArray, setEditFencesMarkersArray] = useState<any>([])
    setEditFencesMarkersArray((prevMarkers: any) => [...prevMarkers, marker]);

    // Add the new source for the geofence
    mapInstance.addSource("geofence", {
      type: "geojson",
      // @ts-ignore
      data: createGeoJSONCircle(mapInstance.getCenter(), radiusValue),
    });

    // Add the new layer for the geofence
    mapInstance.addLayer({
      id: "geofence-layer",
      type: "fill",
      source: "geofence",
      layout: {},
      paint: {
        "fill-color": Colors.blue,
        "fill-opacity": 0.2,
      },
    });
  };
  const clearUpdateFencesNewMarker = () => {
    const geofenceSourceId = "geofence";
    const geofenceLayerId = "geofence-layer";
    editFencesMarkersArray.forEach((marker: any) => marker.remove());
    setEditFencesMarkersArray([]);
    if (mapMain?.getSource(geofenceSourceId)) {
      mapMain?.removeSource(geofenceSourceId);
    }
    if (mapMain?.getLayer(geofenceLayerId)) {
      mapMain?.removeLayer(geofenceLayerId);
    }
  };

  const editFencesNewCircle = (
    placesData: any,
    mapInstance: mapboxgl.Map,
    radiusValue: number
  ) => {
    if (editFencesMapCircleRef.current) {
      editFencesMapCircleRef.current.style.width = `${radiusValue}px`;
      editFencesMapCircleRef.current.style.height = `${radiusValue}px`;
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
              md: moveCreateGroupForm || moveEditProfileForm ? "360px" : "50%",
            },
            transform: {
              xs: "translate(-50%, -50%)",
              md:
                moveCreateGroupForm || moveEditProfileForm
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
          addCreateFencesNewMarker={addCreateFencesNewMarker}
          radiusValue={radiusValue}
          setRadiusValue={setRadiusValue}
          updateFencesNewMarker={updateFencesNewMarker}
          fencesLng={fencesLng}
          setFencesLng={setFencesLng}
          fencesLat={fencesLat}
          setFencesLat={setFencesLat}
          fencesAddress={fencesAddress}
          setFencesAddress={setFencesAddress}
          clearCreateFencesNewMarker={clearCreateFencesNewMarker}
          mapMain={mapMain}
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
          addUpdateFencesNewMarker={addUpdateFencesNewMarker}
          mapMain={mapMain}
          clearPreviousAllMarkers={clearPreviousAllMarkers}
          setMainSidebarMenuOpen={setMenuOpen}
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
          clearUpdateFencesNewMarker={clearUpdateFencesNewMarker}
          addUpdateFencesNewMarker={addUpdateFencesNewMarker}
          mapMain={mapMain}
          editFencesNewCircle={editFencesNewCircle}
          fencesLng={editFencesLng}
          setFencesLng={setEditFencesLng}
          fencesLat={editFencesLat}
          setFencesLat={setEditFencesLat}
          fencesAddress={editFencesAddress}
          setFencesAddress={setEditFencesAddress}
          editFencesMapCircleRef={editFencesMapCircleRef}
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
