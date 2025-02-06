import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ParkingSpace from "./ParkingSpace";
import ReservationModal from "./ReservationModal";
import { Button } from "@mui/material";
import { fetchParkingSpots } from "../apiService";
import "./ParkingView.css";

const rows = 4;
const spacesPerRow = 10;

interface ParkingSpaceType {
  id: string;
  spotId: string;
  isAvailable: boolean;
  remainingTime: number | null;
}

const ParkingView: React.FC<{ onBack: () => void; fragment: string }> = ({
  onBack,
  fragment,
}) => {
  const [parkingSpaces, setParkingSpaces] = useState<ParkingSpaceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  let userId: string | null = null;

  if (token) {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    userId = decodedToken?.userId;
  }

  useEffect(() => {
    const loadParkingSpots = async () => {
      try {
        const spots = await fetchParkingSpots(`${fragment}`);

        const sortedSpots = spots.sort(
          (a: ParkingSpaceType, b: ParkingSpaceType) => {
            const numA = parseInt(a.spotId.match(/\d+/)?.[0] || "0", 10);
            const numB = parseInt(b.spotId.match(/\d+/)?.[0] || "0", 10);

            return a.spotId[0].localeCompare(b.spotId[0]) || numA - numB;
          }
        );

        setParkingSpaces(sortedSpots);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadParkingSpots();
  }, [fragment]);

  const handleOpenModal = (spotId: string) => {
    if (!token || !userId) {
      navigate("/login"); // Przekierowanie do logowania, jeśli brak tokena
      return;
    }
    setSelectedSpot(spotId);
  };

  const handleCloseModal = () => {
    setSelectedSpot(null);
  };

  const handleReservationSubmit = async (data: { reservedUntil: Date }) => {
    try {
      if (!userId) throw new Error("Brak ID użytkownika.");
      const reservationData = {
        userId,
        spotId: selectedSpot,
        reservedFrom: new Date().toISOString(),
        reservedUntil: new Date(data.reservedUntil).toISOString(),
      };
      console.log("Rezerwacja:", reservationData);

      const response = await fetch(
        "http://localhost:3100/api/reservations/issue/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reservationData),
        }
      );

      if (!response.ok) throw new Error("Nie udało się utworzyć rezerwacji.");
      alert("Rezerwacja została utworzona!");
      setSelectedSpot(null);
      window.location.reload();
    } catch (error) {
      console.error("Błąd podczas rezerwacji:", error);
      alert("Wystąpił błąd podczas tworzenia rezerwacji.");
    }
  };

  if (loading) {
    return <div>Ładowanie danych...</div>;
  }

  if (error) {
    return <div>Błąd: {error}</div>;
  }

  const groupedSpaces = Array.from({ length: rows }, (_, rowIndex) =>
    parkingSpaces.slice(rowIndex * spacesPerRow, (rowIndex + 1) * spacesPerRow)
  );

  return (
    <div className="parking-lot">
      <div className="header">
        <Button
          variant="contained"
          color="primary"
          className="back-button"
          onClick={onBack}
        >
          Powrót
        </Button>
        <h2>Strefa {fragment}</h2>
      </div>
      {groupedSpaces.map((row, rowIndex) => (
        <React.Fragment key={`row-${rowIndex}`}>
          <div className="parking-row">
            {row.map((space) => (
              <ParkingSpace
                key={space.spotId}
                initialSpace={space}
                onClick={() =>
                  space.isAvailable ? handleOpenModal(space.spotId) : null
                }
              />
            ))}
          </div>
          {rowIndex % 2 === 0 && rowIndex < rows - 1 && (
            <div className="road" />
          )}
        </React.Fragment>
      ))}
      {selectedSpot && (
        <ReservationModal
          open={!!selectedSpot}
          onClose={handleCloseModal}
          onSubmit={handleReservationSubmit}
          spotId={selectedSpot}
        />
      )}
    </div>
  );
};

export default ParkingView;
