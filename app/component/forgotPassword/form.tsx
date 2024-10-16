"use client";

import Grid from "@mui/material/Grid2";
import { Colors } from "../../theme/colors";
import React, { useState } from "react";
import axios from "axios";
import { TextField, Box, Button, Typography } from "@mui/material";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface FormValues {
  email: string;
}

interface ForgotPasswordProps {
  setCheckErrorStatus: (value: boolean) => void;
  setForgotPasswordModal: (value: boolean) => void;
  setErrorMsg: (value: string) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  setCheckErrorStatus,
  setForgotPasswordModal,
  setErrorMsg,
}) => {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    }),
    onSubmit: async (
      values: FormValues,
      { resetForm }: FormikHelpers<FormValues>
    ) => {
      try {
        setLoading(true);
        const response = await axios.post(
          // @ts-ignore
          `${process.env.NEXT_PUBLIC_API_URL}/users/forgotPassword`,
          {
            email: values.email,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response?.data?.status === "succes") {
          setStatusMessage(true);
          resetForm();
        }
      } catch (error: any) {
        if (error?.response?.data?.message) {
          setErrorMsg(error?.response?.data?.message);
        } else {
          setErrorMsg("Something went wrong!");
        }
        setCheckErrorStatus(true);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <Grid
        onClick={() => {
          // createGroupModalFormHide();
        }}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 100,
          backgroundColor: "transparent",
          opacity: 0.5,
        }}
      ></Grid>
      <Grid
        sx={{
          zIndex: 1000,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: Colors.black,
          width: "350px",
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
          onClick={() => setForgotPasswordModal(false)}
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
          Forgot your password?
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: Colors.white,
            padding: "3px 0",
            marginBottom: "88px",
            opacity: 0.8,
          }}
          mb={11}
        >
          Please enter the account for which you want to reset the password.
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
                Email
              </Typography>

              <TextField
                fullWidth
                placeholder="Please enter your email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
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
            {statusMessage ? (
              <Typography
                variant="body1"
                sx={{
                  color: Colors.red,
                  padding: "3px 0",
                  marginBottom: "8px",
                  opacity: 0.8,
                  fontSize: "14px",
                  fontWeight: 700,
                }}
                mb={1}
              >
                Please check your email. A verification token has been sent.
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
            Confirm
          </Button>
        </form>
      </Grid>
    </>
  );
};

export default ForgotPassword;
