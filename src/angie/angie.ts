import { ReplyClient } from '../reply-client';
import { Observable, Subscription } from 'rxjs';
import { Http } from '../util/http';
import { GitterClient, Message, MessageModel, User, Room } from './gitter';
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
    private gitter: GitterClient = new Gitter(token), ) {
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
          .do(message => this.handleIncomingMessage(room, message));

      })
      .subscribe(() => { },
      error => console.log('ERROR: ' + error));
  }


  handleIncomingMessage(room: Room, message: MessageModel) {
    let replyText = this.getReply(message);

    if (!replyText) {
      console.log('No reply sent');
      return;
    }
    replyText = this.isProd ? replyText : `DEBUG: ${replyText}`;
    const now = new Date().getTime();
    const timeSinceLastMessage = now - this.lastMessagePostedAt;
    if (timeSinceLastMessage > this.throttleThreshold) {
      room.send(replyText);
      const lastMessagePostedAt = now;
      console.log('Reply sent');
    } else {
      console.log(`Time Threshold hit, the last message was sent ${this.throttleThreshold} ago`);
    }
  }


  getReply(message: MessageModel): string {
    const text = message.text.toLowerCase();
    const textParts = text.split(' ');

    // globals
    const globalReply = this.clients.map(c => c.getGlobal(message)).filter(msg => !!msg);
    if (globalReply.length > 0) {
      return globalReply[0];
    }

    if (textParts[0] === 'angie') {

      const reply = this.clients.map(c => c.getReply(message)).filter(msg => !!msg);
      if (reply.length > 0) {
        return reply[0];
      }

    }
  }

}
