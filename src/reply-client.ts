import { MessageBuilder } from './util/message-builder';
import { MessageModel } from './angie/gitter.models';
import { Observable } from 'rxjs';
import {CommandNode} from './command-tree/command.models';

export interface ReplyClient {
  commandSubtree: CommandNode;
}
