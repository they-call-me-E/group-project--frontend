import { Colors } from "@/app/theme/colors";
import Grid from "@mui/material/Grid2";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from "axios";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { TextField, Box, Button, Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface FormValues {
  name: string;
  latitude: number | null;
  longitude: number | null;
  radius: number | null;
}

const CreateFences = ({
  setOpenViewGroupModal,
  setOpenFencesManagementModal,
  setOpenCreateFencesModal,
  editGroupInformation,
  setCreateFencesSuccess,
  setCreateFenceserror,
  setCreateFencesErrorMsg,
}: // reFetchGroupListData,
{
  setOpenViewGroupModal: React.Dispatch<React.SetStateAction<any>>;
  setOpenFencesManagementModal: React.Dispatch<React.SetStateAction<any>>;
  setOpenCreateFencesModal: React.Dispatch<React.SetStateAction<any>>;
  editGroupInformation: any;
  setCreateFencesSuccess: React.Dispatch<React.SetStateAction<any>>;
  setCreateFenceserror: React.Dispatch<React.SetStateAction<any>>;
  setCreateFencesErrorMsg: React.Dispatch<React.SetStateAction<any>>;
  // reFetchGroupListData: () => void;
}) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      latitude: null,
      longitude: null,
      radius: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Fences Name is required"),
      latitude: Yup.number()
        .typeError("Must be a number")
        .min(-90, "Latitude must be between -90 and 90")
        .max(90, "Latitude must be between -90 and 90")
        .nullable()
        .notRequired(),
      longitude: Yup.number()
        .typeError("Must be a number")
        .min(-180, "Longitude must be between -180 and 180")
        .max(180, "Longitude must be between -180 and 180")
        .nullable()
        .notRequired(),
    }),
    onSubmit: async (
      values: FormValues,
      { resetForm }: FormikHelpers<FormValues>
    ) => {
      try {
        let reqBody: any = {};
        if (values?.latitude) {
          reqBody["latitude"] = values.latitude;
        }
        if (values?.longitude) {
          reqBody["longitude"] = values.longitude;
        }
        if (values?.radius) {
          reqBody["radius"] = values.radius;
        }
        const response = await axios.post(
          // @ts-ignore
          `${process.env.NEXT_PUBLIC_API_URL}/group/${editGroupInformation?.uuid}/fences/create`,
          {
            name: values.name,
            ...reqBody,
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
          setOpenCreateFencesModal(false);
          setCreateFencesSuccess(true);
          setOpenFencesManagementModal(true);
          // reFetchGroupListData();
        }
      } catch (error: any) {
        if (error?.response?.data?.message) {
          setCreateFenceserror(true);
          setCreateFencesErrorMsg(error?.response?.data?.message);
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <Grid
        onClick={() => {
          setOpenCreateFencesModal(false);
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
            setOpenViewGroupModal(true);
            setOpenCreateFencesModal(false);
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
          Create Fences
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
                Fences Name
              </Typography>

              <TextField
                fullWidth
                placeholder="Fences Name"
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
            {/* Latitude */}
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
                Latitude
              </Typography>

              <TextField
                type="number"
                fullWidth
                placeholder="Latitude"
                name="latitude"
                value={formik.values.latitude}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.latitude && Boolean(formik.errors.latitude)
                }
                helperText={formik.touched.latitude && formik.errors.latitude}
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
            {/* Longitude */}
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
                Longitude
              </Typography>

              <TextField
                type="number"
                fullWidth
                placeholder="Longitude"
                name="longitude"
                value={formik.values.longitude}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.longitude && Boolean(formik.errors.longitude)
                }
                helperText={formik.touched.longitude && formik.errors.longitude}
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
            {/* Radius */}
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
                Radius
              </Typography>

              <TextField
                type="number"
                fullWidth
                placeholder="Radius"
                name="radius"
                value={formik.values.radius}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.radius && Boolean(formik.errors.radius)}
                helperText={formik.touched.radius && formik.errors.radius}
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
        {/* updated code end */}
      </Grid>
    </>
  );
};

export default CreateFences;
