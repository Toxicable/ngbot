export interface GitterClient {
  currentUser(): Promise<User>;
  rooms: RoomClient;
}
export interface RoomClient{
  join(roomName: string): Promise<Room>
}
export interface Room {
  streaming(): Stream
  send(message: string): void;
  name: string;
}

export interface Stream{
  chatMessages(): EventTarget;
}


export interface Message {
  operation: string;
  model: Model;
}
export interface Model {
  id: string;
  text: string;
  html: string;
  sent: string;
  fromUser: User;
  unread: boolean;
  readyBy: number;
  urls: string[];
  mentions: any[];
  issues: any[];
  meta: any[];
  v: number;
}
export interface User {
  id: string;
  username: string;
  displayName: string;
  url: string;
  avatarUrl: string;
  avatarUrlSmall: string;
  avatarUrlMedium: string;
  v: number;
  gv: string
}
