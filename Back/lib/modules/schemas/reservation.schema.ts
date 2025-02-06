import { Schema, model } from "mongoose";
import { IReservation } from "../models/reservation.model";

export const ReservationSchema = new Schema({
  spotId: { type: String, required: true },
  userId: { type: String, required: true },
  reservationStart: { type: Date, required: true },
  reservedUntil: { type: Date, required: true },
});

export default model<IReservation>(
  "reservations",
  ReservationSchema,
  "reservations"
);
