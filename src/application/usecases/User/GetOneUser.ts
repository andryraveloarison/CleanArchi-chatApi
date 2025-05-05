import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { User } from "../../../domain/entities/User";

export class GetOneUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<Partial<User> | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;

    const { password, key, ...safeUser } = user;
    return safeUser;
  }
}
