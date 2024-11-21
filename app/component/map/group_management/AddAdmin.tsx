"use client";
import { Colors } from "@/app/theme/colors";
import Grid from "@mui/material/Grid2";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField, Button, Typography } from "@mui/material";
import { handleUsersInformation } from "./../../../utils/api/userInformation";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import DefaultUser from "./../../../../assets/default_user.png";

const AddAdmin = ({
  setOpenViewGroupModal,
  setOpenAddAdminModal,
  editGroupInformation,
  setAddAdminSuccess,
  setAddAdminerror,
  reFetchGroupListData,
  setaddAdminErrorMsg,
}: {
  setOpenViewGroupModal: React.Dispatch<React.SetStateAction<any>>;
  setOpenAddAdminModal: React.Dispatch<React.SetStateAction<any>>;
  editGroupInformation: any;
  setAddAdminSuccess: React.Dispatch<React.SetStateAction<any>>;
  setAddAdminerror: React.Dispatch<React.SetStateAction<any>>;
  reFetchGroupListData: () => void;
  setaddAdminErrorMsg: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [handleBtn, setHandleBtn] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // @ts-ignore
    handleUsersInformation(session?.user?.token)
      .then((res) => {
        setUserList((prev: any) => {
          return res?.data?.users.map((item: any) => {
            return {
              uuid: item?.uuid,
              label: item?.name,
              avatar: item?.avatar,
            };
          });
        });
      })
      .catch((error) => {});
  }, []);
  const handleAddAdmin = (userId: any, groupId: string) => {
    axios
      .patch(
        // @ts-ignore
        `${process.env.NEXT_PUBLIC_API_URL}/groups/${groupId}/add/admin`,
        {
          userId: userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            // @ts-ignore
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      )
      .then((response) => {
        if (response?.data?.document?.adminList?.length > 0) {
          setAddAdminSuccess(true);
          setOpenAddAdminModal(false);
          reFetchGroupListData();
        }
      })
      .catch((error) => {
        if (error?.response?.data?.message) {
          setAddAdminerror(true);
          setaddAdminErrorMsg(error?.response?.data?.message);
        }
      });
  };

  return (
    <>
      <Grid
        onClick={() => {
          setOpenAddAdminModal(false);
          setOpenViewGroupModal(true);
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
          backgroundColor: Colors.black,
          padding: "20px 20px",
          borderRadius: "8px",
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="close"
          onClick={() => {
            setOpenViewGroupModal(true);
            setOpenAddAdminModal(false);
          }}
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
        {/* updated code start */}
        <Typography
          variant="body1"
          sx={{
            color: Colors.blue,
            letterSpacing: 0.8,
            textAlign: "center",
            padding: "3px 0",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
          mb={1}
        >
          Add Admin
        </Typography>

        <Grid sx={{ display: "flex", columnGap: "6px", alignItems: "center" }}>
          <Autocomplete
            onChange={(e: any, v: any) => {
              if (v) {
                setHandleBtn(false);
                setUserId(v?.uuid);
              } else {
                setHandleBtn(true);
              }
            }}
            disablePortal
            options={userList}
            sx={{
              width: "100%",
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
            renderOption={(props, option) => (
              <li
                {...props}
                className="flex justify-start items-center gap-x-2 mb-1 px-1 cursor-pointer  hover:bg-[#262D3D]"
              >
                {option?.avatar ? (
                  <Image
                    src={`${option?.avatar}`}
                    width={36}
                    height={36}
                    alt="User Icon"
                    className="w-[36px] h-[36px] object-contain rounded-[12px]"
                  />
                ) : (
                  <Image
                    src={DefaultUser}
                    width={36}
                    height={36}
                    alt="User Icon"
                    className="w-[36px] h-[36px] object-contain rounded-[12px]"
                  />
                )}

                <Typography
                  variant="body1"
                  sx={{
                    color: Colors.white,
                    fontWeight: "400",
                    fontSize: "14px",
                  }}
                >
                  {" "}
                  {option.label}{" "}
                </Typography>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Enter member name"
                //label="Add Member"
                sx={{
                  "& .MuiInputBase-input": {
                    padding: "0 !important",
                  },
                }}
              />
            )}
          />
          <Button
            disabled={handleBtn ? true : false}
            variant="contained"
            onClick={() => {
              handleAddAdmin(userId, editGroupInformation?.uuid);
            }}
            className="cursor-pointer"
            sx={{
              backgroundColor: Colors.blue,
              padding: "8px 10px",
              borderRadius: "12px",
              display: "flex",
              columnGap: "6px",
              alignItems: "center",
              justifyContent: "center",
              textTransform: "capitalize",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: Colors.black,
                fontWeight: "500",
                letterSpacing: 0.8,
                fontSize: "16px",
              }}
            >
              Add
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default AddAdmin;
