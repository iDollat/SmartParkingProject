import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import ParkingSectionDiagram from "../components/ParkingSectionDiagram";
import "./AdminPanel.css";
import { jwtDecode }from "jwt-decode";
import { fetchParkingSpots } from "../apiService";

interface ParkingZoneData {
  occupied: number;
  total: number;
}

interface ParkingData {
  [zone: string]: ParkingZoneData;
}

const AdminPanel: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [parkingData, setParkingData] = useState<ParkingData>({
    A: { occupied: 0, total: 40 },
    B: { occupied: 0, total: 40 },
    C: { occupied: 0, total: 40 },
    D: { occupied: 0, total: 40 },
  });

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
    if (isAdmin) {
      const zones = ["A", "B", "C", "D"];
      const fetchParkingData = async () => {
        try {
          const fetchedData = await Promise.all(
            zones.map(async (zone) => {
              const data = await fetchParkingSpots(zone);
              const occupied = data.filter((spot: any) => !spot.isAvailable).length;
              return { zone, occupied, total: 40 };
            })
          );

          const updatedData: ParkingData = fetchedData.reduce(
            (acc, { zone, occupied, total }) => {
              acc[zone] = { occupied, total };
              return acc;
            },
            {} as ParkingData
          );

          setParkingData(updatedData);
        } catch (error) {
          console.error("Nie udało się pobrać danych parkingowych:", error);
        }
      };

      fetchParkingData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Typography variant="h6" color="error">
          Brak uprawnień do przeglądania tej strony.
        </Typography>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "32px",
        padding: "16px",
        justifyItems: "center",
        alignItems: "center",
        color: "#3f51b5",
      }}
    >
      {Object.entries(parkingData).map(([zone, { occupied, total }]) => (
        <div key={zone} style={{ textAlign: "center" }}>
          <Typography variant="h6" style={{ marginBottom: "8px" }}>
            Strefa {zone}:
          </Typography>
          <ParkingSectionDiagram occupied={occupied} total={total} />
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;