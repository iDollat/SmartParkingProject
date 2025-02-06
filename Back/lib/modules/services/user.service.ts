import UserModel from "../schemas/user.schema";
import { IUser } from "../models/user.model";
import PasswordService from "./password.service";

class UserService {
  private passwordService: PasswordService;

  constructor() {
    this.passwordService = new PasswordService();
  }

  public async createNewOrUpdate(user: IUser, password: string) {
    try {
      const newUser = new UserModel(user);
      const savedUser = await newUser.save();

      if (password) {
        const hashedPassword = await this.passwordService.hashPassword(
          password
        );
        console.log("Zahaszowane hasło:", hashedPassword); // Logowanie hasła
        await this.passwordService.createOrUpdate({
          userId: savedUser._id.toString(),
          password: hashedPassword,
        });
      }

      return savedUser;
    } catch (error) {
      console.error("Wystąpił błąd podczas tworzenia użytkownika:", error);
      throw new Error("Błąd przy tworzeniu użytkownika");
    }
  }
  public async getByEmailOrPhone(name: string, isEmail: boolean = false) {
    try {
      if (isEmail) {
        // Jeżeli login to email
        const result = await UserModel.findOne({ email: name });
        if (result) {
          return result;
        }
      } else {
        // Jeżeli login to numer telefonu
        const result = await UserModel.findOne({ phone: name });
        if (result) {
          return result;
        }
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas pobierania danych:", error);
      throw new Error("Wystąpił błąd podczas pobierania danych");
    }
  }

  public async login(name: string, password: string) {
    try {
      const user = await this.getByEmailOrPhone(name);
      if (!user) {
        throw new Error("Nie znaleziono użytkownika");
      }

      const isPasswordValid = await this.passwordService.authorize(
        user._id.toString(),
        password
      );
      if (isPasswordValid) {
        return { message: "Zalogowano pomyślnie" };
      } else {
        throw new Error("Niepoprawne hasło");
      }
    } catch (error) {
      console.error("Błąd podczas logowania:", error);
      throw new Error("Wystąpił błąd podczas logowania");
    }
  }
}

export default UserService;
