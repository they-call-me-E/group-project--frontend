"use client";
import useRedirectIfAuthenticated from "../../hooks/useRedirectIfAuthenticated";
import Grid from "@mui/material/Grid2";
import CircularProgress from "@mui/material/CircularProgress";
import { Colors } from "../../theme/colors";
import ResetPasswordForm from "../../component/resetPassword/form";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import AlertMessage from "../../component/message/AlertMessage";
import { useRouter } from "next/navigation";

const ResetPassword = () => {
  const router = useRouter();
  const params = useParams();
  const { token } = params;
  const { session, status } = useRedirectIfAuthenticated();
  const [checkSuccessStatus, setCheckSuccessStatus] = useState(false);
  const [checkErrorStatus, setCheckErrorStatus] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/map");
    }
  }, [status]);

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

  return (
    <>
      <Grid
        sx={{
          backgroundColor: Colors.greyBlack,
          width: "100%",
          height: "100vh",
        }}
      >
        <ResetPasswordForm
          checkSuccessStatus={checkSuccessStatus}
          token={token}
          setCheckSuccessStatus={setCheckSuccessStatus}
          setCheckErrorStatus={setCheckErrorStatus}
        />
        <AlertMessage
          open={checkSuccessStatus}
          onClose={() => setCheckSuccessStatus(false)}
          message=" Your password has been successfully reset. You can now log in with your new password."
          severity="success"
        />
        <AlertMessage
          open={checkErrorStatus}
          onClose={() => setCheckErrorStatus(false)}
          message="Token is invalid or has expired."
          severity="error"
        />
      </Grid>
    </>
  );
};
export default ResetPassword;
