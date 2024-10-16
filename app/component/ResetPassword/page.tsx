"use client";

import Grid from "@mui/material/Grid2";
import { Colors } from "./../../theme/colors";
import React, { useState } from "react";
import axios from "axios";
import { TextField, Box, Button, Typography } from "@mui/material";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FormValues {
  password: string;
  passwordConfirm: string;
}

const ResetPassword = ({
  checkSuccessStatus,
  token,
  setCheckSuccessStatus,
  setCheckErrorStatus,
}: {
  checkSuccessStatus: any;
  token: any;
  setCheckSuccessStatus: React.Dispatch<React.SetStateAction<any>>;
  setCheckErrorStatus: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [displaySignInButton, setDisplaySignInButton] = useState(false);
  const router = useRouter();

  const formik = useFormik<FormValues>({
    initialValues: {
      password: "",
      passwordConfirm: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      passwordConfirm: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password")], "Passwords must match"),
    }),
    onSubmit: async (
      values: FormValues,
      { resetForm }: FormikHelpers<FormValues>
    ) => {
      try {
        setLoading(true);
        const response = await axios.patch(
          // @ts-ignore
          `${process.env.NEXT_PUBLIC_API_URL}/users/resetPassword/${token}`,
          {
            password: values.password,
            passwordConfirm: values.passwordConfirm,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response?.data?.user) {
          setDisplaySignInButton(true);
          setCheckSuccessStatus(true);
          resetForm();
        }
      } catch (error: any) {
        if (error?.response?.data?.message) {
          setCheckErrorStatus(true);
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <Grid
        onClick={() => {}}
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
          Reset your password
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: Colors.white,
            padding: "3px 0",
            marginBottom: "24px",
            opacity: 0.8,
          }}
          mb={3}
        >
          Please enter your new password.
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid>
            <Box mb={2}>
              <Typography
                variant="body1"
                sx={{
                  color: Colors.white,
                  fontWeight: "300",
                  letterSpacing: 0.8,
                  textAlign: "start",
                }}
                mb={1}
              >
                Password
              </Typography>
              <TextField
                fullWidth
                placeholder="Password"
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                sx={{
                  "& .MuiInputBase-input": {
                    paddingTop: "8px",
                    paddingBottom: "8px",
                  },
                }}
              />
            </Box>
            <Box mb={2}>
              <Typography
                variant="body1"
                sx={{
                  color: Colors.white,
                  fontWeight: "300",
                  letterSpacing: 0.8,
                  textAlign: "start",
                }}
                mb={1}
              >
                Confirm Password
              </Typography>
              <TextField
                fullWidth
                placeholder="Confirm Password"
                type="password"
                name="passwordConfirm"
                value={formik.values.passwordConfirm}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.passwordConfirm &&
                  Boolean(formik.errors.passwordConfirm)
                }
                helperText={
                  formik.touched.passwordConfirm &&
                  formik.errors.passwordConfirm
                }
                sx={{
                  "& .MuiInputBase-input": {
                    paddingTop: "8px",
                    paddingBottom: "8px",
                  },
                }}
              />
            </Box>
          </Grid>

          {displaySignInButton ? (
            <Grid sx={{ marginBottom: "8px", textAlign: "right" }}>
              <Link
                href="/"
                className="text-[#fff] text-[14px] font-normal opacity-80"
              >
                {" "}
                Sign in
              </Link>
            </Grid>
          ) : (
            ""
          )}

          <Grid sx={{ display: "flex", gap: "6px" }}>
            <Button
              onClick={() => {
                router.push("/");
              }}
              type="button"
              variant="contained"
              sx={{
                backgroundColor: Colors.blue,
                "&:hover": {
                  backgroundColor: Colors.lightBlue,
                },
              }}
              fullWidth
            >
              Back
            </Button>

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
          </Grid>
        </form>
      </Grid>
    </>
  );
};

export default ResetPassword;
