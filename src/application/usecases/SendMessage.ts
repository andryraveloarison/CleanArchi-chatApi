import { IMessageRepository } from "../../domain/repositories/IMessageRepository";
import { Message } from "../../domain/entities/Message";

export class SendMessage {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(message: Message): Promise<Message> {
    return await this.messageRepository.save(message);
  }
}
