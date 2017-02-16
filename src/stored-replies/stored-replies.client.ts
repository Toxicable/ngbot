import { StoredReply } from './stored-reply';
import { MessageBuilder } from './../util/message-builder';
import { MessageModel } from '../angie/gitter';
import { replies } from './replies';
import { ReplyClient } from '../reply-client';


export class StoredReplyClient implements ReplyClient {

  replies: StoredReply[];

  constructor(
    private mb = new MessageBuilder()
  ) {
    this.replies = replies;
  }

  getGlobal(message: MessageModel) {
    const text = message.text;
    if (text.includes('angular3') || text.includes('angular 3')) {
      return this.mb.message(this.replies['angular3']);
    }

    if (text.includes('hello')) {
      return this.mb.message(`@${message.fromUser.username}: Hello!`);
    }
    return null;
  }

  getReply(message: MessageModel): MessageBuilder {
    const text = message.text;

    if (text.includes('help')) {
      return this.mb.message(
        'Topics you can ask me about:' + this.replies.map(r => r.keys.join(' ')).join(', ') +
        '. You can also as me for links to the docs with `angie docs`.'
      );
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
