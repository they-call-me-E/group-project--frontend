"use client";

import Grid from "@mui/material/Grid2";
import { Colors } from "./../../theme/colors";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { TextField, Box, Button, Typography } from "@mui/material";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useUserActionOpenContext } from "../../context/map/UserActionContext";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface FormValues {
  invite_code: string;
}

const JoinGroup = ({
  moveCreateGroupForm,
  setSuccess,
  reFetchGroupListData,
}: {
  moveCreateGroupForm: any;
  setSuccess: React.Dispatch<React.SetStateAction<any>>;
  reFetchGroupListData: () => void;
}) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { handleHide: userActionHandleHide, handleJoinGroupModalHide } =
    useUserActionOpenContext();
  const [mobileDeviceModal, setMobileDeviceModal] = useState(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      invite_code: "",
    },
    validationSchema: Yup.object({
      invite_code: Yup.string().required("Invite code is required"),
    }),
    onSubmit: async (
      values: FormValues,
      { resetForm }: FormikHelpers<FormValues>
    ) => {
      try {
        const response = await axios.post(
          // @ts-ignore
          `${process.env.NEXT_PUBLIC_API_URL}/groups/invite/join`,
          {
            invite_code: values.invite_code,
          },
          {
            headers: {
              "Content-Type": "application/json",
              // @ts-ignore
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        );

        setSuccess(true);
        handleJoinGroupModalHide();
        userActionHandleHide();
        reFetchGroupListData();
      } catch (error: any) {
        setErrorMsg(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <Grid
        onClick={() => {
          handleJoinGroupModalHide();
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
      {/* Mobile device grid */}
      <Grid
        onClick={() => {
          handleJoinGroupModalHide();
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
          width: {
            xs: "80%",
            sm: "400px",
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
          onClick={() => handleJoinGroupModalHide()}
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
          Join Group
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid>
            {/* Name */}
            <Box mb={2}>
              <Typography
                variant="body1"
                sx={{
                  color: Colors.white,
                  fontWeight: "300",
                  letterSpacing: 0.8,
                  textAlign: "start",
                  fontSize: "14px",
                }}
                mb={1}
              >
                Invite Code
              </Typography>

              <TextField
                fullWidth
                placeholder="Invite Code"
                name="invite_code"
                value={formik.values.invite_code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.invite_code &&
                  Boolean(formik.errors.invite_code)
                }
                helperText={
                  formik.touched.invite_code && formik.errors.invite_code
                }
                sx={{
                  "& .MuiInputBase-input": {
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    backgroundColor: "transparent",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "transparent",
                  },
                }}
              />
            </Box>
            {errorMsg ? (
              <Typography
                variant="body1"
                sx={{
                  color: Colors.red,
                  fontWeight: "400",
                  letterSpacing: 0.8,
                  textAlign: "start",
                  fontSize: "14px",
                }}
                mb={1}
              >
                {errorMsg}
              </Typography>
            ) : (
              ""
            )}
          </Grid>
          <Button
            disabled={loading}
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: Colors.blue,
              "&:hover": {
                backgroundColor: Colors.lightBlue,
              },
            }}
            fullWidth
          >
            Submit
          </Button>
        </form>
      </Grid>
    </>
  );
};

export default JoinGroup;
