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
  name: string;
}

const CreateGroup = ({
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
  const { createGroupModalFormHide, handleHide: userActionHandleHide } =
    useUserActionOpenContext();

  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Group Name is required"),
    }),
    onSubmit: async (
      values: FormValues,
      { resetForm }: FormikHelpers<FormValues>
    ) => {
      try {
        const response = await axios.post(
          // @ts-ignore
          `${process.env.NEXT_PUBLIC_API_URL}/groups/create`,
          {
            name: values.name,
          },
          {
            headers: {
              "Content-Type": "application/json",
              // @ts-ignore
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        );

        if (response?.data?.document) {
          setSuccess(true);
          createGroupModalFormHide();
          userActionHandleHide();
          reFetchGroupListData();
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <Grid
        onClick={() => {
          createGroupModalFormHide();
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
      <Grid
        sx={{
          zIndex: 1000,
          position: "absolute",
          top: "50%",
          left: moveCreateGroupForm ? "360px" : "50%",
          transform: moveCreateGroupForm
            ? "translate(0, -50%)"
            : "translate(-50%, -50%)",
          backgroundColor: Colors.black,
          width: "400px",
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
          onClick={() => createGroupModalFormHide()}
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
          Create Group
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
                Group Name
              </Typography>

              <TextField
                fullWidth
                placeholder="Group Name"
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
                    backgroundColor: "transparent",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "transparent",
                  },
                }}
              />
            </Box>
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

export default CreateGroup;
