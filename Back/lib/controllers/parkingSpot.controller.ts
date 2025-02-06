import { Request, Response, NextFunction, Router } from "express";
import ParkingSpotService from "../modules/services/parkingSpot.service";

class ParkingController {
  public path = "/api/parking";
  public router = Router();
  private parkingSpotService = new ParkingSpotService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/all`, this.getAllParkingSpots);
    this.router.get(`${this.path}/:id`, this.getParkingSpotById);
    this.router.post(`${this.path}`, this.createParkingSpot);
    this.router.delete(`${this.path}/:id`, this.deleteParkingSpot);
  }

  private getAllParkingSpots = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { zone } = request.query; // Pobierz opcjonalny parametr `zone`
    try {
      const filter = zone ? { zone } : {}; // Jeśli `zone` jest podane, dodaj do filtra
      const parkingSpots = await this.parkingSpotService.getAllParkingSpots(
        filter
      );
      response.status(200).json(parkingSpots);
    } catch (error) {
      console.error("Error fetching parking spots:", error);
      response.status(500).json({ error: "Something went wrong" });
    }
  };

  private getParkingSpotById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { id } = request.params;
    try {
      const parkingSpot = await this.parkingSpotService.query({ spotId: id });
      if (!parkingSpot) {
        return response.status(404).json({ error: "Parking spot not found" });
      }
      response.status(200).json(parkingSpot);
    } catch (error) {
      console.error("Error fetching parking spot by ID:", error);
      response.status(500).json({ error: "Something went wrong" });
    }
  };

  private createParkingSpot = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { spotId, zone, isAvailable, type } = request.body;
    const parkingSpotData = {
      spotId,
      zone,
      isAvailable,
      type,
    };
    try {
      await this.parkingSpotService.createParkingSpot(parkingSpotData);
      response
        .status(201)
        .json({ message: "Parking spot created successfully" });
    } catch (error) {
      console.error("Error creating parking spot:", error);
      response.status(500).json({ error: "Failed to create parking spot" });
    }
  };

  private deleteParkingSpot = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { id } = request.params;
    try {
      const result = await this.parkingSpotService.deleteSpot({ spotId: id });
      if (!result.deletedCount) {
        return response.status(404).json({ error: "Parking spot not found" });
      }
      response
        .status(200)
        .json({ message: "Parking spot deleted successfully" });
    } catch (error) {
      console.error("Error deleting parking spot:", error);
      response.status(500).json({ error: "Failed to delete parking spot" });
    }
  };
}

export default ParkingController;
