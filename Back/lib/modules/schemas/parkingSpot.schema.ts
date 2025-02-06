import { Schema, model } from "mongoose";
import { IParkingSpot } from "../models/parkingSpot.model";

export const ParkingSpotSchema = new Schema({
  spotId: { type: String, required: true },
  zone: { type: String, required: true },
  isAvailable: { type: Boolean, required: true },
  reservedUntil: { type: Date, default: null },
  type: { type: String, enum: ["car", "truck"], required: true },
});

export default model<IParkingSpot>(
  "parkingSpots",
  ParkingSpotSchema,
  "parkingSpots"
);
