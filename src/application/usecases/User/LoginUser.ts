import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { User } from "../../../domain/entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class LoginUser {
  private jwtSecret: string;

  constructor(private userRepository: IUserRepository) {
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  }

  async execute(email: string, password: string): Promise<{ success: Boolean, token: string, user:any }> {
    let user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Mot de passe incorrect");
    }

    const safeUser = { ...user } as any;
    delete safeUser.password;
    delete safeUser.key;
    

    const id = (user._id || (user as any)._id) as string;


    // ✅ Mettre à jour le champ `online` à true
    const updatedUser = await this.userRepository.update(id, { online: true });
    if (!updatedUser) {
      throw new Error("Impossible de mettre à jour le statut de l'utilisateur");
    }

    const token = jwt.sign(
      { id: updatedUser._id, email: updatedUser.email },
      this.jwtSecret,
      { expiresIn: '1h' }
    );

    return { success: true, token, user:safeUser}
  }
}
