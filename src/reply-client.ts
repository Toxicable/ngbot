import { Model } from './angie/gitter';
import { Observable } from 'rxjs';

export interface ReplyClient {
  getReply(messages: string): string;
  getGlobal(message: string): string;
}
