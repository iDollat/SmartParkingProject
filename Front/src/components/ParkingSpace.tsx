import React from "react";

interface ParkingSpaceProps {
  initialSpace: {
    id: string;
    spotId: string;
    isAvailable: boolean;
    remainingTime: number | null;
  };
  onClick: () => void;
}

const ParkingSpace: React.FC<ParkingSpaceProps> = ({
  initialSpace,
  onClick,
}) => {
  const statusClass = initialSpace.isAvailable ? "available" : "occupied";

  return (
    <div className={`parking-space ${statusClass}`} onClick={onClick}>
      <div>Miejsce {initialSpace.spotId}</div>
      <div>{initialSpace.isAvailable ? "Dostępne" : "Zajęte"}</div>
      {initialSpace.remainingTime && (
        <div>Pozostały czas: {initialSpace.remainingTime} min</div>
      )}
    </div>
  );
};

export default ParkingSpace;
