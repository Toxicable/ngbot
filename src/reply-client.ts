import { Model } from './angie/gitter';
import { Observable } from 'rxjs';

export interface ReplyClient {
  getReply(message: Model): string;
  getGlobal(message: Model): string;
}
