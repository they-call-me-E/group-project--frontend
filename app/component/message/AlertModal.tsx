import Grid from "@mui/material/Grid2";
import { Colors } from "../../theme/colors";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";

interface AlertModalProps {
  //open: boolean;
  onClose: () => void;
  message: string;
  onConfirm: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({
  message,
  onClose,
  onConfirm,
}) => {
  return (
    <Grid
      sx={{
        position: "absolute",
        zIndex: 1000,
        top: "10px",
        left: "50%",
        transform: "translate(-50%, 0)",
        width: "400px",
        backgroundColor: Colors.white,
        padding: "20px",
      }}
    >
      <IconButton
        edge="start"
        color="inherit"
        aria-label="close"
        onClick={() => {
          onClose();
        }}
        sx={{
          position: "absolute",
          right: "4px",
          top: "4px",
          backgroundColor: Colors.red,
          borderRadius: "50px",
          "&:hover": {
            backgroundColor: Colors.red,
          },
        }}
      >
        <CloseIcon sx={{ color: Colors.white, fontSize: "18px" }} />
      </IconButton>
      <Typography
        variant="body1"
        sx={{
          color: Colors.red,
          fontWeight: "500",
          letterSpacing: 0.8,
          fontSize: "14px",
        }}
      >
        {message}
      </Typography>
      <Grid
        sx={{
          display: "flex",
          columnGap: "6px",
          justifyContent: "end",
          marginTop: "10px",
        }}
      >
        <Button
          variant="contained"
          onClick={() => {
            onClose();
          }}
          className="cursor-pointer"
          sx={{
            backgroundColor: Colors.blue,
            padding: "2px 20px",
            borderRadius: "12px",
            display: "flex",
            columnGap: "6px",
            alignItems: "center",
            justifyContent: "center",
            textTransform: "capitalize",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: Colors.black,
              fontWeight: "500",
              letterSpacing: 0.8,
              fontSize: "16px",
            }}
          >
            Cancel
          </Typography>
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onConfirm();
          }}
          className="cursor-pointer"
          sx={{
            backgroundColor: Colors.blue,
            padding: "2px 20px",
            borderRadius: "12px",
            display: "flex",
            columnGap: "6px",
            alignItems: "center",
            justifyContent: "center",
            textTransform: "capitalize",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: Colors.black,
              fontWeight: "500",
              letterSpacing: 0.8,
              fontSize: "16px",
            }}
          >
            Confirm
          </Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

export default AlertModal;
