import Controller from "../interfaces/controller.interface";
import { Request, Response, NextFunction, Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { admin } from "../middlewares/admin.middleware";
import UserService from "../modules/services/user.service";
import PasswordService from "../modules/services/password.service";
import TokenService from "../modules/services/token.service";

class UserController implements Controller {
  public path = "/api/user";
  public router = Router();
  private userService = new UserService();
  private passwordService = new PasswordService();
  private tokenService = new TokenService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/create`, this.createNewOrUpdate);
    this.router.post(`${this.path}/auth`, this.authenticate);
    this.router.delete(
      `${this.path}/logout/:userId`,
      auth,
      this.removeHashSession
    );
  }

  private authenticate = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { login, password } = request.body;

    try {
      const isEmail = /\S+@\S+\.\S+/.test(login);
      const user = await this.userService.getByEmailOrPhone(login, isEmail);
      if (!user) {
        return response.status(401).json({ error: "Unauthorized" });
      }

      const isAuthorized = await this.passwordService.authorize(
        user.id,
        password
      );
      if (!isAuthorized) {
        return response
          .status(401)
          .json({ error: "Invalid username or password" });
      }

      const token = await this.tokenService.create(user);
      return response.status(200).json(this.tokenService.getToken(token));
    } catch (error) {
      console.error(`Validation Error: ${error.message}`);
      return response.status(401).json({ error: "Unauthorized" });
    }
  };

  private createNewOrUpdate = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const userData = request.body;
    console.log("Dane użytkownika:", userData);
    console.log("Password:", userData.password);

    try {
      // Jeśli w request body znajduje się hasło, przekazujemy je do UserService
      const user = await this.userService.createNewOrUpdate(
        userData,
        userData.password // Tutaj przekazujemy hasło!
      );

      // Wysłanie odpowiedzi
      response.status(200).json(user);
    } catch (error) {
      console.error(`Błąd: ${error.message}`);
      response.status(400).json({ error: "Bad request", value: error.message });
    }
  };

  private removeHashSession = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { userId } = request.params;

    try {
      const result = await this.tokenService.remove(userId);
      console.log("aaa", result);
      response.status(200).json(result);
    } catch (error) {
      console.error(`Validation Error: ${error.message}`);
      response.status(401).json({ error: "Unauthorized" });
    }
  };
}

export default UserController;
