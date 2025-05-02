import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import bcrypt from "bcrypt";

export class CreateUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(user: User): Promise<User> {
    user.password = await bcrypt.hash(user.password, 10);
    return await this.userRepository.create(user);
  }
}
