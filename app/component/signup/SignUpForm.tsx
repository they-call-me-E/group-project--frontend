"use client";
import React, { useState } from "react";
import Grid from "@mui/material/Grid2";
import { TextField, Box, Button, Typography } from "@mui/material";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Colors } from "../../theme/colors";
import Link from "next/link";
import AlertMessage from "../message/AlertMessage";
import axios from "axios";

interface FormValues {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const SignUpForm = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    setSuccess(false);
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
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

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/users/signup`,
          {
            name: values.name,
            email: values.email,
            password: values.password,
            passwordConfirm: values.passwordConfirm,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setSuccess(true);
        resetForm();
      } catch (error) {
        // @ts-ignore
        if (error?.response?.data?.message) {
          setError(true);
          // @ts-ignore
          setErrorMsg(error?.response?.data?.message);
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <Grid
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: Colors.black,
          width: "350px",
          padding: "20px 20px",
          borderRadius: "8px",
          // margin: "40px auto",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: Colors.white,
            letterSpacing: 0.8,
            textAlign: "center",
            padding: "3px 0",
            fontWeight: "bold",
            marginBottom: "8px",
            opacity: 0.8,
          }}
          mb={1}
        >
          Sign up or log in to continue
        </Typography>
        <form onSubmit={formik.handleSubmit}>
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
              Name
            </Typography>

            <TextField
              fullWidth
              placeholder="Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
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
              Email
            </Typography>

            <TextField
              fullWidth
              placeholder="Email"
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
              error={formik.touched.password && Boolean(formik.errors.password)}
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
                formik.touched.passwordConfirm && formik.errors.passwordConfirm
              }
              sx={{
                "& .MuiInputBase-input": {
                  paddingTop: "8px",
                  paddingBottom: "8px",
                },
              }}
            />
          </Box>

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
            Sign Up
          </Button>

          <Typography
            variant="body1"
            sx={{
              color: Colors.white,
              fontWeight: "300",
              letterSpacing: 0.8,
              textAlign: "center",
              marginTop: "16px",
            }}
          >
            Already have an account?{" "}
            <Link
              href="/"
              className={` text-[#47E9FF] capitalize hover:bg-transparent hover:text-[#33C8E5] text-[14px]`}
            >
              Sign in
            </Link>
          </Typography>
        </form>
      </Grid>
      <AlertMessage
        open={success}
        onClose={handleClose}
        message="Signup successful!"
        severity="success"
      />
      <AlertMessage
        open={error}
        onClose={handleClose}
        message={errorMsg}
        severity="error"
      />
    </>
  );
};

export default SignUpForm;
