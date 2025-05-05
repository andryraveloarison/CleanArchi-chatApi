import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { User } from "../../../domain/entities/User";
import bcrypt from "bcrypt";
import { generateKeyPairSync } from "crypto";

export class CreateUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(user: User): Promise<{privateKey: string, success: Boolean}> {
    // Hachage du mot de passe
    user.password = await bcrypt.hash(user.password, 10);

    // Génération de la paire de clés RSA
    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });

    // Stockage de la clé publique dans l'utilisateur
    user.key = publicKey;

    // 🔐 Optionnel : tu peux aussi retourner la clé privée pour que le client la stocke
    const createdUser = await this.userRepository.create(user);

    return {
      success:true,
      ...createdUser,
      privateKey, // à envoyer au client (non stocké en base de données)
    };
  }
}
