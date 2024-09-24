"use client";
import SignInForm from "./component/signin/SignInForm";
import useRedirectIfAuthenticated from "./hooks/useRedirectIfAuthenticated";
import Grid from "@mui/material/Grid2";
import CircularProgress from "@mui/material/CircularProgress";
import { Colors } from "./theme/colors";

const Home = () => {
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
  return (
    <>
      <Grid
        sx={{
          backgroundColor: Colors.greyBlack,
          width: "100%",
          height: "100vh",
        }}
      >
        <SignInForm />
      </Grid>
    </>
  );
};
export default Home;
