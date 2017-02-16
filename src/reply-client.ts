import { MessageBuilder } from './util/message-builder';
import { MessageModel } from './angie/gitter';
import { Observable } from 'rxjs';

export interface ReplyClient {
  getReply(message: MessageModel): MessageBuilder;
  getGlobal(message: MessageModel): MessageBuilder;
}
