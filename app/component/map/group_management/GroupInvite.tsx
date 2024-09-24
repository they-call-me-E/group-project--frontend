"use client";
import { Colors } from "@/app/theme/colors";
import Grid from "@mui/material/Grid2";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { TextField, Box, Button, Typography } from "@mui/material";
import { IoCopyOutline } from "react-icons/io5";
import Tooltip from "@mui/material/Tooltip";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface FormValues {
  name: string;
}
const GroupInvite = ({
  setOpenViewGroupModal,
  inviteCode,
  openGroupInviteModal,
  setOpenGroupInviteModal,
  editGroupInformation,
  reFetchGroupListData,
}: {
  setOpenViewGroupModal: React.Dispatch<React.SetStateAction<any>>;
  inviteCode: string;
  openGroupInviteModal: boolean;
  setOpenGroupInviteModal: React.Dispatch<React.SetStateAction<any>>;
  editGroupInformation: any;
  reFetchGroupListData: () => void;
}) => {
  const { data: session, status }: { data: any; status: string } = useSession();
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(inviteCode)
      .then(() => {
        setCopySuccess(true);
      })
      .catch((err) => {
        setCopySuccess(false);
      });
  };

  return (
    <>
      <Grid
        onClick={() => {
          setOpenGroupInviteModal(false);
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
          left: "360px",
          transform: "translate(0, -50%)",
          width: "400px",
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
            setOpenGroupInviteModal(false);
            setOpenViewGroupModal(true);
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
          Invite Code
        </Typography>
        <Box sx={{ position: "relative" }}>
          <TextField
            disabled={true}
            fullWidth
            placeholder=""
            name="inviteCode"
            value={inviteCode}
            sx={{
              "& .MuiInputBase-input": {
                paddingTop: "8px",
                paddingBottom: "8px",
                backgroundColor: copySuccess ? "#000000c4" : "transparent",
              },
              "&.Mui-focused": {
                backgroundColor: "transparent",
              },
            }}
          />
          <Tooltip title="Copy">
            <Button
              onClick={copyToClipboard}
              sx={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translate(0, -50%)",
                padding: "0px",
                minWidth: "1px",
                backgroundColor: "transparent",
              }}
              variant="contained"
            >
              <IoCopyOutline className="text-[#fff] text-[20px]" />
            </Button>
          </Tooltip>
        </Box>
        <Typography
          variant="body1"
          sx={{
            color: Colors.red,
            letterSpacing: 0.8,
            textAlign: "left",
            padding: "3px 0",
            fontWeight: "bold",
          }}
          mb={1}
          mt={1}
        >
          It is valid for 3 minutes
        </Typography>
      </Grid>
    </>
  );
};

export default GroupInvite;
