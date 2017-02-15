import { Model } from './../angie/gitter';
import { Observable } from 'rxjs';
import { replies } from './replies';
import { ReplyClient } from './../reply-client';

export class StoredReplyClient implements ReplyClient {

  replies: { [key: string]: string };

  constructor(
  ) {
    this.replies = replies;
  }

  getGlobal(message: Model) {
    const text = message.text
    if (text.includes('angular3') || text.includes('angular 3')) {
      return this.replies['angular3'];
    }
    return null;
  }

  getReply(message: Model): string {
    const text = message.text

    if (text.includes('help')) { //personal message them
      return 'Topics you can ask me about:' + Object.keys(this.replies).join(', ') + '. You can also as me for links to the docs with `angie docs`'
    }

    const key = Object.keys(this.replies)
      .find(key => key.toLowerCase()
        .split(' ')
        //check to see if each part of the users message is in the key
        .every(part => text.includes(part))
      );

    const reply = key ? this.replies[key] : this.replies['noStoredReply'];
    return reply;
  }

}
