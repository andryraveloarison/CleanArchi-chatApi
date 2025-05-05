import { IMessageRepository } from "../../../domain/repositories/IMessageRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { Message } from "../../../domain/entities/Message";
import { publicEncrypt } from "crypto";

export class CreateMessage {
  constructor(
    private messageRepository: IMessageRepository,
    private userRepository: IUserRepository
  ) {}

  

  async execute(senderId: string, receiverId: string, plainText: string): Promise<Message> {
    // Récupérer la clé publique du receiver
    const receiver = await this.userRepository.findById(receiverId);
    if (!receiver || !receiver.key) {
      throw new Error("Clé publique du destinataire introuvable");
    }

    // Récupérer la clé publique de l'émetteur (sender)
    const sender = await this.userRepository.findById(senderId);
    if (!sender || !sender.key) {
      throw new Error("Clé publique de l'émetteur introuvable");
    }

    // Chiffrer le message avec la clé publique du destinataire
    const encryptedForReceiver = publicEncrypt(receiver.key, Buffer.from(plainText));

    // Chiffrer le message également avec la clé publique de l'émetteur
    const encryptedForSender = publicEncrypt(sender.key, Buffer.from(plainText));

    // Stocker le message chiffré
    const encryptedContent = {
      forReceiver: encryptedForReceiver.toString("base64"),
      forSender: encryptedForSender.toString("base64")
    };

    const message: Message = {
      senderId,
      receiverId,
      content: encryptedContent,
      timestamp: new Date(),
    };

    return await this.messageRepository.save(message);
  }
}
