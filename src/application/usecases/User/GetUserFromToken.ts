// application/use-cases/user/GetUserFromToken.ts
import jwt from "jsonwebtoken";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export class GetUserFromToken {
  constructor(
    private userRepository: IUserRepository,
    private jwtSecret: string
  ) {}

  async execute(token: string) {
    try {
      const payload = jwt.verify(token, this.jwtSecret) as { id: string };
      const user = await this.userRepository.findById(payload.id);
      if (!user) {
        throw new Error("Utilisateur non trouvé");
      }
      return user;
    } catch (error) {
      throw new Error("Token invalide");
    }
  }
}
