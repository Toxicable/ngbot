import {MessageBuilder} from '../util/message-builder';
import {Model} from '../angie/gitter';
import {ReplyClient} from '../reply-client';
import {Analyzer} from './analyzer';
import {getTextOutsideCodeBlocks} from '../util/formatting';


export class AnalyzerClient implements ReplyClient {
  constructor(private analyzer = new Analyzer(),
              private mb = new MessageBuilder()) {
  }

  getReply(message: Model) {
    return null;
  }

  getGlobal(message: Model) {
    const isCode = this.analyzer.isCode(getTextOutsideCodeBlocks(message.text));
    if (isCode) {
      return this.mb
        .message('yo, there\'s code in that dude')
        .tag(message.fromUser.displayName)
        .toString();
    }
  }

}
