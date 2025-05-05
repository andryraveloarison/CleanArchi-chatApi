import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { User } from "../../../domain/entities/User";

export class GetAllUsers {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<Partial<User>[]> {
    const users = await this.userRepository.findAll();

    return users.map(({ password, key, ...rest }) => rest);
  }
}
