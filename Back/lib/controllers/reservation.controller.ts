import { Request, Response, NextFunction, Router } from "express";
import ReservationService from "../modules/services/reservation.service";
import { Query } from "../modules/models/reservation.model";

class ReservationController {
  public path = "/api/reservations";
  public router = Router();
  private reservationService = new ReservationService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/issue/create`, this.createReservation);
    this.router.get(`${this.path}/issues`, this.queryReservations);
    this.router.delete(`${this.path}/issue/:id`, this.cancelReservation);
    this.router.get(
      `${this.path}/current/:userId`,
      this.getCurrentReservations
    );
  }

  private createReservation = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const reservationParams = request.body;
    try {
      await this.reservationService.createReservation(reservationParams);
      response.status(201).json({ message: "Rezerwacja została utworzona" });
    } catch (error) {
      console.error("Błąd podczas tworzenia rezerwacji:", error);
      response
        .status(500)
        .json({ error: "Wystąpił błąd podczas tworzenia rezerwacji" });
    }
  };

  // Wyszukiwanie rezerwacji
  private queryReservations = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const queryParams: Query<string | Date> = {};

      for (const key in request.query) {
        const value = request.query[key];
        if (Array.isArray(value)) continue;
        if (!isNaN(Date.parse(value as string))) {
          queryParams[key] = new Date(value as string);
        } else {
          queryParams[key] = value as string;
        }
      }

      const reservations = await this.reservationService.query(queryParams);
      response.status(200).json(reservations);
    } catch (error) {
      console.error("Błąd podczas wyszukiwania rezerwacji:", error);
      response
        .status(500)
        .json({ error: "Wystąpił błąd podczas wyszukiwania rezerwacji" });
    }
  };

  // Anulowanie rezerwacji
  private cancelReservation = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { id } = request.params;
    try {
      await this.reservationService.cancelReservation(id);
      response.status(200).json({ message: "Rezerwacja została anulowana" });
    } catch (error) {
      console.error(`Błąd podczas anulowania rezerwacji o ID ${id}:`, error);
      response
        .status(500)
        .json({ error: "Wystąpił błąd podczas anulowania rezerwacji" });
    }
  };

  // Pobieranie historii rezerwacji dla danego użytkownika
  private getCurrentReservations = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const userId = request.params.userId;

    try {
      const reservations = await this.reservationService.getUserReservations(
        userId
      );
      response.status(200).json(reservations);
    } catch (error) {
      console.error("Błąd podczas pobierania historii rezerwacji:", error);
      response.status(500).json({
        error: "Wystąpił błąd podczas pobierania historii rezerwacji",
      });
    }
  };
}

export default ReservationController;
