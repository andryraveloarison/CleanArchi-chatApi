import { IMessageRepository } from "../../../domain/repositories/IMessageRepository";
import { Message } from "../../../domain/entities/Message";

export class GetMessagesBetweenUsers {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(userId1: string, userId2: string): Promise<Message[]> {
    return await this.messageRepository.findMessagesBetweenUsers(userId1, userId2);
  }
}
