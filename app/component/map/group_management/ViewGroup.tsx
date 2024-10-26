"use client";
import { Colors } from "@/app/theme/colors";
import Grid from "@mui/material/Grid2";
import axios from "axios";
import { useSession } from "next-auth/react";
import { FaRegEdit } from "react-icons/fa";
import { HiOutlineUserAdd } from "react-icons/hi";
import { HiOutlineUserRemove } from "react-icons/hi";
import { MdOutlineDelete } from "react-icons/md";
import { Button, Typography } from "@mui/material";
import Image from "next/image";
import DefaultUser from "./../../../../assets/default_user.png";
import { convertToDMS } from "./../../../utils/convertToDMS";
import { convertToMph } from "./../../../utils/convertToMPH";
import Settings from "./../../../../assets/settings.png";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import React, { useState } from "react";
import { PiTelegramLogo } from "react-icons/pi";
import AlertModal from "../../message/AlertModal";
import { MdOutlineVisibility } from "react-icons/md";
import CircularProgress from "@mui/material/CircularProgress";

const ViewGroup = ({
  singleGroupInformation,
  setOpenViewGroupModal,
  setEditGroupInformation,
  setOpenAddMembersModal,
  setOpenRemoveMembersModal,
  setOpenEditGroupModal,
  reFetchGroupListData,
  setOpenAddAdminModal,
  setOpenRemoveAdminModal,
  setOpenGroupInviteModal,
  handleGenerateInviteCode,
  setOpenCreateFencesModal,
  setOpenFencesManagementModal,
}: {
  handleGenerateInviteCode: (groupId: string) => void;
  singleGroupInformation: any;
  setOpenViewGroupModal: React.Dispatch<React.SetStateAction<any>>;
  setEditGroupInformation: React.Dispatch<React.SetStateAction<any>>;
  setOpenAddMembersModal: React.Dispatch<React.SetStateAction<any>>;
  setOpenRemoveMembersModal: React.Dispatch<React.SetStateAction<any>>;
  setOpenEditGroupModal: React.Dispatch<React.SetStateAction<any>>;
  reFetchGroupListData: () => void;
  setOpenAddAdminModal: React.Dispatch<React.SetStateAction<any>>;
  setOpenRemoveAdminModal: React.Dispatch<React.SetStateAction<any>>;
  setOpenGroupInviteModal: React.Dispatch<React.SetStateAction<any>>;
  setOpenCreateFencesModal: React.Dispatch<React.SetStateAction<any>>;
  setOpenFencesManagementModal: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [groupId, setGroupId] = useState("");
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const { data: session, status } = useSession();
  const dateFormateFn = (dateObj: any) => {
    const humanReadableDate = dateObj.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short",
    });
    return humanReadableDate;
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleAlertModalClose = () => {
    setAlertModalOpen(false);
  };
  const handleDeleteGroup = () => {
    if (groupId) {
      axios
        .delete(
          // @ts-ignore
          `${process.env.NEXT_PUBLIC_API_URL}/groups/${groupId}`,
          {
            headers: {
              // @ts-ignore
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        )
        .then((res) => {
          if (res?.status === 204) {
            reFetchGroupListData();
            setOpenViewGroupModal(false);
          }
        })
        .catch((error) => {});
    }
  };

  if (!singleGroupInformation) {
    return (
      <Grid
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress sx={{ color: Colors.red }} size={100} />
      </Grid>
    );
  }

  return (
    <>
      <Grid
        onClick={() => {
          setOpenViewGroupModal(false);
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
            <h6
              // style={{ backgroundColor: Colors.blue }}
              className="py-1 px-1 font-bold text-center"
            >
              Group Name: {singleGroupInformation?.name}
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
                      setOpenViewGroupModal(false);
                      setOpenAddMembersModal(true);
                      setEditGroupInformation(singleGroupInformation);
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
                    <HiOutlineUserAdd />
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
                      Add Member
                    </Typography>
                  </Button>
                  <Button
                    onClick={() => {
                      setOpenViewGroupModal(false);
                      setOpenRemoveMembersModal(true);
                      setEditGroupInformation(singleGroupInformation);
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
                    <HiOutlineUserRemove />
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
                      Remove Member
                    </Typography>
                  </Button>
                  <Button
                    onClick={() => {
                      setOpenViewGroupModal(false);
                      setOpenEditGroupModal(true);
                      setEditGroupInformation(singleGroupInformation);
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
                      Edit Group
                    </Typography>
                  </Button>
                  <Button
                    onClick={() => {
                      // handleDeleteGroup(singleGroupInformation?.uuid);
                      // setOpenViewGroupModal(false);
                      setGroupId(singleGroupInformation?.uuid);
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
                      Delete Group
                    </Typography>
                  </Button>
                  <Button
                    onClick={() => {
                      setOpenViewGroupModal(false);
                      setOpenAddAdminModal(true);
                      setEditGroupInformation(singleGroupInformation);
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
                    <HiOutlineUserAdd />
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
                      Add Admin
                    </Typography>
                  </Button>
                  <Button
                    onClick={() => {
                      setOpenViewGroupModal(false);
                      setOpenRemoveAdminModal(true);
                      setEditGroupInformation(singleGroupInformation);
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
                    <HiOutlineUserRemove />
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
                      Remove Admin
                    </Typography>
                  </Button>
                  <Button
                    onClick={() => {
                      handleGenerateInviteCode(singleGroupInformation?.uuid);
                      setOpenViewGroupModal(false);
                      setOpenGroupInviteModal(true);
                      setEditGroupInformation(singleGroupInformation);
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
                    <PiTelegramLogo />
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
                      Invite Group
                    </Typography>
                  </Button>
                  <Button
                    onClick={() => {
                      setOpenViewGroupModal(false);
                      setOpenCreateFencesModal(true);
                      setEditGroupInformation(singleGroupInformation);
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
                      Create Fences
                    </Typography>
                  </Button>
                  <Button
                    onClick={() => {
                      setOpenViewGroupModal(false);
                      setOpenFencesManagementModal(true);
                      setEditGroupInformation(singleGroupInformation);
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
                    <MdOutlineVisibility />
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
                      View Fences
                    </Typography>
                  </Button>
                </Grid>
              ) : (
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
                      handleGenerateInviteCode(singleGroupInformation?.uuid);
                      setOpenViewGroupModal(false);
                      setOpenGroupInviteModal(true);
                      setEditGroupInformation(singleGroupInformation);
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
                    <PiTelegramLogo />
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
                      Invite Group
                    </Typography>
                  </Button>
                </Grid>
              )}
            </Grid>
          ) : (
            ""
          )}

          {/* Modal code end */}

          <p className="text-center font-semibold my-3 text-white">
            Admin List
          </p>
          {singleGroupInformation?.adminList?.map((item: any, i: number) => {
            return (
              <div
                className="flex flex-col items-center gap-[2px] mb-3 text-white"
                key={item?.uuid}
              >
                <p className="flex w-[80%] text-[14px]">
                  <span className="basis-[40%]">Image:</span>{" "}
                  <div className="basis-[60%]">
                    {item?.avatar ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_API_URL}/img/users/${item?.avatar}`}
                        width={36}
                        height={36}
                        alt="User Icon"
                        className="w-[48px] h-[48px] object-contain rounded-[12px]"
                      />
                    ) : (
                      <Image
                        src={DefaultUser}
                        width={36}
                        height={36}
                        alt="User Icon"
                        className="w-[48px] h-[48px] object-contain cursor-pointer"
                      />
                    )}
                  </div>
                </p>
                <p className="flex w-[80%] text-[14px]">
                  <span className="basis-[40%]">Name:</span>{" "}
                  <span className="basis-[60%]">{item?.name}</span>
                </p>
                <p className="flex w-[80%] justify-between text-[14px]">
                  <span className="basis-[40%]">Email:</span>{" "}
                  <span className="basis-[60%]">{item?.email}</span>
                </p>
                {item?.phone ? (
                  <p className="flex w-[80%] justify-between text-[14px]">
                    <span className="basis-[40%]">Phone:</span>{" "}
                    <span className="basis-[60%]">{item?.phone}</span>
                  </p>
                ) : (
                  ""
                )}
                {item?.location?.latitude ? (
                  <p className="flex w-[80%] justify-between text-[14px]">
                    <span className="basis-[40%]">Latitude</span>{" "}
                    <span className="basis-[60%]">
                      {convertToDMS(item?.location?.latitude)}
                    </span>
                  </p>
                ) : (
                  ""
                )}
                {item?.location?.longitude ? (
                  <p className="flex w-[80%] justify-between text-[14px]">
                    <span className="basis-[40%]">Longitude</span>{" "}
                    <span className="basis-[60%]">
                      {convertToDMS(item?.location?.longitude)}
                    </span>
                  </p>
                ) : (
                  ""
                )}
                {item?.location?.address ? (
                  <p className="flex w-[80%] justify-between text-[14px]">
                    <span className="basis-[40%]">Address:</span>{" "}
                    <span className="basis-[60%]">
                      {item?.location?.address}
                    </span>
                  </p>
                ) : (
                  ""
                )}
                {item?.status?.isMoving ? (
                  <p className="flex w-[80%] justify-between text-[14px]">
                    <span className="basis-[40%]">Is Moving:</span>{" "}
                    <span className="basis-[60%]">
                      {item?.status?.isMoving ? "On" : "Off"}
                    </span>
                  </p>
                ) : (
                  ""
                )}

                {item?.status?.location_sharing ? (
                  <p className="flex w-[80%] justify-between text-[14px]">
                    <span className="basis-[40%]">Location Sharing:</span>{" "}
                    <span className="basis-[60%]">
                      {item?.status?.location_sharing ? "On" : "Off"}
                    </span>
                  </p>
                ) : (
                  ""
                )}

                {item?.status?.speed ? (
                  <p className="flex w-[80%] justify-between text-[14px]">
                    <span className="basis-[40%]">Speed:</span>{" "}
                    <span className="basis-[60%]">
                      {item?.status?.speed
                        ? item?.status?.speed +
                          "km/h" +
                          " " +
                          "(" +
                          convertToMph(item?.status?.speed) +
                          "mph" +
                          ")"
                        : ""}
                    </span>
                  </p>
                ) : (
                  ""
                )}

                {item?.status?.device?.battery_level ? (
                  <p className="flex w-[80%] justify-between text-[14px]">
                    <span className="basis-[40%]">Battery Level:</span>{" "}
                    <span className="basis-[60%]">
                      {item?.status?.device?.battery_level}%
                    </span>
                  </p>
                ) : (
                  ""
                )}
                {item?.status?.device?.charging ? (
                  <p className="flex w-[80%] justify-between text-[14px]">
                    <span className="basis-[40%]">Charging :</span>{" "}
                    <span className="basis-[60%]">
                      {item?.status?.device?.charging ? "On" : "Off"}
                    </span>
                  </p>
                ) : (
                  ""
                )}
                {item?.status?.device?.screen ? (
                  <p className="flex w-[80%] justify-between text-[14px]">
                    <span className="basis-[40%]">Screen :</span>{" "}
                    <span className="basis-[60%]">
                      {item?.status?.device?.screen ? "On" : "Off"}
                    </span>
                  </p>
                ) : (
                  ""
                )}
                {item?.status?.device?.wifi ? (
                  <p className="flex w-[80%] justify-between text-[14px]">
                    <span className="basis-[40%]">Wifi :</span>{" "}
                    <span className="basis-[60%]">
                      {item?.status?.device?.wifi ? "On" : "Off"}
                    </span>
                  </p>
                ) : (
                  ""
                )}
                {item?.createdAt ? (
                  <p className="flex w-[80%] justify-between text-[14px]">
                    <span className="basis-[40%]">CreatedAt:</span>{" "}
                    <span className="basis-[60%]">
                      {dateFormateFn(new Date(item?.createdAt))}
                    </span>
                  </p>
                ) : (
                  ""
                )}
                {item?.updatedAt ? (
                  <p className="flex w-[80%] justify-between text-[14px]">
                    <span className="basis-[40%]">UpdatedAt:</span>{" "}
                    <span className="basis-[60%]">
                      {dateFormateFn(new Date(item?.updatedAt))}
                    </span>
                  </p>
                ) : (
                  ""
                )}
              </div>
            );
          })}
          <p className="text-center font-semibold my-3 text-white">
            Member List
          </p>
          {singleGroupInformation?.members?.map((item: any, i: number) => {
            return (
              <div
                className="flex flex-col items-center gap-[2px] mb-3 text-white"
                key={item?.uuid}
              >
                <p className="flex w-[80%] text-[14px]">
                  <span className="basis-[40%]">Image:</span>{" "}
                  <div className="basis-[60%]">
                    {item?.avatar ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_API_URL}/img/users/${item?.avatar}`}
                        width={36}
                        height={36}
                        alt="User Icon"
                        className="w-[48px] h-[48px] object-contain rounded-[12px]"
                      />
                    ) : (
                      <Image
                        src={DefaultUser}
                        width={36}
                        height={36}
                        alt="User Icon"
                        className="w-[48px] h-[48px] object-contain cursor-pointer"
                      />
                    )}
                  </div>
                </p>
                <p className="flex w-[80%] text-[14px]">
                  <span className="basis-[40%]">Name:</span>{" "}
                  <span className="basis-[60%]">{item?.name}</span>
                </p>
                <p className="flex w-[80%] justify-between text-[14px]">
                  <span className="basis-[40%]">Email:</span>{" "}
                  <span className="basis-[60%]">{item?.email}</span>
                </p>
                {item?.phone ? (
                  <p className="flex w-[80%] justify-between text-[14px]">
                    <span className="basis-[40%]">Phone:</span>{" "}
                    <span className="basis-[60%]">{item?.phone}</span>
                  </p>
                ) : (
                  ""
                )}
                {item?.location?.latitude ? (
                  <p className="flex w-[80%] justify-between text-[14px]">
                    <span className="basis-[40%]">Latitude</span>{" "}
                    <span className="basis-[60%]">
                      {convertToDMS(item?.location?.latitude)}
                    </span>
                  </p>
                ) : (
                  ""
                )}
                {item?.location?.longitude ? (
                  <p className="flex w-[80%] justify-between text-[14px]">
                    <span className="basis-[40%]">Longitude</span>{" "}
                    <span className="basis-[60%]">
                      {convertToDMS(item?.location?.longitude)}
                    </span>
                  </p>
                ) : (
                  ""
                )}
                {item?.location?.address ? (
                  <p className="flex w-[80%] justify-between text-[14px]">
                    <span className="basis-[40%]">Address:</span>{" "}
                    <span className="basis-[60%]">
                      {item?.location?.address}
                    </span>
                  </p>
                ) : (
                  ""
                )}
                {item?.status?.isMoving ? (
                  <p className="flex w-[80%] justify-between text-[14px]">
                    <span className="basis-[40%]">Is Moving:</span>{" "}
                    <span className="basis-[60%]">
                      {item?.status?.isMoving ? "On" : "Off"}
                    </span>
                  </p>
                ) : (
                  ""
                )}

                {item?.status?.location_sharing ? (
                  <p className="flex w-[80%] justify-between text-[14px]">
                    <span className="basis-[40%]">Location Sharing:</span>{" "}
                    <span className="basis-[60%]">
                      {item?.status?.location_sharing ? "On" : "Off"}
                    </span>
                  </p>
                ) : (
                  ""
                )}

                {item?.status?.speed ? (
                  <p className="flex w-[80%] justify-between text-[14px]">
                    <span className="basis-[40%]">Speed:</span>{" "}
                    <span className="basis-[60%]">
                      {item?.status?.speed
                        ? item?.status?.speed +
                          "km/h" +
                          " " +
                          "(" +
                          convertToMph(item?.status?.speed) +
                          "mph" +
                          ")"
                        : ""}
                    </span>
                  </p>
                ) : (
                  ""
                )}

                {item?.status?.device?.battery_level ? (
                  <p className="flex w-[80%] justify-between text-[14px]">
                    <span className="basis-[40%]">Battery Level:</span>{" "}
                    <span className="basis-[60%]">
                      {item?.status?.device?.battery_level}%
                    </span>
                  </p>
                ) : (
                  ""
                )}
                {item?.status?.device?.charging ? (
                  <p className="flex w-[80%] justify-between text-[14px]">
                    <span className="basis-[40%]">Charging :</span>{" "}
                    <span className="basis-[60%]">
                      {item?.status?.device?.charging ? "On" : "Off"}
                    </span>
                  </p>
                ) : (
                  ""
                )}
                {item?.status?.device?.screen ? (
                  <p className="flex w-[80%] justify-between text-[14px]">
                    <span className="basis-[40%]">Screen :</span>{" "}
                    <span className="basis-[60%]">
                      {item?.status?.device?.screen ? "On" : "Off"}
                    </span>
                  </p>
                ) : (
                  ""
                )}
                {item?.status?.device?.wifi ? (
                  <p className="flex w-[80%] justify-between text-[14px]">
                    <span className="basis-[40%]">Wifi :</span>{" "}
                    <span className="basis-[60%]">
                      {item?.status?.device?.wifi ? "On" : "Off"}
                    </span>
                  </p>
                ) : (
                  ""
                )}
                {item?.createdAt ? (
                  <p className="flex w-[80%] justify-between text-[14px]">
                    <span className="basis-[40%]">CreatedAt:</span>{" "}
                    <span className="basis-[60%]">
                      {dateFormateFn(new Date(item?.createdAt))}
                    </span>
                  </p>
                ) : (
                  ""
                )}
                {item?.updatedAt ? (
                  <p className="flex w-[80%] justify-between text-[14px]">
                    <span className="basis-[40%]">UpdatedAt:</span>{" "}
                    <span className="basis-[60%]">
                      {dateFormateFn(new Date(item?.updatedAt))}
                    </span>
                  </p>
                ) : (
                  ""
                )}
              </div>
            );
          })}
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
            message="Are you sure you want to delete this group?"
            onClose={handleAlertModalClose}
            onConfirm={handleDeleteGroup}
          />
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default ViewGroup;
