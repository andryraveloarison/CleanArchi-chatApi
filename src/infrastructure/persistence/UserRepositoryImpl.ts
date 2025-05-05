import UserModel from "./models/UserSchema";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";

export class UserRepositoryImpl implements IUserRepository {

  async findAll(): Promise<User[]> {
    const users = await UserModel.find();
    return users.map(user => user.toObject());
  }

  async create(user: User): Promise<User> {
    const created = await UserModel.create(user);
    return created.toObject();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({ email }).lean();
  }


  async findById(id: string): Promise<User | null> {
    return await UserModel.findOne({ _id: id }).lean();
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    return await UserModel.findByIdAndUpdate(id, userData, { new: true }).lean();
  }
  

}
