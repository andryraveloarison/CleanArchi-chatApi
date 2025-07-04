import MessageModel from "./models/MessageSchema";
import { IMessageRepository, toDomainMessage } from "../../domain/repositories/IMessageRepository";
import { Message } from "../../domain/entities/Message";
import CryptoJS from "crypto-js"; 


export class MessageRepositoryImpl implements IMessageRepository {

  async findMessagesInvolvingUser(userId: string): Promise<Message[]> {
    const docs = await MessageModel.find({
      $or: [
        { receiverId: userId },
        { senderId : userId}
      ]
    })
      .sort({ timestamp: -1 })
      .populate({
        path: "senderId",
        select: "username photo", // <- s'assurer que photo ET username sont récupérés
      })
      .lean();

  
    return docs.map(toDomainMessage);
  }
  

  
  async save(message: Message): Promise<Message> {
    const created = await MessageModel.create(message);
    return created.toObject();
  }

  async getAll(): Promise<Message[]> {
    return await MessageModel.find().lean();
  }

  async findMessagesBetweenUsers(userId1: string, userId2: string): Promise<any[]> {
      
  // Ton message chiffré en base64

  const private_key = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDqsTt5Dv3r3ORB\n9JZcHYYafcEAdCKr60T2YKgETiA5YSnI32S4zmjdZxWnkph/9Jr5ZE+x/eAfZDlb\nhQphRxDofdm0EPZVkwFXEJJS0XaoThsmo8LtPzEBSQQd/wGf1akI4D8n7OZmd2MQ\nIYAF1EkDQi6atOK9CPLwg+TJn5/Z/HmW7bxJg7wvfvPrerFhUdYSA3kHN2z+bNRI\nLnMPYzJiuRFDRTE8OadezhkQYIdlkAf1JBr1BJYDIb/xlw9fyuLf0bktpMDAXxYK\nqzsQi/913+VWQ9cNlN6FUuQZvrRaqpk/mX5JRSZOwbQ9K+Gfe1UK6sUxFN2A1deH\nhp9lIcBRAgMBAAECggEAGs+6ip7y1UI79Wj60HUy/83EAchCub879qWeLDe8qLF3\n85HJ0O8Lvddr+uPddii8l6clD6GAPDXX86OkRu62eMj/2PljGu2bZpXnEX0KgDnE\nEkr9Ftt0PsBXrxGV3uuqzu/HZ0lCHQygjZQ2KvRQjwW9i0EE8jGWh3GZ7orE2UMt\nohXR0tL5REV0X7hIJGqBJ2cZcAOxMLed31jYZ/gRDGW+rQZLkZlhidceTkpecli+\nLdd5/llEYP1pGWD6krBvLCaErAaifTV5EnDomrZUwCMvqN0MtJpfRPGmZMmRamCb\naLKkgs6EfkGzLVhEMYyJLoi19Tx/RcF4zGxe3UPIzQKBgQD4oxrGDewFXDS2B32P\nUF+vJTXeS5kMe7LlHzSgLUFFVfB52CyIyihrn2NOFR2rkhLNfPSPuIItmF1zNcAw\nTwPfb+/2dUsIg+COTBmJP1wWBCA8leYKgHP/YbcfMSOCB55cnirAjNDFd65nWto9\nbQFqBeiHcrIc8imHirZ/I18jGwKBgQDxpGnSncQ61aio3443jKq0R8fvFQci2O61\nGi4c2ShsBn/K/RmG1n4h0nljXSprg16S597a4Hz7BrE3nCPf7oQjLpWnanMBLKoU\n/zpdehnOwhG6diTq0tguuomRMcebF6eMA/CQNd8eCReyQ3qnc6gWVtXXpXpco0zL\nJyM9Bnt1AwKBgQDbXxU9T4VByXPcc0luDA0QPDWGF49Gu1FA5MKK3MLtCQEuj/Pj\nEPKO2kdE2k6eVThvw2MH91QsJHW3M+KI/P4+wsWm3yA/uBOFmVEijhuSdTt4GQ2p\nkGJIHg/y3mkkzdIEh6zSzKtavtjK6hcKAUYxJFtgPms2LNdFdrbEABJtpwKBgEeE\n1wFMSpjzReD9kbUlQBztpeJAQgVxWW1mm0FUkJ8waUBmGtkKwPg3uE/NclGx5xrp\n386+ZJ9Tgr4ny4JqsNdM4WRUoEc3tftS8y5ZhivoyqB6eUC7ONrTwQWlSyO/I4rQ\nW7IDD89u94F+cV4AYD6EYvRZeNbUSlVSdx6HvaCLAoGAAcdr5SoEAfBG9MFmzWli\n9gKWUJzSd3PWaB0xm6WU0eUfbi7deM0qjtnD3SI/do5ZQ7w/5MLcSQ5FUb89U8Vc\nv7ffh8B3ocSB29COVVCpdPNAelcjrw/4RAb7nhBJAtZJTJiTh55fBX+uBRVeJnlt\npVcY2Joa8QMM5haKU3S5veY=\n-----END PRIVATE KEY-----\n"

  
  const messages = await MessageModel.find({
    isGroup: false,
    $or: [
      { senderId: userId1, receiverId: userId2 },
      { senderId: userId2, receiverId: userId1 },
    ],
  })
    .sort({ timestamp: 1 })
    .lean();
  
  
    return messages.map((msg) => {
      let decrypted = "message crypté";
  
      try {
        const content = msg.content;
        if (content) {
          const encryptedContent = (msg.senderId.toString() === userId1)
            ? content.forSender
            : content.forReceiver;
  
          if (encryptedContent) {
            const bytes = CryptoJS.AES.decrypt(encryptedContent, private_key);
            const decoded = bytes.toString(CryptoJS.enc.Utf8);
            if (decoded) decrypted = decoded;
          }
        }
      } catch (e) {
        console.error(e)
      }
  
      return {
        ...msg,
        decryptedContent: decrypted,
      };
    });
  }


  async getMessageUserGroup(userId: string, groupId: string): Promise<Message[]> {
    const docs = await MessageModel.find({
      isGroup: true,
      groupId,
      $or: [{ receiverId: userId }],
    })
    .populate({
      path: "senderId",
      select: "username photo", // <- s'assurer que photo ET username sont récupérés
    })
    .sort({ timestamp: 1 })
    .lean();
  
    return docs.map(toDomainMessage);

  }  

    // ✅ findById
    async findById(id: string): Promise<Message | null> {
      return await MessageModel.findById(id);
    }
  
    // ✅ update
    async update(id: string, data: Partial<Message>): Promise<Message | null> {
      return await MessageModel.findByIdAndUpdate(id, data, { new: true });
    }


    async findByIdGroup(groupId: string): Promise<Message[]> {
      const docs = await MessageModel.find({
        $or: [
          { groupId: groupId }       
      ]
      })
        .sort({ timestamp: -1 })
        .populate({
          path: "senderId",
          select: "username photo", // <- s'assurer que photo ET username sont récupérés
        })
        .lean();
  
    
      return docs.map(toDomainMessage);
    }

    async findLastMessageGroupForUser(userId: string): Promise<Message> {
      const docs = await MessageModel.find({
        $or: [
          { senderId: userId },
          { receiverId:  userId}    
      ]
      })
        .sort({ timestamp: -1 })
        .populate({
          path: "senderId",
          select: "username photo", // <- s'assurer que photo ET username sont récupérés
        })
        .lean();
  
    
      return docs.map(toDomainMessage)[0];
    }
}