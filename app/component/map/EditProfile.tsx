"use client";

import Grid from "@mui/material/Grid2";
import { Colors } from "./../../theme/colors";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import Image from "next/image";
import DefaultUser from "./../../../assets/default_user.png";
import { useSession } from "next-auth/react";
import axios from "axios";

import { TextField, Box, Button, Typography } from "@mui/material";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useUserActionOpenContext } from "../../context/map/UserActionContext";

interface FormValues {
  name: string;
  phone: string | null;
  email: string;
  profilePicture?: File | null;
}

const EditProfile = ({
  moveEditProfileForm,
  handleUserInformation,
  userInformationData,
  setUserInformationData,
  setSuccess,
}: {
  moveEditProfileForm: boolean;
  handleUserInformation: (token: string, user_id: string) => void;
  userInformationData: any;
  setUserInformationData: React.Dispatch<React.SetStateAction<any>>;
  setSuccess: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const { data: session, status }: { data: any; status: any } = useSession();
  const [loading, setLoading] = useState(false);
  const { editProfleModalFormHide, handleHide: userActionHandleHide } =
    useUserActionOpenContext();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mobileDeviceModal, setMobileDeviceModal] = useState(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      name: userInformationData?.name ? userInformationData?.name : "",
      phone: userInformationData?.phone ? userInformationData?.phone : "",
      email: session?.user?.email ? session?.user?.email : "",
      profilePicture: userInformationData?.avatar
        ? userInformationData?.avatar
        : null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
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
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        if (values.phone) {
          formData.append("phone", values.phone);
        }
        if (values.profilePicture) {
          formData.append("avatar", values.profilePicture);
        }

        const response = await axios.patch(
          // @ts-ignore
          `${process.env.NEXT_PUBLIC_API_URL}/users/${session?.user?.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              // @ts-ignore
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        );

        if (response?.data?.user) {
          setSuccess(true);
          // resetForm();
          // @ts-ignore
          const res: any = await handleUserInformation(
            session?.user?.token,
            session?.user?.id
          );

          if (res?.data?.user) {
            setUserInformationData(res?.data?.user);
          }
          editProfleModalFormHide();
          userActionHandleHide();
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    },
  });

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setFieldValue("profilePicture", file);
    }
  };

  return (
    <>
      <Grid
        onClick={() => {
          editProfleModalFormHide();
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
          editProfleModalFormHide();
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
            md: moveEditProfileForm ? "360px" : "50%",
          },
          transform: {
            xs: "translate(-50%, -50%)",
            md: moveEditProfileForm
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
          onClick={() => editProfleModalFormHide()}
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
          Edit Profile
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid>
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
                      backgroundColor: "transparent",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "transparent",
                    },
                  }}
                />
              </Box>
              {/* Phone */}
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
                  Phone
                </Typography>

                <TextField
                  fullWidth
                  placeholder="Phone"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
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
              {/* Email */}
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
                  disabled={true}
                  fullWidth
                  placeholder="email"
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
              {/* Profile Image */}
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                {selectedImage ? (
                  <Box sx={{ position: "relative", width: 60, height: 60 }}>
                    <Image
                      src={selectedImage}
                      alt="Profile Picture"
                      layout="fill"
                      objectFit="cover"
                      style={{ borderRadius: "12px" }}
                    />
                  </Box>
                ) : userInformationData?.avatar ? (
                  <Box sx={{ position: "relative", width: 60, height: 60 }}>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_API_URL}/img/users/${userInformationData?.avatar}`}
                      alt="Profile Picture"
                      layout="fill"
                      objectFit="cover"
                      style={{ borderRadius: "12px" }}
                    />
                  </Box>
                ) : (
                  <Box sx={{ position: "relative", width: 60, height: 60 }}>
                    <Image
                      src={DefaultUser}
                      alt="Profile Picture"
                      layout="fill"
                      objectFit="cover"
                      // style={{ borderRadius: "50%" }}
                    />
                  </Box>
                )}

                <Button
                  disabled={selectedImage ? true : false}
                  variant="contained"
                  component="label"
                  sx={{
                    fontSize: {
                      xs: "12px",
                      sm: "14px",
                    },
                  }}
                >
                  Upload Profile Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(event) =>
                      handleImageChange(event, formik.setFieldValue)
                    }
                  />
                </Button>
              </Box>
            </Grid>
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

export default EditProfile;
