"use client";
import SignInForm from "./component/signin/SignInForm";
import useRedirectIfAuthenticated from "./hooks/useRedirectIfAuthenticated";
import Grid from "@mui/material/Grid2";
import CircularProgress from "@mui/material/CircularProgress";
import { Colors } from "./theme/colors";
import ForgotPassword from "./component/forgotPassword/form";
import { useState } from "react";
import AlertMessage from "./component/message/AlertMessage";

const Home = () => {
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [checkErrorStatus, setCheckErrorStatus] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { session, status } = useRedirectIfAuthenticated();

  if (status === "loading") {
    return (
      <Grid
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress sx={{ color: Colors.red }} size={100} />
      </Grid>
    );
  }

  if (session) {
    return (
      <Grid
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress sx={{ color: Colors.red }} size={100} />
      </Grid>
    );
  }

  const renderComponent = () => {
    if (forgotPasswordModal) {
      return (
        <ForgotPassword
          setForgotPasswordModal={setForgotPasswordModal}
          setCheckErrorStatus={setCheckErrorStatus}
          setErrorMsg={setErrorMsg}
        />
      );
    } else {
      return <SignInForm setForgotPasswordModal={setForgotPasswordModal} />;
    }
  };

  return (
    <>
      <Grid
        sx={{
          backgroundColor: Colors.greyBlack,
          width: "100%",
          height: "100vh",
        }}
      >
        {renderComponent()}
        <AlertMessage
          open={checkErrorStatus}
          onClose={() => setCheckErrorStatus(false)}
          message={errorMsg}
          severity="error"
        />
      </Grid>
    </>
  );
};
export default Home;
