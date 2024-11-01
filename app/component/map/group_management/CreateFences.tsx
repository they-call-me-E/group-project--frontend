import { Colors } from "@/app/theme/colors";
import Grid from "@mui/material/Grid2";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { TextField, Box, Button, Typography, Slider } from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import mapboxgl from "mapbox-gl";
import { useUserActionOpenContext } from "../../../context/map/UserActionContext";

interface FormValues {
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  radius: number | null;
}

const CreateFences = ({
  updateFencesNewMarker,
  fencesLng,
  setFencesLng,
  fencesLat,
  setFencesLat,
  fencesAddress,
  setFencesAddress,
  clearCreateFencesNewMarker,
  mapMain,
  setOpenViewGroupModal,
  setOpenFencesManagementModal,
  setOpenCreateFencesModal,
  editGroupInformation,
  setCreateFencesSuccess,
  setCreateFenceserror,
  setCreateFencesErrorMsg,
}: // reFetchGroupListData,
{
  updateFencesNewMarker: (
    placesData: any,
    mapInstance: mapboxgl.Map,
    radiusValue: number
  ) => any;
  clearCreateFencesNewMarker: () => void;
  fencesLng: any;
  setFencesLng: React.Dispatch<React.SetStateAction<any>>;
  fencesLat: any;
  setFencesLat: React.Dispatch<React.SetStateAction<any>>;
  fencesAddress: string;
  setFencesAddress: React.Dispatch<React.SetStateAction<string>>;
  mapMain: mapboxgl.Map | null;
  setOpenViewGroupModal: React.Dispatch<React.SetStateAction<any>>;
  setOpenFencesManagementModal: React.Dispatch<React.SetStateAction<any>>;
  setOpenCreateFencesModal: React.Dispatch<React.SetStateAction<any>>;
  editGroupInformation: any;
  setCreateFencesSuccess: React.Dispatch<React.SetStateAction<any>>;
  setCreateFenceserror: React.Dispatch<React.SetStateAction<any>>;
  setCreateFencesErrorMsg: React.Dispatch<React.SetStateAction<any>>;
  // reFetchGroupListData: () => void;
}) => {
  const { handleGroupModalReset } = useUserActionOpenContext();
  const [radiusValue, setRadiusValue] = useState<any>(null);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [radisuRange, setRadiusRange] = useState([0, 400]);
  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      address: fencesAddress ? fencesAddress : "",
      latitude: fencesLat ? fencesLat : null,
      longitude: fencesLng ? fencesLng : null,
      radius: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Fences Name is required"),
      address: Yup.string(),
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
        if (
          (values?.latitude && !values?.longitude) ||
          (values?.longitude && !values?.latitude)
        ) {
          setCreateFenceserror(true);
          setCreateFencesErrorMsg(
            "Both latitude and longitude must be selected. Please ensure that both fields are filled in"
          );
          return;
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
          // setOpenFencesManagementModal(true);
          clearCreateFencesNewMarker();
          handleGroupModalReset();
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

  useEffect(() => {
    formik.setFieldValue("address", fencesAddress);
    formik.setFieldValue("latitude", fencesLat);
    formik.setFieldValue("longitude", fencesLng);
    formik.setFieldValue("radius", radiusValue);
  }, [fencesAddress, fencesLat, fencesLng, radiusValue]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    const rangeValue = newValue as number[];
    setRadiusValue(rangeValue[0]);
    setRadiusRange(rangeValue);
    if (fencesLat && fencesLng) {
      updateFencesNewMarker(
        { latitude: fencesLat, longitude: fencesLng },
        // @ts-ignore
        mapMain,
        rangeValue[0]
      );
    }
  };

  return (
    <>
      <Grid
        sx={{
          zIndex: 1000,
          position: "absolute",
          top: 0,
          left: 0,
          transform: "translate(0, 0)",
          width: {
            xs: "40%",
            sm: "350px",
          },
          height: "100dvh",
          backgroundColor: Colors.black,
          padding: "20px 20px",
          borderRadius: 0,
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="close"
          onClick={() => {
            clearCreateFencesNewMarker();
            setOpenCreateFencesModal(false);
            handleGroupModalReset();
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
            {/* address */}
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
                Address
              </Typography>

              <TextField
                fullWidth
                placeholder="Address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
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
                disabled={true}
                type="number"
                fullWidth
                placeholder="Latitude"
                name="latitude"
                value={formik.values.latitude}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const value = event.target.value;
                  formik.handleChange(event); // Update Formik state
                  setFencesLat(value ? parseFloat(value) : null); // Update local state
                }}
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
                disabled={true}
                type="number"
                fullWidth
                placeholder="Longitude"
                name="longitude"
                value={formik.values.longitude}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const value = event.target.value;
                  formik.handleChange(event); // Update Formik state
                  setFencesLng(value ? parseFloat(value) : null); // Update local state
                }}
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
                disabled={true}
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

          <Box sx={{ width: 300, padding: 2 }}>
            <Slider
              value={radisuRange}
              onChange={handleChange}
              valueLabelDisplay="auto"
              min={0}
              max={400}
              marks={[
                { value: 0, label: "0" },
                { value: 400, label: "400" },
              ]}
              sx={{
                color: "primary.main",
                "& .MuiSlider-thumb": {
                  backgroundColor: Colors.blue,
                  border: "2px solid currentColor",
                },
                "& .MuiSlider-track": {
                  backgroundColor: Colors.blue,
                },
                "& .MuiSlider-rail": {
                  backgroundColor: Colors.blue,
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
            Save
          </Button>
        </form>

        {/* updated code end */}
      </Grid>
    </>
  );
};

export default CreateFences;
