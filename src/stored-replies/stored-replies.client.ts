import {MessageModel} from '../angie/gitter';
import {replies} from './replies';
import {ReplyClient} from '../reply-client';


export class StoredReplyClient implements ReplyClient {

  replies: {[key: string]: string};

  constructor() {
    this.replies = replies;
  }

  getGlobal(message: MessageModel) {
    const text = message.text;
    if (text.includes('angular3') || text.includes('angular 3')) {
      return this.replies['angular3'];
    }
    return null;
  }

  getReply(message: MessageModel): string {
    const text = message.text;

    if (text.includes('help')) { //personal message them
      return 'Topics you can ask me about:' + Object.keys(this.replies).join(', ') +
        '. You can also as me for links to the docs with `angie docs`.'
    }

    const key = Object.keys(this.replies)
      .find(key => {
        return key.toLowerCase()
          .split(' ')
          //check to see if each part of the users message is in the key
          .every(part => text.includes(part))
      });

    let reply: string;
    if (key) {
      reply = this.replies[key];
    } else {
      reply = this.replies['noStoredReply'];
    }
    return reply;
  }

}
