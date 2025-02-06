import bcrypt from "bcrypt";
import PasswordModel from "../schemas/password.schema"; // Dodajemy import PasswordModel

class PasswordService {
  public async hashPassword(password: string): Promise<string> {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      console.error("Błąd podczas haszowania hasła:", error);
      throw new Error("Błąd podczas haszowania hasła");
    }
  }

  // Metoda 'authorize' do porównywania surowego hasła z zahaszowanym
  public async authorize(
    userId: string,
    inputPassword: string
  ): Promise<boolean> {
    try {
      const userPasswordRecord = await PasswordModel.findOne({ userId });
      if (!userPasswordRecord) {
        throw new Error("Password record not found");
      }

      // Compare the input password directly with the stored hashed password
      const isMatch = await bcrypt.compare(
        inputPassword,
        userPasswordRecord.password
      );
      return isMatch;
    } catch (error) {
      console.error("Error while authorizing password:", error);
      throw new Error("Error while authorizing password");
    }
  }

  // Tworzenie lub aktualizacja hasła w kolekcji 'passwords'
  public async createOrUpdate(passwordData: {
    userId: string;
    password: string;
  }) {
    try {
      const existingPassword = await PasswordModel.findOne({
        userId: passwordData.userId,
      });

      if (existingPassword) {
        // Jeśli użytkownik już ma zapisane hasło, aktualizujemy je
        existingPassword.password = passwordData.password;
        await existingPassword.save();
      } else {
        // Jeśli użytkownik nie ma zapisanego hasła, dodajemy nowe
        const newPassword = new PasswordModel(passwordData);
        await newPassword.save();
      }
    } catch (error) {
      console.error("Błąd podczas zapisywania hasła:", error);
      throw new Error("Błąd podczas zapisywania hasła");
    }
  }
}

export default PasswordService;
