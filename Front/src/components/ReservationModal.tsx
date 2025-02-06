import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

interface ReservationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { reservedUntil: Date; reservationStart: Date }) => void;
  spotId: string;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  open,
  onClose,
  onSubmit,
  spotId,
}) => {
  const [reservedUntil, setReservedUntil] = useState("");

  const handleSubmit = () => {
    if (reservedUntil) {
      const data = {
        reservedUntil: new Date(reservedUntil),
        reservationStart: new Date(),
      };
      onSubmit(data);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Rezerwacja miejsca {spotId}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          type="datetime-local"
          label="Rezerwuj do"
          value={reservedUntil}
          onChange={(e) => setReservedUntil(e.target.value)}
          margin="dense"
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Anuluj
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Zarezerwuj
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReservationModal;
