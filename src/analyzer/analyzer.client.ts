import {MessageBuilder} from '../util/message-builder';
import {MessageModel} from '../angie/gitter.models';
import {Analyzer} from './analyzer';
import {getTextOutsideCodeBlocks} from '../util/formatting';


export class AnalyzerClient {

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
        .tag(message.fromUser.displayName);
    }
  }

}
