import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import { WebSocketServer } from "ws";
import Controller from "./interfaces/controller.interface";
import { config } from "./config";
import ReservationModel from "./modules/schemas/reservation.schema";
import ParkingSpotModel from "./modules/schemas/parkingSpot.schema";

class Index {
  public app: express.Application;
  private wss: WebSocketServer | null = null;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.connectToDatabase();
  }

  public listen(): void {
    const server = this.app.listen(config.port, () => {
      console.log(`App listening on the port ${config.port}`);
    });

    this.initializeWebSocketServer(server);
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(morgan("dev"));
    this.app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, x-auth-token"
      );
      next();
    });

    this.app.use(express.static("public"));
  }

  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  private async connectToDatabase(): Promise<void> {
    try {
      await mongoose.connect(config.databaseUrl);
      console.log("Connection with database established");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }

    mongoose.connection.on("error", (error) => {
      console.error("MongoDB connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed due to app termination");
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed due to app termination");
      process.exit(0);
    });
  }

  private initializeWebSocketServer(server: any): void {
    this.wss = new WebSocketServer({ server });

    this.wss.on("connection", (ws) => {
      console.log("WebSocket connected!");

      ws.on("message", (message) => {
        console.log("Received message:", message);
      });

      ws.on("close", () => {
        console.log("WebSocket disconnected");
      });
    });

    this.scheduleReservationCheck();
  }

  private broadcastUpdate(update: any): void {
    if (this.wss) {
      this.wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(JSON.stringify(update));
        }
      });
    }
  }

  private async scheduleReservationCheck(): Promise<void> {
    setInterval(async () => {
      const now = new Date();
      const endedReservations = await ReservationModel.find({
        reservedUntil: { $lte: now },
      });

      for (const reservation of endedReservations) {
        await ParkingSpotModel.updateOne(
          { spotId: reservation.spotId },
          { isAvailable: true }
        );

        await ReservationModel.deleteOne({ _id: reservation._id });

        this.broadcastUpdate({
          spotId: reservation.spotId,
          isAvailable: true,
        });

        console.log(
          `Zaktualizowano miejsce ${reservation.spotId} na dostępne.`
        );
      }
    }, 30000); // Uruchamiaj co 30 sekund
  }
}

export default Index;
