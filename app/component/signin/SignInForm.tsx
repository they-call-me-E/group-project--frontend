"use client";
import React, { useState } from "react";
import Grid from "@mui/material/Grid2";
import { TextField, Box, Button, Typography } from "@mui/material";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Colors } from "../../theme/colors";
import Link from "next/link";
import AlertMessage from "../message/AlertMessage";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface FormValues {
  email: string;
  password: string;
}

const SignInForm = ({
  setForgotPasswordModal,
}: {
  setForgotPasswordModal: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSuccessClose = () => {
    setSuccess(false);
  };
  const handleErrorClose = () => {
    setError(false);
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    }),
    onSubmit: async (
      values: FormValues,
      { resetForm }: FormikHelpers<FormValues>
    ) => {
      try {
        setLoading(true);
        const response = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
        });

        if (response?.ok) {
          setSuccess(true);
          resetForm();
          router.push("/map");
        } else {
          throw new Error("Invalid email or password");
        }
      } catch (error) {
        // @ts-ignore
        if (error?.message) {
          setError(true);
          // @ts-ignore
          setErrorMsg(error?.message);
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

          <Button
            onClick={() => setForgotPasswordModal(true)}
            type="button"
            variant="contained"
            sx={{
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "transparent",
              },
              textTransform: "none",
              color: Colors.white,
              opacity: 0.8,
              justifyContent: "end",
              marginBottom: "8px",
            }}
            fullWidth
          >
            Forgot password?
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
            Sign in
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
            Don't have an account?{" "}
            <Link
              href="/signup"
              className={` text-[#47E9FF] capitalize hover:bg-transparent hover:text[#33C8E5] text-[14px]`}
            >
              Sign up
            </Link>
          </Typography>
        </form>
      </Grid>
      <AlertMessage
        open={success}
        onClose={handleSuccessClose}
        message="Signup successful!"
        severity="success"
      />
      <AlertMessage
        open={error}
        onClose={handleErrorClose}
        message={errorMsg}
        severity="error"
      />
    </>
  );
};

export default SignInForm;
