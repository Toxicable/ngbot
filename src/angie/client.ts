import { Observable, Subscription } from 'rxjs';
import { Http } from './http';
import { GitterClient, Message, Model, User, Room } from '../models/gitter';
import { ApiModule, Api } from '../models/api-docs-module';
import * as Gitter from 'node-gitter';

export class Angie {

  private botId: string;
  private gitterSub: Subscription;
  private botKeyWord = 'angie';
  private lastMessagePostedAt: number = null;
  private replies: string[];
  private api: Api[];

  constructor(
    private token: string,
    private roomName: string,
    private docsApiUrl: string,
    private isProd: boolean,
    private throttleThreshold = 250,
    private http = new Http(),
    private gitter: GitterClient = new Gitter(token),
  ) {
    this.start();
  }

  start() {
    this.gitterSub = Observable.fromPromise(this.gitter.currentUser())
      .do((user: User) => this.botId = user.id)
      .flatMap((user: User) => Observable.fromPromise(this.gitter.rooms.join(this.roomName)))
      .flatMap(room => {
        console.log(`Room: ${room.name} ready!`);
        const events = room.streaming().chatMessages();
        return Observable.fromEvent<Message>(events, 'chatMessages')
          .filter(message => message.operation === 'create')
          .map(message => message.model)
          .filter(message => message.fromUser.id !== this.botId || message.text.includes('test'))
          .do(message => this.handleIncommingMessage(room, message))

      })
      .subscribe(() => { },
      error => console.log('ERROR: ' + error));
  }



  docs() {
    this.http.get<ApiModule>(this.docsApiUrl).subscribe(docs => {
      this.apis = Object.keys(docs)
        .map(key => docs[key])
        //flatten out the modules into a single list of API's
        .reduce((a, b) => [...a, ...b], [])
    });
  }



  handleIncommingMessage(room: Room, message: Model) {
    let replyText = this.getReply(message);
    if (!replyText) {
      console.log('No reply sent');
      return;
    }
    //replyText = ;
    replyText = this.isProd ? replyText : `DEBUG: ${replyText}`;
    let now = new Date().getTime();
    let timeSinceLastMessage = now - this.lastMessagePostedAt;
    if (timeSinceLastMessage > this.throttleThreshold) {
      room.send(replyText);
      let lastMessagePostedAt = now;
      console.log('Reply sent')
    } else {
      console.log(`Time Threshold hit, the last message was sent ${this.throttleThreshold} ago`)
    }
  }


  getReply(message: Model): string {
    let text = message.text.toLowerCase();
    const textParts = text.split(' ');

    //globals
    if (text.includes('angular3') || text.includes('angular 3')) {
      return this.replies['angular3'];
    }

    if (this.getTextPart(textParts, 0) === 'angie') {

      if (text.includes('help')) { //personal message them
        return 'Topics you can ask me about:' + Object.keys(this.replies).join(', ') + '. You can also as me for links to the docs with `angie docs`'
      }
      if (text.includes('hello')) { //personal message them
        return `@${message.fromUser.username}: Hello!`;
      }

      if (this.getTextPart(textParts, 1) === 'docs') {
        return this.getDocsApiReply(text);
      }

      return this.getStoredReply(text);

    }
  }

  private getTextPart(text: string[], index: number) {
    return text.length > index ? text[index] : null;
  }


  private getStoredReply(message: string) {

    const key = Object.keys(this.replies)
      .find(key => key.toLowerCase()
        .split(' ')
        //check to see if each part of the users message is in the key
        .every(part => message.includes(part))
      );

    return key ? this.replies[key] : this.replies['noStoredReply'];
  }


  private getDocsApiReply(message: string) {
    let matchedApi = this.apis.find(api => message.includes(api.title.toLowerCase()));

    return matchedApi ? this.docsApiUrl + '/' + matchedApi.path : `Unable to find docs for: ${message}`;
  }

}
