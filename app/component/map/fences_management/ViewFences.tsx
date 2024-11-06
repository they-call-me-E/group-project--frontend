"use client";
import Grid from "@mui/material/Grid2";
import { Colors } from "../../../theme/colors";
import Image from "next/image";
import Settings from "./../../../../assets/settings.png";
import { Typography, Button } from "@mui/material";
import { useState } from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FaRegEdit } from "react-icons/fa";
import { useSession } from "next-auth/react";
import AlertModal from "../../message/AlertModal";
import { MdOutlineDelete } from "react-icons/md";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useUserActionOpenContext } from "../../../context/map/UserActionContext";

const ViewFences = ({
  addUpdateFencesNewMarker,
  mapMain,
  clearPreviousAllMarkers,
  setMainSidebarMenuOpen,
  setOpenEditFencesModal,
  setOpenViewFencesModal,
  singleFences,
  singleGroupInformation,
  setOpenFencesManagementModal,
}: {
  addUpdateFencesNewMarker: (placesData: any, mapInstance: mapboxgl.Map) => any;
  mapMain: mapboxgl.Map | null;
  clearPreviousAllMarkers: () => void;
  setMainSidebarMenuOpen: React.Dispatch<React.SetStateAction<any>>;
  setOpenEditFencesModal: React.Dispatch<React.SetStateAction<any>>;
  setOpenViewFencesModal: React.Dispatch<React.SetStateAction<any>>;
  singleFences: any;
  singleGroupInformation: any;
  setOpenFencesManagementModal: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const { handleGroupsModalWithFencesOpen } = useUserActionOpenContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [groupId, setGroupId] = useState("");
  const [fencesId, setFencesId] = useState("");

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleAlertModalClose = () => {
    setAlertModalOpen(false);
  };

  const handleDeleteFences = () => {
    if (groupId && fencesId) {
      axios
        .delete(
          // @ts-ignore
          `${process.env.NEXT_PUBLIC_API_URL}/group/${groupId}/fences/${fencesId}/delete`,
          {
            headers: {
              // @ts-ignore
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        )
        .then((res) => {
          if (res?.status === 204) {
            setOpenFencesManagementModal(true);
            setAlertModalOpen(false);
            setOpenViewFencesModal(false);
          }
        })
        .catch((error) => {});
    }
  };

  return (
    <>
      <Grid
        onClick={() => {
          setOpenViewFencesModal(false);
        }}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1000,
          backgroundColor: Colors.white,
          opacity: 0.4,
        }}
      ></Grid>
      <Grid
        sx={{
          zIndex: 1000,
          position: "absolute",
          top: "50%",
          left: {
            xs: "50%",
            sm: "50%",
            md: "360px",
          },
          transform: {
            xs: "translate(-50%, -50%)",
            sm: "translate(-50%, -50%)",
            md: "translate(0, -50%)",
          },
          width: {
            xs: "90%",
            sm: "400px",
          },
          maxHeight: "80vh",
          backgroundColor: Colors.black,
          padding: "20px 20px",
          borderRadius: "8px",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Grid>
          <Grid
            sx={{
              backgroundColor: Colors.blue,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "3px",
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="close"
              onClick={() => {
                setOpenViewFencesModal(false);
                setOpenFencesManagementModal(true);
              }}
              sx={{
                padding: "8px",
                backgroundColor: Colors.lightBlue,
                marginLeft: 0,
                borderRadius: "12px",
                "&:hover": {
                  backgroundColor: Colors.lightBlue,
                },
              }}
            >
              <IoMdArrowRoundBack
                style={{ color: Colors.black, fontSize: "16px" }}
              />
            </IconButton>
            <h6 className="py-1 px-1 font-bold text-center">
              Fences Name: {singleFences?.name}
            </h6>
            <Grid
              onClick={handleMenuToggle}
              className="cursor-pointer"
              sx={{
                backgroundColor: Colors.lightBlue,
                padding: "8px",
                display: "inline-block",
                borderRadius: "12px",
              }}
            >
              <Image
                src={Settings}
                width={20}
                height={20}
                alt="Setting Icon"
                className="w-[20px] h-[20px] object-contain"
              />
            </Grid>
          </Grid>
          {/* Modal code start */}
          {menuOpen ? (
            <Grid
              sx={{
                backgroundColor: Colors.white,
                position: "absolute",
                top: "20px",
                right: "20px",
                width: "170px",
                minHeight: "50px",
                padding: "12px 6px",
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="close"
                onClick={handleMenuToggle}
                sx={{
                  position: "absolute",
                  right: "3px",
                  top: "3px",
                  backgroundColor: Colors.red,
                  borderRadius: "50px",
                  "&:hover": {
                    backgroundColor: Colors.red,
                  },
                }}
              >
                <CloseIcon sx={{ color: Colors.white, fontSize: "16px" }} />
              </IconButton>

              {singleGroupInformation?.adminList?.find((user: any) => {
                // @ts-ignore
                return user?.uuid === session?.user?.id;
              }) ? (
                <Grid
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    columnGap: "6px",
                    justifyContent: "start",
                    rowGap: "6px",
                    // alignItems: "center",
                    marginTop: "24px",
                  }}
                >
                  <Button
                    onClick={() => {
                      clearPreviousAllMarkers();
                      handleGroupsModalWithFencesOpen();
                      setMainSidebarMenuOpen(false);
                      setOpenEditFencesModal(true);
                      setOpenViewFencesModal(false);
                      //setEditGroupInformation(singleGroupInformation);

                      addUpdateFencesNewMarker(
                        { latitude: 40.7128, longitude: -74.006 },
                        // @ts-ignore
                        mapMain
                      );
                    }}
                    variant="contained"
                    color="primary"
                    sx={{
                      display: "flex",
                      columnGap: "6px",
                      alignItems: "center",
                      justifyContent: "start",
                      fontSize: "16px",
                      padding: "3px",
                      width: "100%",
                      backgroundColor: "transparent",
                      boxShadow: "none !important",
                      "&:hover": {
                        backgroundColor: Colors.lightBlue,
                      },
                    }}
                  >
                    <FaRegEdit />
                    <Typography
                      variant="body1"
                      sx={{
                        color: Colors.black,
                        fontWeight: "500",
                        letterSpacing: 0.8,
                        fontSize: "14px",
                        textTransform: "capitalize",
                      }}
                    >
                      Edit Fences
                    </Typography>
                  </Button>
                  <Button
                    onClick={() => {
                      // handleDeleteGroup(singleGroupInformation?.uuid);

                      setGroupId(singleGroupInformation?.uuid);
                      setFencesId(singleFences?.uuid);
                      setAlertModalOpen(!alertModalOpen);
                    }}
                    variant="contained"
                    color="primary"
                    sx={{
                      display: "flex",
                      columnGap: "6px",
                      alignItems: "center",
                      justifyContent: "start",
                      fontSize: "16px",
                      padding: "3px",
                      width: "100%",
                      backgroundColor: "transparent",
                      boxShadow: "none !important",
                      "&:hover": {
                        backgroundColor: Colors.lightBlue,
                      },
                    }}
                  >
                    <MdOutlineDelete />
                    <Typography
                      variant="body1"
                      sx={{
                        color: Colors.black,
                        fontWeight: "500",
                        letterSpacing: 0.8,
                        fontSize: "14px",
                        textTransform: "capitalize",
                      }}
                    >
                      Delete Fences
                    </Typography>
                  </Button>
                </Grid>
              ) : (
                ""
              )}
            </Grid>
          ) : (
            ""
          )}

          {/* Modal code end */}
          <Grid
            sx={{
              padding: "10px 3px",
            }}
          >
            <p className="flex w-[80%] text-[14px] text-[#fff]">
              <span className="basis-[40%]"> Latitude:</span>{" "}
              <span className="basis-[60%]">{singleFences?.latitude}</span>
            </p>
            <p className="flex w-[80%] text-[14px] text-[#fff]">
              <span className="basis-[40%]"> Longitude:</span>{" "}
              <span className="basis-[60%]">{singleFences?.longitude}</span>
            </p>
            <p className="flex w-[80%] text-[14px] text-[#fff]">
              <span className="basis-[40%]">Radius:</span>{" "}
              <span className="basis-[60%]">{singleFences?.radius}</span>
            </p>
          </Grid>
        </Grid>
      </Grid>
      {/* Delete group modal */}
      {alertModalOpen ? (
        <>
          <Grid
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: Colors.black,
              opacity: 0.5,
              position: "absolute",
              zIndex: 1000,
            }}
          ></Grid>
          <AlertModal
            message="Are you sure you want to delete this fences?"
            onClose={handleAlertModalClose}
            onConfirm={handleDeleteFences}
          />
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default ViewFences;
