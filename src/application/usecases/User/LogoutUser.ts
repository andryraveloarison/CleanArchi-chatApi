import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export class LogoutUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<{ success: boolean; message: string }> {
    const updatedUser = await this.userRepository.update(userId, { online: false });

    if (!updatedUser) {
      throw new Error("Impossible de mettre à jour le statut de l'utilisateur");
    }

    return {
      success: true,
      message: "Déconnexion réussie",
    };
  }
}
