"use client";

import Grid from "@mui/material/Grid2";
import { Colors } from "./../../theme/colors";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { io } from "socket.io-client";

import {
  TextField,
  Box,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useUserActionOpenContext } from "../../context/map/UserActionContext";
import { useGroupSelectionContext } from "../../context/map/GroupSelectionContext";

interface FormValues {
  latitude: number | null;
  longitude: number | null;
  location_sharing: boolean;
  isMoving: boolean;
  speed: number | null;
  battery_level: number | null;
  screen: boolean;
  wifi: boolean;
  charging: boolean;
  address: string;
}

// Establish Socket.IO connection

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

const LocationWithStatus = ({
  usersMenuDataList,
  moveLocationWithStatusForm,
  handleUserInformation,
  userInformationData,
  setUserInformationData,
  setSuccess,
}: {
  usersMenuDataList: (group_id: string) => void;
  moveLocationWithStatusForm: boolean;
  handleUserInformation: (token: string, user_id: string) => void;
  userInformationData: any;
  setUserInformationData: React.Dispatch<React.SetStateAction<any>>;
  setSuccess: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const { groupId } = useGroupSelectionContext();
  const { data: session, status }: { data: any; status: any } = useSession();
  const [loading, setLoading] = useState(false);
  const { locationWithStatusModalFormHide, handleHide: userActionHandleHide } =
    useUserActionOpenContext();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mobileDeviceModal, setMobileDeviceModal] = useState(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      latitude: userInformationData?.location?.latitude
        ? userInformationData?.location?.latitude
        : null,
      longitude: userInformationData?.location?.longitude
        ? userInformationData?.location?.longitude
        : null,
      address: userInformationData?.location?.address
        ? userInformationData?.location?.address
        : "",
      location_sharing: userInformationData?.status?.location_sharing
        ? userInformationData?.status?.location_sharing
        : false,
      isMoving: userInformationData?.status?.isMoving
        ? userInformationData?.status?.isMoving
        : false,
      speed: userInformationData?.status?.speed
        ? userInformationData?.status?.speed
        : null,
      battery_level: userInformationData?.status?.device?.battery_level
        ? userInformationData?.status?.device?.battery_level
        : null,
      screen: userInformationData?.status?.device?.screen
        ? userInformationData?.status?.device?.screen
        : false,
      wifi: userInformationData?.status?.device?.wifi
        ? userInformationData?.status?.device?.wifi
        : false,
      charging: userInformationData?.status?.device?.charging
        ? userInformationData?.status?.device?.charging
        : false,
    },
    validationSchema: Yup.object({
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
      speed: Yup.number()
        .typeError("Must be a number")
        .nullable()
        .notRequired(),
      battery_level: Yup.number()
        .typeError("Must be a number")
        .nullable()
        .notRequired(),
    }),
    onSubmit: async (
      values: FormValues,
      { resetForm }: FormikHelpers<FormValues>
    ) => {
      try {
        let location: any = {};
        let status: any = {};
        let device: any = {};
        setLoading(true);
        const formData = new FormData();

        if (values.latitude) {
          location["latitude"] = values.latitude;
        }
        if (values.longitude) {
          location["longitude"] = values.longitude;
        }
        if (values.address) {
          location["address"] = values.address;
        }
        if (values.location_sharing) {
          status["location_sharing"] = values.location_sharing;
        }
        if (values.isMoving) {
          status["isMoving"] = values.isMoving;
        }
        if (values.speed) {
          status["speed"] = values.speed;
        }
        if (values.battery_level) {
          device["battery_level"] = values.battery_level;
        }
        if (values.screen) {
          device["screen"] = values.screen;
        }
        if (values.wifi) {
          device["wifi"] = values.wifi;
        }
        if (values.charging) {
          device["charging"] = values.charging;
        }
        // update status object
        status = {
          ...status,
          device: {
            ...device,
          },
        };
        const response = await axios.patch(
          // @ts-ignore
          `${process.env.NEXT_PUBLIC_API_URL}/location_with_status/${session?.user?.id}`,
          {
            location: location,
            status: status,
          },
          {
            headers: {
              "Content-Type": "application/json",
              // @ts-ignore
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        );

        if (response?.data?.user) {
          setSuccess(true);
          await usersMenuDataList(groupId);
          // resetForm();
          // @ts-ignore
          const res: any = await handleUserInformation(
            session?.user?.token,
            session?.user?.id
          );

          if (res?.data?.user) {
            setUserInformationData(res?.data?.user);
          }
          locationWithStatusModalFormHide();
          userActionHandleHide();

          // setUserInformationData
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
          locationWithStatusModalFormHide();
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
          locationWithStatusModalFormHide();
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
            md: moveLocationWithStatusForm ? "360px" : "50%",
          },
          transform: {
            xs: "translate(-50%, -50%)",
            md: moveLocationWithStatusForm
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
          onClick={() => locationWithStatusModalFormHide()}
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
          Location/Status
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid>
            <Grid>
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
                  helperText={
                    formik.touched.longitude && formik.errors.longitude
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
              {/* Speed */}
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
                  Speed
                </Typography>

                <TextField
                  type="number"
                  fullWidth
                  placeholder="Speed"
                  name="speed"
                  value={formik.values.speed}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.speed && Boolean(formik.errors.speed)}
                  helperText={formik.touched.speed && formik.errors.speed}
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
              {/* Battery level */}
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
                  Battery Level
                </Typography>

                <TextField
                  type="number"
                  fullWidth
                  placeholder="Battery Level"
                  name="battery_level"
                  value={formik.values.battery_level}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.battery_level &&
                    Boolean(formik.errors.battery_level)
                  }
                  helperText={
                    formik.touched.battery_level && formik.errors.battery_level
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
              {/*  address */}
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
                  error={
                    formik.touched.address && Boolean(formik.errors.address)
                  }
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
            </Grid>
            {/* <Grid sx={{ flexBasis: "42%", flexGrow: 1 }}>
            
              <Box mb={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="location_sharing"
                      name="location_sharing"
                      color="primary"
                      checked={formik.values.location_sharing}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  }
                  label="I agree to share my location with this application."
                  sx={{
                    color: Colors.white,
                    fontWeight: "300",
                    letterSpacing: 0.8,
                  }}
                />
              </Box>
            
              <Box mb={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="isMoving"
                      name="isMoving"
                      color="primary"
                      checked={formik.values.isMoving}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  }
                  label="I confirm that I am currently moving"
                  sx={{
                    color: Colors.white,
                    fontWeight: "300",
                    letterSpacing: 0.8,
                  }}
                />
              </Box>
            
              <Box mb={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="screen"
                      name="screen"
                      color="primary"
                      checked={formik.values.screen}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  }
                  label="I agree to share my screen with this application"
                  sx={{
                    color: Colors.white,
                    fontWeight: "300",
                    letterSpacing: 0.8,
                  }}
                />
              </Box>
           
              <Box mb={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="wifi"
                      name="wifi"
                      color="primary"
                      checked={formik.values.wifi}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  }
                  label="I agree to connect to the available WiFi network"
                  sx={{
                    color: Colors.white,
                    fontWeight: "300",
                    letterSpacing: 0.8,
                  }}
                />
              </Box>
           
              <Box mb={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="charging"
                      name="charging"
                      color="primary"
                      checked={formik.values.charging}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  }
                  label="I agree to use the charging station provided by this facility"
                  sx={{
                    color: Colors.white,
                    fontWeight: "300",
                    letterSpacing: 0.8,
                  }}
                />
              </Box>
            </Grid> */}
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

export default LocationWithStatus;
