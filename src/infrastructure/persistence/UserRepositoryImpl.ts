import UserModel from "./models/UserSchema";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";

export class UserRepositoryImpl implements IUserRepository {
  async create(user: User): Promise<User> {
    const created = await UserModel.create(user);
    return created.toObject();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({ email }).lean();
  }
}
