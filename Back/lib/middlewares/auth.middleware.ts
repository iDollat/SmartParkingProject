import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { IUser } from "../modules/models/user.model"; // Import modelu IUser

export const auth = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  let token =
    request.headers["x-access-token"] || request.headers["authorization"];

  if (token && typeof token === "string") {
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    jwt.verify(token, config.JwtSecret, (err, decoded) => {
      if (err) {
        return response.status(400).send("Nieprawidłowy token.");
      }
      const user: IUser = decoded as IUser;
      const userId = user._id;
      next();
    });
  } else {
    return response.status(401).send("Dostęp zabroniony. Brak tokenu.");
  }
};
