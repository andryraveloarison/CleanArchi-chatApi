import { IMessageRepository } from "../../../../domain/repositories/IMessageRepository";

export class GetMessagesByGroupId {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(userId: string, groupId: string): Promise<any[]> {
    return await this.messageRepository.getMessageUserGroup(userId, groupId);
  }
}
