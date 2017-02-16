import { MessageBuilder } from './util/message-builder';
import { MessageModel } from './angie/gitter';
import { Observable } from 'rxjs';
import {CommandNode} from './angie/command-decoder';

export interface ReplyClient {
  commandSubtree: CommandNode;
}
