import React, { useState, useEffect } from "react";
import { Box, Container, Snackbar, Alert } from "@mui/material";
import ParkingHistory from "../components/ParkingHistory";
import { jwtDecode } from "jwt-decode";

const History: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.userId);
      } catch (error) {
        console.error("Nie udało się dekodować tokenu:", error);
      }
    }
  }, []);

  if (!userId) {
    return null;
  }

  return (
    <Container>
      <Box mt={4}>
        <ParkingHistory />
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="error" onClose={() => setSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default History;
