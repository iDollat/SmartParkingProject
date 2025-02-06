import ReservationModel from "../schemas/reservation.schema";
import { IReservation, Query } from "../models/reservation.model";
import ParkingSpotModel from "../schemas/parkingSpot.schema";

export default class ReservationService {
  public async createReservation(reservationParams: IReservation) {
    try {
      const reservation = new ReservationModel({
        ...reservationParams,
        reservationStart: new Date(),
      });
      await reservation.save();

      // Zmiana stanu miejsca parkingowego
      await ParkingSpotModel.updateOne(
        { spotId: reservationParams.spotId },
        { isAvailable: false }
      );

      console.log(`Zarezerwowano miejsce ${reservationParams.spotId}`);
    } catch (error) {
      console.error("Wystąpił błąd podczas tworzenia rezerwacji:", error);
      throw new Error("Wystąpił błąd podczas tworzenia rezerwacji");
    }
  }

  public async query(queryParams: Query<string | Date>) {
    try {
      const reservations = await ReservationModel.find(queryParams, { __v: 0 });
      return reservations;
    } catch (error) {
      console.error("Wystąpił błąd podczas wyszukiwania rezerwacji:", error);
      throw new Error("Wystąpił błąd podczas wyszukiwania rezerwacji");
    }
  }

  public async cancelReservation(reservationId: string) {
    try {
      await ReservationModel.deleteOne({ reservationId });
    } catch (error) {
      console.error(
        `Wystąpił błąd podczas anulowania rezerwacji ${reservationId}:`,
        error
      );
      throw new Error("Wystąpił błąd podczas anulowania rezerwacji");
    }
  }

  public async getUserReservations(userId: string) {
    try {
      const reservations = await ReservationModel.find({ userId }, { __v: 0 });
      return reservations;
    } catch (error) {
      console.error(
        `Wystąpił błąd podczas pobierania aktualnych rezerwacji użytkownika ${userId}:`,
        error
      );
      throw new Error(
        "Wystąpił błąd podczas pobierania aktualnych rezerwacji użytkownika"
      );
    }
  }
}
