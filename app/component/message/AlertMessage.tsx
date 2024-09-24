import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface AlertMessageProps {
  open: boolean;
  onClose: () => void;
  message: string;
  severity?: "success" | "info" | "warning" | "error";
  autoHideDuration?: number;
  anchorOrigin?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  open,
  onClose,
  message,
  severity = "success",
  autoHideDuration = 6000,
  anchorOrigin = { vertical: "top", horizontal: "right" },
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{ width: "100%", zIndex: 1000 }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertMessage;
