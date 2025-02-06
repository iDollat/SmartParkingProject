import ParkingSpotModel from "../schemas/parkingSpot.schema";
import { IParkingSpot, Query } from "../models/parkingSpot.model";

export default class ParkingSpotService {
  public async createParkingSpot(parkingSpotParams: IParkingSpot) {
    try {
      const parkingSpot = new ParkingSpotModel(parkingSpotParams);
      await parkingSpot.save();
    } catch (error) {
      console.error(
        "Wystąpił błąd podczas tworzenia miejsca parkingowego:",
        error
      );
      throw new Error("Wystąpił błąd podczas tworzenia miejsca parkingowego");
    }
  }

  public async query(queryParams: Query<string | boolean | number>) {
    try {
      const spots = await ParkingSpotModel.find(queryParams, { __v: 0 });
      return spots;
    } catch (error) {
      console.error(
        "Wystąpił błąd podczas wyszukiwania miejsc parkingowych:",
        error
      );
      throw new Error("Wystąpił błąd podczas wyszukiwania miejsc parkingowych");
    }
  }

  public async getAvailableSpots(zone: string) {
    try {
      const spots = await ParkingSpotModel.find(
        { zone, isAvailable: true },
        { __v: 0 }
      );
      return spots;
    } catch (error) {
      console.error(
        "Wystąpił błąd podczas pobierania dostępnych miejsc parkingowych:",
        error
      );
      throw new Error(
        "Wystąpił błąd podczas pobierania dostępnych miejsc parkingowych"
      );
    }
  }

  public async reserveSpot(spotId: string, reservedUntil: Date) {
    try {
      const updatedSpot = await ParkingSpotModel.findOneAndUpdate(
        { spotId },
        { isAvailable: false, reservedUntil },
        { new: true }
      );
      return updatedSpot;
    } catch (error) {
      console.error(
        `Wystąpił błąd podczas rezerwacji miejsca ${spotId}:`,
        error
      );
      throw new Error("Wystąpił błąd podczas rezerwacji miejsca parkingowego");
    }
  }

  public async getAllParkingSpots(filter = {}) {
    try {
      const spots = await ParkingSpotModel.find(filter, { __v: 0 }).sort({
        spotId: 1,
      }); // Sortowanie rosnąco po `spotId`
      return spots;
    } catch (error) {
      console.error("Error fetching parking spots:", error);
      throw new Error("Failed to fetch parking spots");
    }
  }

  // parkingSpot.service.ts
  public async deleteSpot(query: Query<string | number | boolean>) {
    try {
      const result = await ParkingSpotModel.deleteMany(query); // Usuwamy dokumenty
      return result; // Zwracamy wynik (zawierający m.in. deletedCount)
    } catch (error) {
      console.error(
        "Wystąpił błąd podczas usuwania miejsc parkingowych:",
        error
      );
      throw new Error("Wystąpił błąd podczas usuwania miejsc parkingowych");
    }
  }
}
