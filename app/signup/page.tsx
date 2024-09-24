import SignUpForm from "./../component/signup/SignUpForm";
import { Colors } from "./../theme/colors";
import Grid from "@mui/material/Grid2";
const Home = () => {
  return (
    <>
      <Grid
        sx={{
          backgroundColor: Colors.greyBlack,
          width: "100%",
          height: "100vh",
        }}
      >
        <SignUpForm />
      </Grid>
    </>
  );
};
export default Home;
