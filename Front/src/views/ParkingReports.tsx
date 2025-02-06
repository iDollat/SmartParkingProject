import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { fetchParkingIssues, updateIssueStatus } from "../apiService"; // Dodano `updateIssueStatus`

interface ParkingReport {
  id: string; // Dodano ID zgłoszenia
  place: string;
  category: string;
  description: string;
  reportedAt: string;
  resolvedAt?: string;
}

const ParkingReports: React.FC = () => {
  const [openReports, setOpenReports] = useState<ParkingReport[]>([]);
  const [closedReports, setClosedReports] = useState<ParkingReport[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setIsAdmin(decoded.role === "admin");
      } catch (error) {
        console.error("Nie udało się dekodować tokenu:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await fetchParkingIssues();

        // Filtrowanie zgłoszeń o statusie "open" i "closed"
        const openIssues = data.issues.filter((issue: any) => issue.status === "open");
        const closedIssues = data.issues.filter((issue: any) => issue.status === "closed");

        // Mapowanie danych
        setOpenReports(
          openIssues.map((issue: any) => ({
            id: issue._id, // Pobranie ID zgłoszenia
            place: issue.spotId,
            category: issue.issueType,
            description: issue.description,
            reportedAt: issue.reportedAt,
          }))
        );

        setClosedReports(
          closedIssues.map((issue: any) => ({
            id: issue._id, // Pobranie ID zgłoszenia
            place: issue.spotId,
            category: issue.issueType,
            description: issue.description,
            reportedAt: issue.reportedAt,
            resolvedAt: issue.resolvedAt,
          }))
        );
      } catch (error) {
        console.error("Nie udało się pobrać zgłoszeń błędów:", error);
      }
    };

    if (isAdmin) {
      fetchReports();
    }
  }, [isAdmin]);

  const handleCloseIssue = async (id: string) => {
    try {
      const currentDate = new Date().toISOString(); // ISO date for MongoDB
      await updateIssueStatus(id, "closed", currentDate); // Send the update to the backend
  
      // Optimistically update the local state
      setOpenReports((prevReports) =>
        prevReports.filter((report) => report.id !== id)
      );
  
      setClosedReports((prevReports) => [
        ...prevReports,
        {
          ...openReports.find((report) => report.id === id)!,
          resolvedAt: currentDate,
        },
      ]);
    } catch (error) {
      console.error("Failed to close issue:", error);
    }
  };  

  if (!isAdmin) {
    return (
      <Container>
        <Box mt={4}>
          <Typography variant="h6" color="error" sx={{ textAlign: "center" }}>
            Brak uprawnień do przeglądania tej strony.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 2 }}>
          Zgłoszenia Problemów
        </Typography>

        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          centered
          sx={{ marginBottom: 2 }}
        >
          <Tab label="Open Issues" />
          <Tab label="Closed Issues" />
        </Tabs>

        {activeTab === 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center"><strong>Place</strong></TableCell>
                  <TableCell align="center"><strong>Category</strong></TableCell>
                  <TableCell align="center"><strong>Description</strong></TableCell>
                  <TableCell align="center"><strong>Reported At</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {openReports.map((report, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{report.place}</TableCell>
                    <TableCell align="center">{report.category}</TableCell>
                    <TableCell align="center">{report.description}</TableCell>
                    <TableCell align="center">{new Date(report.reportedAt).toLocaleString()}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleCloseIssue(report.id)}
                      >
                        Close
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {activeTab === 1 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center"><strong>Place</strong></TableCell>
                  <TableCell align="center"><strong>Category</strong></TableCell>
                  <TableCell align="center"><strong>Description</strong></TableCell>
                  <TableCell align="center"><strong>Reported At</strong></TableCell>
                  <TableCell align="center"><strong>Resolved At</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {closedReports.map((report, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{report.place}</TableCell>
                    <TableCell align="center">{report.category}</TableCell>
                    <TableCell align="center">{report.description}</TableCell>
                    <TableCell align="center">{new Date(report.reportedAt).toLocaleString()}</TableCell>
                    <TableCell align="center">{report.resolvedAt ? new Date(report.resolvedAt).toLocaleString() : "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
};

export default ParkingReports;
