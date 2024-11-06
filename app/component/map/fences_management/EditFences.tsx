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
import { IoSearchSharp } from "react-icons/io5";
import { usePlacesMenuListOpenContext } from "../../../context/map/PlacesMenuListContext";
import { useUserActionOpenContext } from "../../../context/map/UserActionContext";
import { getCoordinatesFromAddress } from "./../../../utils/getCoordinatesFromAddress";

interface FormValues {
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  radius: number | null;
}

const EditFences = ({
  mapMain,
  editFencesNewCircle,
  fencesLng,
  setFencesLng,
  fencesLat,
  setFencesLat,
  fencesAddress,
  setFencesAddress,
  editFencesMapCircleRef,
  setOpenViewFencesModal,
  setOpenFencesManagementModal,
  setOpenEditFencesModal,
  editGroupInformation,
  setEditFencesSuccess,
  setEditFenceserror,
  setEditFencesErrorMsg,
  singleFences,
}: // reFetchGroupListData,
{
  mapMain: mapboxgl.Map | null;
  editFencesNewCircle: (
    placesData: any,
    mapInstance: mapboxgl.Map,
    radiusValue: number
  ) => any;
  fencesLng: any;
  setFencesLng: React.Dispatch<React.SetStateAction<any>>;
  fencesLat: any;
  setFencesLat: React.Dispatch<React.SetStateAction<any>>;
  fencesAddress: string;
  setFencesAddress: React.Dispatch<React.SetStateAction<string>>;
  editFencesMapCircleRef: React.RefObject<HTMLDivElement>;
  setOpenViewFencesModal: React.Dispatch<React.SetStateAction<any>>;
  setOpenFencesManagementModal: React.Dispatch<React.SetStateAction<any>>;
  setOpenEditFencesModal: React.Dispatch<React.SetStateAction<any>>;
  editGroupInformation: any;
  setEditFencesSuccess: React.Dispatch<React.SetStateAction<any>>;
  setEditFenceserror: React.Dispatch<React.SetStateAction<any>>;
  setEditFencesErrorMsg: React.Dispatch<React.SetStateAction<any>>;
  singleFences: any;
  // reFetchGroupListData: () => void;
}) => {
  const [radiusValue, setRadiusValue] = useState<any>(null);
  const { handleGroupModalReset } = useUserActionOpenContext();
  const { refetchDataOnMap, setRefetchDataOnMap } =
    usePlacesMenuListOpenContext();
  const [radisuRange, setRadiusRange] = useState([0, 400]);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const formik = useFormik<FormValues>({
    initialValues: {
      name: singleFences?.name || "",
      address: "",
      latitude: singleFences?.latitude || null,
      longitude: singleFences?.longitude || null,
      radius: singleFences?.radius || null,
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
        const response = await axios.patch(
          // @ts-ignore
          `${process.env.NEXT_PUBLIC_API_URL}/group/${editGroupInformation?.uuid}/fences/${singleFences?.uuid}/update`,
          {
            name: values.name,
            latitude: values.latitude,
            longitude: values.longitude,
            radius: values.radius,
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
          // setOpenFencesManagementModal(true);
          // setOpenEditFencesModal(false);
          setEditFencesSuccess(true);
          // reFetchGroupListData();

          setOpenEditFencesModal(false);
          setRefetchDataOnMap(!refetchDataOnMap);
          handleGroupModalReset();
        }
      } catch (error: any) {
        if (error?.response?.data?.message) {
          setEditFenceserror(true);
          setEditFencesErrorMsg(error?.response?.data?.message);
        }
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (fencesAddress) {
      formik.setFieldValue("address", fencesAddress);
    }
    if (fencesLat) {
      formik.setFieldValue("latitude", fencesLat);
    }
    if (fencesLng) {
      formik.setFieldValue("longitude", fencesLng);
    }
    if (radiusValue) {
      formik.setFieldValue("radius", radiusValue);
    }

    if (fencesLat && fencesLng) {
      editFencesNewCircle(
        { latitude: fencesLat, longitude: fencesLng },
        // @ts-ignore
        mapMain,
        radiusValue
      );
    } else if (
      (singleFences?.latitude && singleFences?.longitude) ||
      radiusValue
    ) {
      flytoLocation(singleFences?.longitude, singleFences?.latitude);
      editFencesNewCircle(
        {
          latitude: singleFences?.latitude,
          longitude: singleFences?.longitude,
        },
        // @ts-ignore
        mapMain,
        radiusValue ? radiusValue : singleFences?.radius
      );
    }
  }, [fencesAddress, fencesLat, fencesLng, radiusValue]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    const rangeValue = newValue as number[];
    setRadiusValue(rangeValue[0]);
    setRadiusRange(rangeValue);
    // if (fencesLat && fencesLng) {
    //   editFencesNewCircle(
    //     { latitude: fencesLat, longitude: fencesLng },
    //     // @ts-ignore
    //     mapMain,
    //     rangeValue[0]
    //   );
    // } else if (singleFences?.latitude && singleFences?.longitude) {
    //   editFencesNewCircle(
    //     {
    //       latitude: singleFences?.latitude,
    //       longitude: singleFences?.longitude,
    //     },
    //     // @ts-ignore
    //     mapMain,
    //     rangeValue[0]
    //   );
    // }
  };
  const flytoLocation = (longitude: any, latitude: any) => {
    if (mapMain) {
      mapMain.flyTo({
        center: [longitude, latitude],
        zoom: 12,
        essential: true,
      });
    }
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "relative",
          }}
        >
          <div
            ref={editFencesMapCircleRef}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1000,
              pointerEvents: "none",
              width: "0px",
              height: "0px",
              borderRadius: "100%",
              backgroundColor: Colors.blue,
              opacity: 0.2,
            }}
          ></div>
          <svg display="block" height="41px" width="27px" viewBox="0 0 27 41">
            <g fillRule="nonzero">
              <g transform="translate(3.0, 29.0)" fill="#000000">
                <ellipse
                  opacity="0.04"
                  cx="10.5"
                  cy="5.80029008"
                  rx="10.5"
                  ry="5.25002273"
                ></ellipse>
              </g>
              <g fill="#3FB1CE">
                <path d="M27,13.5 C27,19.074644 20.250001,27.000002 14.75,34.500002 C14.016665,35.500004 12.983335,35.500004 12.25,34.500002 C6.7499993,27.000002 0,19.222562 0,13.5 C0,6.0441559 6.0441559,0 13.5,0 C20.955844,0 27,6.0441559 27,13.5 Z"></path>
              </g>
              <g opacity="0.25" fill="#000000">
                <path d="M13.5,0 C6.0441559,0 0,6.0441559 0,13.5 C0,19.222562 6.7499993,27 12.25,34.5 C13,35.522727 14.016664,35.500004 14.75,34.5 C20.250001,27 27,19.074644 27,13.5 C27,6.0441559 20.955844,0 13.5,0 Z"></path>
              </g>
              <g transform="translate(6.0, 7.0)" fill="#FFFFFF"></g>
              <g transform="translate(8.0, 8.0)">
                <circle
                  fill="#000000"
                  opacity="0.25"
                  cx="5.5"
                  cy="5.5"
                  r="5.4999962"
                ></circle>
                <circle fill="#FFFFFF" cx="5.5" cy="5.5" r="5.4999962"></circle>
              </g>
            </g>
          </svg>
        </div>
      </div>
      <Grid
        sx={{
          overflowY: "auto",
          zIndex: 1000,
          position: "absolute",
          top: 0,
          left: 0,
          transform: "translate(0, 0)",
          width: {
            xs: "40%",
            sm: "30%",
            md: "350px",
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
            // setOpenViewFencesModal(true);
            setOpenEditFencesModal(false);
            setRefetchDataOnMap(!refetchDataOnMap);
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
            fontSize: {
              xs: "14px",
              sm: "16px",
            },
            marginTop: {
              xs: "16px",
              sm: "0",
            },
          }}
          mb={1}
        >
          Edit Fences
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
              <Grid sx={{ display: "flex", position: "relative" }}>
                <Button
                  onClick={() => {
                    if (fencesAddress) {
                      getCoordinatesFromAddress(fencesAddress?.trim())
                        .then((res) => {
                          setFencesLat(
                            res?.latitude ? parseFloat(res?.latitude) : null
                          );
                          setFencesLng(
                            res?.longitude ? parseFloat(res?.longitude) : null
                          );
                          flytoLocation(
                            parseFloat(res?.longitude),
                            parseFloat(res?.latitude)
                          );
                        })
                        .catch((error) => {});
                    }
                  }}
                  type="button"
                  variant="contained"
                  sx={{
                    zIndex: 1000,
                    padding: 0,
                    minWidth: "24px",
                    backgroundColor: "transparent",
                    display: "flex",
                    alignItems: "center",
                    position: "absolute",
                    top: "50%",
                    right: "6px",
                    transform: "translate(0, -50%)",
                  }}
                >
                  <IoSearchSharp className="text-[#fff] text-[24px] opacity-[0.8]" />
                </Button>
                <TextField
                  fullWidth
                  placeholder="Address"
                  name="address"
                  value={formik.values.address}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const value = event.target.value;
                    formik.handleChange(event);
                    setFencesAddress(value ? value : "");
                  }}
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
                      paddingRight: "32px",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "transparent",
                    },
                  }}
                />
              </Grid>
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
                disabled={true}
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
          <Box sx={{ width: "100%", padding: 2 }}>
            <Slider
              value={[radisuRange[0] ? radisuRange[0] : singleFences?.radius]}
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
                  width: `${(radisuRange[0] / 400) * 100}%`,
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

export default EditFences;
