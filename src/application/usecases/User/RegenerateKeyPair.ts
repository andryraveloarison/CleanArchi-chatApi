// application/usecases/User/RegenerateKeyPair.ts
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { generateKeyPairSync } from "crypto";
import bcrypt from "bcrypt";

export class RegenerateKeyPair {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string, password: string): Promise<{ privateKey: string }> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("Utilisateur introuvable");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Mot de passe invalide");
    }

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

    user.key = publicKey;
    await this.userRepository.update(userId, user);

    return { privateKey };
  }
}
