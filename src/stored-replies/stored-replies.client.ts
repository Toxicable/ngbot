import { AnalyzerClient } from './../reply-client';
import { StoredReply } from './stored-reply.models';
import { MessageBuilder } from './../util/message-builder';
import { MessageModel } from '../angie/gitter.models';
import { replies } from './replies';
import { CommandClient } from '../reply-client';


export class StoredReplyClient implements AnalyzerClient {

  private replies: StoredReply[];
  private mb = new MessageBuilder()

  constructor(
    fallback?: StoredReply[]
  ) {
    this.replies = fallback || replies;
  }

  getReply(message: MessageModel): MessageBuilder {

    const text = message.text;
    //TODO: replace with regex
    if (text.includes('angular3') || text.includes('angular 3')) {
      return this.mb.message(this.replies['angular3']);
    }

    if (text.includes('hello')) {
      return this.mb.message(`@${message.fromUser.username}: Hello!`);
    }
    const reply = this.replies
      .find(r => {
        // TODO: allow for multiple keys
        return r.keys[0].toLowerCase()
          .split(' ')
          // check to see if each part of the users message is in the key
          .every(part => text.includes(part));
      });

    if (reply) {
      return this.mb.message(reply.message);
    } else {
      return this.mb.message(this.replies.find(r => r.keys[0] === 'noStoredReply').message);
    }
  }

}
