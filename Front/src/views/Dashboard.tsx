import React, { useState } from "react";
import { Typography } from "@mui/material";
import ParkingView from "../components/ParkingView";
import "./Dashboard.css";

// Typy dla fragmentów
interface Fragment {
  id: string;
  label: string;
}

const Dashboard: React.FC = () => {
  const [selectedFragment, setSelectedFragment] = useState<string | null>(null);

  const handleFragmentClick = (index: string) => {
    setSelectedFragment(index);
  };

  const handleBack = () => {
    setSelectedFragment(null); // Ustawia widok powrotu
  };

  if (selectedFragment) {
    return <ParkingView fragment={selectedFragment} onBack={handleBack} />;
  }

  const fragments: Fragment[] = [
    { id: "C", label: "Strefa C" },
    { id: "D", label: "Strefa D" },
    { id: "A", label: "Strefa A" },
    { id: "B", label: "Strefa B" },
  ];

  return (
    <div className="dashboard">
      <Typography variant="h3" className="title">
        Wybierz strefę
      </Typography>
      <div className="background-image">
        {fragments.map((fragment) => (
          <div
            key={fragment.id}
            className={`parking-fragment fragment-${fragment.id}`}
            onMouseEnter={(e) => e.currentTarget.classList.add("highlight")}
            onMouseLeave={(e) => e.currentTarget.classList.remove("highlight")}
            onClick={() => handleFragmentClick(fragment.id)}
          >
            {fragment.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
