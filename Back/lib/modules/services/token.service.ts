import jwt from "jsonwebtoken";
import TokenModel from "../schemas/token.schema";
import { config } from "../../config";

class TokenService {
  public async create(user: any) {
    const access = "auth";
    const userData = {
      userId: user.id,
      name: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
      access: access,
    };

    const value = jwt.sign(userData, config.JwtSecret, {
      expiresIn: "3h",
    });

    try {
      const result = await new TokenModel({
        userId: user.id,
        type: "authorization",
        value,
        createDate: new Date().getTime(),
      }).save();
      if (result) {
        return result;
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas tworzenia danych:", error);
      throw new Error("Wystąpił błąd podczas tworzenia danych");
    }
  }

  public getToken(token: any) {
    return { token: token.value };
  }

  public async remove(userId: string) {
    console.log(userId);
    try {
      const result = await TokenModel.deleteOne({ userId: userId });
      console.log("result", result);
      return result;
    } catch (error) {
      console.error("Error while removing token:", error);
      throw new Error("Error while removing token");
    }
  }
}

export default TokenService;
