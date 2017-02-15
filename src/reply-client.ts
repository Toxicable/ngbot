import { MessageModel } from './angie/gitter';
import { Observable } from 'rxjs';

export interface ReplyClient {
  getReply(message: MessageModel): string;
  getGlobal(message: MessageModel): string;
}
