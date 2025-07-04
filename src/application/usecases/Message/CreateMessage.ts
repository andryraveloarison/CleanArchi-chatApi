import { IMessageRepository } from "../../../domain/repositories/IMessageRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { Message } from "../../../domain/entities/Message";
import { publicEncrypt } from "crypto";
import { IGroupRepository } from "../../../domain/repositories/IGroupRepository";

interface mediaInterface {
  image: string | null;
  audio: string | null;
  file: string | null

}
export class CreateMessage {
  constructor(
    private messageRepository: IMessageRepository,
    private userRepository: IUserRepository,
    private groupRepository: IGroupRepository
  ) {}
  async execute(
    senderId: string,
    receiverId: string,
    plainText: string,
    groupId: string,
    media: mediaInterface

  ): Promise<Message | Message[]> {


    if (!receiverId && !groupId) {
      throw new Error("receiverId ou groupId est requis");
    }

  
    const sender = await this.userRepository.findById(senderId);
    if (!sender || !sender.key) throw new Error("Clé publique de l'émetteur introuvable");
  
    // ✅ Message privé
    if (receiverId) {

      const receiver = await this.userRepository.findById(receiverId);

      if (!receiver || !receiver.key) throw new Error("Clé publique du destinataire introuvable");
  
      const encryptedForSender = publicEncrypt(sender.key, Buffer.from(plainText));
      const encryptedForReceiver = publicEncrypt(receiver.key, Buffer.from(plainText));

      const separator = ":::";

      const image = media.image
        ? `${publicEncrypt(sender.key, Buffer.from(media.image)).toString("base64")}${separator}${publicEncrypt(receiver.key, Buffer.from(media.image)).toString("base64")}`
        : null;

      const audio = media.audio
        ? `${publicEncrypt(sender.key, Buffer.from(media.audio)).toString("base64")}${separator}${publicEncrypt(receiver.key, Buffer.from(media.audio)).toString("base64")}`
        : null;

      const file = media.file
        ? `${publicEncrypt(sender.key, Buffer.from(media.file)).toString("base64")}${separator}${publicEncrypt(receiver.key, Buffer.from(media.file)).toString("base64")}`
        : null;
    
  
      const message: Message = {
        senderId,
        receiverId,
        content: {
          forReceiver: encryptedForReceiver.toString("base64"),
          forSender: encryptedForSender.toString("base64"),
        },
        timestamp: new Date(),
        read: false, // ✅ non lu
        image,
        audio,
        file
      };
  
      return await this.messageRepository.save(message);
    }
  
    // ✅ Message de groupe
    if (groupId) {

      const group = await this.groupRepository.findById(groupId); // ⛔ à créer dans le repo
      if (!group || !group.members) throw new Error("Groupe introuvable");
  
      const messages: Message[] = [];
  
      for (const memberId of group.members) {
        const user = await this.userRepository.findById(memberId.id);
        if (!user?.key) continue;

  
        const encryptedForReceiver = publicEncrypt(user.key, Buffer.from(plainText));
        const encryptedForSender = publicEncrypt(sender.key, Buffer.from(plainText));

        const separator = ":::";

        const image = media.image
          ? `${publicEncrypt(sender.key, Buffer.from(media.image)).toString("base64")}${separator}${publicEncrypt(user.key, Buffer.from(media.image)).toString("base64")}`
          : null;
  
        const audio = media.audio
          ? `${publicEncrypt(sender.key, Buffer.from(media.audio)).toString("base64")}${separator}${publicEncrypt(user.key, Buffer.from(media.audio)).toString("base64")}`
          : null;
  
        const file = media.file
          ? `${publicEncrypt(sender.key, Buffer.from(media.file)).toString("base64")}${separator}${publicEncrypt(user.key, Buffer.from(media.file)).toString("base64")}`
          : null;

        const userId = senderId
        const photo = (await this.userRepository.findById(userId))?.photo || "";

  
        const message: Message = {
          senderId,
          groupId,
          isGroup: true,
          senderPhoto: photo,
          receiverId: memberId.id,
          content: {
            forReceiver: encryptedForReceiver.toString("base64"),
            forSender: encryptedForSender.toString("base64"),
          },
          timestamp: new Date(),
          read: false,
          readBy: [{userId, photo}], // ✅ Si le destinataire est l’expéditeur, il a déjà lu
          image,
          audio,
          file
        };
  
        messages.push(await this.messageRepository.save(message));

      }
  
      return messages;
    }
  
    throw new Error("Invalid input");
  }
  
}
