// src/views/Reports.tsx
import React, { useState, useEffect } from "react";
import { Typography, Box, Button, Grid } from "@mui/material";
import ParkingSectionDiagram from "../components/ParkingSectionDiagram"; // Komponent do wyświetlania wykresu

interface ReportData {
  date: string;
  occupied: number;
  total: number;
}

const Management: React.FC = () => {
  const [reports, setReports] = useState<ReportData[]>([]);

  // Symulacja danych raportu, które można by załadować z serwera
  useEffect(() => {
    const fetchedReports = [
      { date: "2024-12-15", occupied: 5, total: 10 },
      { date: "2024-12-16", occupied: 7, total: 10 },
      { date: "2024-12-17", occupied: 6, total: 10 },
      { date: "2024-12-18", occupied: 8, total: 10 },
      { date: "2024-12-19", occupied: 4, total: 10 },
    ];
    setReports(fetchedReports);
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Raporty Parkingowe
      </Typography>

      <Typography variant="body1" gutterBottom>
        Zobacz analizę zajętości parkingu w ostatnich dniach. Możesz również
        sprawdzić prognozę na nadchodzące dni.
      </Typography>

      {/* Przegląd raportów */}
      <Grid container spacing={2}>
        {reports.map((report, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Box border={1} padding={2} borderRadius={2} boxShadow={3}>
              <Typography variant="h6">{`Raport: ${report.date}`}</Typography>
              <ParkingSectionDiagram
                occupied={report.occupied}
                total={report.total}
              />
              <Typography variant="body1">{`Zajęte: ${report.occupied}/${report.total}`}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box display="flex" justifyContent="center" marginTop={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => alert("Wczytuję nowe dane...")}
        >
          Załaduj najnowsze raporty
        </Button>
      </Box>
    </div>
  );
};

export default Management;
