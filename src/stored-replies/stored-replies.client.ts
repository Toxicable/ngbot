import { Observable } from 'rxjs';
import { replies } from './replies';
import { ReplyClient } from './../reply-client';

export class StoredReplyClient implements ReplyClient {

  replies: { [key: string]: string };

  constructor(
  ) {
    this.replies = replies;
  }

  getGlobal(message: string) {
    if (message.includes('angular3') || message.includes('angular 3')) {
      return this.replies['angular3'];
    }
    return null;
  }

  getReply(message: string): string {

    if (message.includes('help')) { //personal message them
      return 'Topics you can ask me about:' + Object.keys(this.replies).join(', ') + '. You can also as me for links to the docs with `angie docs`'
    }

    const key = Object.keys(this.replies)
      .find(key => key.toLowerCase()
        .split(' ')
        //check to see if each part of the users message is in the key
        .every(part => message.includes(part))
      );

    const reply = key ? this.replies[key] : this.replies['noStoredReply'];
    return reply;
  }

}
