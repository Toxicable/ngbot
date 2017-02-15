import {MessageBuilder} from '../util/message-builder';
import {MessageModel} from '../angie/gitter';
import {ReplyClient} from '../reply-client';
import {Analyzer} from './analyzer';
import {getTextOutsideCodeBlocks} from '../util/formatting';


export class AnalyzerClient implements ReplyClient {
  constructor(private analyzer = new Analyzer(),
              private mb = new MessageBuilder()) {
  }

  getReply(message: MessageModel) {
    return null;
  }

  getGlobal(message: MessageModel) {
    const isCode = this.analyzer.isCode(getTextOutsideCodeBlocks(message.text));
    if (isCode) {
      return this.mb
        .message('yo, there\'s code in that dude')
        .tag(message.fromUser.displayName)
        .toString();
    }
  }

}
