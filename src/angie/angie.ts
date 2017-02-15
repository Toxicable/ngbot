import { ReplyClient } from './../reply-client';
import { Observable, Subscription } from 'rxjs';
import { Http } from '../util/http';
import { GitterClient, Message, Model, User, Room } from './gitter';
import * as Gitter from 'node-gitter';

export class Angie {

  private botId: string;
  private gitterSub: Subscription;
  private botKeyWord = 'angie';
  private lastMessagePostedAt: number = null;


  constructor(
    private token: string,
    private roomName: string,
    private isProd: boolean,
    private clients: ReplyClient[],
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

  handleIncommingMessage(room: Room, message: Model) {
    let replyText = this.getReply(message)

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
    const globalReply = this.clients.map(c => c.getGlobal(text)).filter(obs => !!obs);
    if (globalReply.length > 0) {
      return globalReply[0];
    }


    if (this.getTextPart(textParts, 0) === 'angie') {


      if (text.includes('hello')) { //personal message them
        return `@${message.fromUser.username}: Hello!`;
      }

      const reply = this.clients.map(c => c.getReply(text)).filter(obs => !!obs);
      if (reply.length > 0) {
        return reply[0];
      }

    }
  }

  private getTextPart(text: string[], index: number) {
    return text.length > index ? text[index] : null;
  }
}
