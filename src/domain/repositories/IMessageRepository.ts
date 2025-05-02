import { Message } from "../entities/Message";

export interface IMessageRepository {
  save(message: Message): Promise<Message>;
  getAll(): Promise<Message[]>;
}
