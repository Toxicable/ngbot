import { MessageBuilder } from './util/message-builder';
import { MessageModel } from './bot/gitter.models';
import { Observable } from 'rxjs';
import {CommandNode} from './command-tree/command-decoder2';

export interface CommandClient {
  commandNode: CommandNode;
}

export interface AnalyzerClient {
  getReply(msg: MessageModel): MessageBuilder;
}
