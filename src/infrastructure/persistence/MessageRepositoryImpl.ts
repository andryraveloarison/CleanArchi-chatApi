import MessageModel from "./models/MessageSchema";
import { IMessageRepository } from "../../domain/repositories/IMessageRepository";
import { Message } from "../../domain/entities/Message";

export class MessageRepositoryImpl implements IMessageRepository {
  async save(message: Message): Promise<Message> {
    const created = await MessageModel.create(message);
    return created.toObject();
  }

  async getAll(): Promise<Message[]> {
    return await MessageModel.find().lean();
  }
}
