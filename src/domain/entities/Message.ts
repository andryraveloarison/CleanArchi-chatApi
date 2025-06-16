export interface Message {
  id?: string;
  senderId: string;
  receiverId: string;
  content?: {
    forReceiver: string;
    forSender: string;
  };
  timestamp: Date;
}
