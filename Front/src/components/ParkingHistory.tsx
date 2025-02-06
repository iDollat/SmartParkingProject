import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import { fetchCurrentReservations } from "../apiService";
import { styled } from "@mui/material/styles";

interface Reservation {
  spotId: string;
  reservedUntil: string;
  reservationStart: string;
}

const StyledTable = styled(Table)({
  width: "100%",
});

const StyledTableCell = styled(TableCell)({
  textAlign: "center",
});

const ParkingHistory: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");
  let userId: string | null = null;

  if (token) {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    userId = decodedToken?.userId;
  }

  useEffect(() => {
    const loadReservations = async () => {
      if (!userId) {
        setError("Użytkownik nie jest zalogowany");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchCurrentReservations(userId);
        setReservations(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, [userId]);

  if (loading) {
    return <div>Ładowanie danych...</div>;
  }

  if (error) {
    return <div>Błąd: {error}</div>;
  }

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>
        Moje Rezerwacje
      </Typography>
      {reservations.length === 0 ? ( // Sprawdzamy, czy tablica jest pusta
        <Typography mt={2} variant="body1">
          Brak rezerwacji
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <StyledTable>
            <TableHead>
              <TableRow>
                <StyledTableCell>Miejsce</StyledTableCell>
                <StyledTableCell>Czas rozpoczęcia</StyledTableCell>
                <StyledTableCell>Czas zakończenia</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((entry, index) => (
                <TableRow key={index}>
                  <StyledTableCell>{entry.spotId}</StyledTableCell>
                  <StyledTableCell>
                    {new Date(entry.reservationStart).toLocaleString()}
                  </StyledTableCell>
                  <StyledTableCell>
                    {new Date(entry.reservedUntil).toLocaleString()}
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
        </TableContainer>
      )}
    </Box>
  );
};

export default ParkingHistory;
