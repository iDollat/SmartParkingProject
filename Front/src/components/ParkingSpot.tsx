// src/components/ParkingSpot.tsx
import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

// Typ dla miejsca parkingowego
interface ParkingSpotProps {
  spot: {
    id: number;
    isAvailable: boolean;
  };
  onClick: () => void;
}

const ParkingSpot: React.FC<ParkingSpotProps> = ({ spot, onClick }) => {
  const color = spot.isAvailable ? "green" : "red";
  return (
    <Card
      onClick={onClick}
      style={{
        backgroundColor: color,
        color: "white",
        cursor: "pointer",
        margin: "8px",
      }}
    >
      <CardContent>
        <Typography variant="h6">Miejsce {spot.id}</Typography>
        <Typography variant="body2">
          {spot.isAvailable ? "Dostępne" : "Zajęte"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ParkingSpot;
