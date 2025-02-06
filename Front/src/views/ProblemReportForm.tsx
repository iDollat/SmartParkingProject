import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const ProblemReportForm: React.FC = () => {
  const [category, setCategory] = useState("");
  const [section, setSection] = useState("");
  const [placeNumber, setPlaceNumber] = useState("");
  const [description, setDescription] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [userId, setUserId] = useState<string | null>(null);

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

  const handleCategoryChange = (event: any) => setCategory(event.target.value);
  const handleSectionChange = (event: any) => setSection(event.target.value);
  const handlePlaceNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setPlaceNumber(event.target.value);
  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setDescription(event.target.value);

  const handleSubmit = async () => {
    if (!category || !section || !placeNumber || !description) {
      setSnackbarMessage("Wszystkie pola muszą być wypełnione.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    if (!userId) {
      setSnackbarMessage("Brak identyfikatora użytkownika.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const spotId = `${section}${placeNumber}`;

      const issueData = {
        spotId,
        issueType: category,
        description,
        userId,
      };

      const response = await axios.post(
        "http://localhost:3100/api/issues/create",
        issueData
      );

      setSnackbarMessage("Zgłoszenie zostało zapisane.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      console.log("Sukces:", response.data);
    } catch (error) {
      setSnackbarMessage("Wystąpił błąd podczas zapisywania zgłoszenia.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Błąd:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "0 auto", padding: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 2, textAlign: "center" }}>
        Formularz zgłaszania problemów
      </Typography>

      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel>Kategoria problemu</InputLabel>
        <Select value={category} onChange={handleCategoryChange} required>
          <MenuItem value="Mechanical">Problemy mechaniczne</MenuItem>
          <MenuItem value="Technical">Problemy techniczne</MenuItem>
          <MenuItem value="Other">Inne</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel>Sekcja</InputLabel>
        <Select value={section} onChange={handleSectionChange} required>
          <MenuItem value="A">Sekcja A</MenuItem>
          <MenuItem value="B">Sekcja B</MenuItem>
          <MenuItem value="C">Sekcja C</MenuItem>
          <MenuItem value="D">Sekcja D</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Numer miejsca"
        value={placeNumber}
        onChange={handlePlaceNumberChange}
        type="number"
        fullWidth
        sx={{ marginBottom: 2 }}
        required
      />

      <TextField
        label="Opis problemu"
        value={description}
        onChange={handleDescriptionChange}
        multiline
        rows={4}
        fullWidth
        sx={{ marginBottom: 2 }}
        required
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        fullWidth
      >
        Zgłoś problem
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProblemReportForm;
