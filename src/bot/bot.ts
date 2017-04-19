import { MessageBuilder } from './../util/message-builder';
import { CommandNodeBuilder, CommandNode, CommandDecoder2 } from './../command-tree/command-decoder2';
import { AnalyzerClient, CommandClient } from './../reply-client';
import { ParsingObject } from '../command-tree/command.models';
import { Observable, Subscription } from 'rxjs';
import { Http } from '../util/http';
import { GitterClient, Message, MessageModel, User, Room } from './gitter.models';
import * as Gitter from 'node-gitter';

export class Bot {

  private botId: string;
  private gitterSub: Subscription;
  private lastMessagePostedAt: number = null;
  private decoder: CommandDecoder2;
  private throttleThreshold = 250;
  private gitter: GitterClient;
  private commandNode: CommandNode;

  constructor(private config: BotConfig) {
    this.start();
  }


  private start() {
    this.commandNode = new CommandNodeBuilder()
      .withCommand(/(ngbot|ng bot)/, (msg) => {
        return new MessageBuilder()
          .message(`Hello, I'm ngbot. The current areas you can ask me about are: ${
            this.config.replyClients.map(c => `\`c.commandNode.name\``).join(', ')
          }.`)
      })
      .withChildren(this.config.replyClients.map(client => client.commandNode))
      .toNode();

    this.decoder = new CommandDecoder2(this.commandNode);

    this.gitter = new Gitter(this.config.token);

    this.gitterSub = Observable.fromPromise(this.gitter.currentUser())
      .do((user: User) => this.botId = user.id)
      .flatMap((user: User) => Observable.fromPromise(this.gitter.rooms.join(this.config.roomName)))
      .flatMap(room => {
        console.log(`Room: ${room.name} ready!`);
        room.send('Good morning, Angular people! :sunny:');
        const events = room.streaming().chatMessages();
        return Observable.fromEvent<Message>(events, 'chatMessages')
          .filter(message => message.operation === 'create')
          .map(message => message.model)
          .filter(message => message.fromUser.id !== this.botId || message.text.includes('test'))
          .do(message => this.handleIncomingMessage(room, message));

      })
      .subscribe();
  }


  private handleIncomingMessage(room: Room, message: MessageModel): void {
    let replyText = this.getReply(message);

    if (!replyText) {
      console.log('No reply sent');
      return;
    }
    replyText = this.config.isProd ? replyText : `DEBUG: ${replyText}`;
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


  public getReply(message: MessageModel): string {
    const analyzerReply = this.config.analyzerClients.map(c => c.getReply(message)).filter(mb => !!mb);
    //TODO: use cooler syntax to do this :D
    if (analyzerReply.length > 0) {
      return analyzerReply[0].toString();
    }
    if (!this.commandNode.matcher.test(message.text)) {
      return null;
    }
    const response = this.decoder.processMessage(message);


    if (response) {
      return response.toString();
    } else {
      return `Sorry, I'm not sure what you wanted from me.`;
    }
  }
}

export interface BotConfig {
  token: string;
  roomName: string;
  isProd: boolean;
  replyClients: CommandClient[];
  analyzerClients: AnalyzerClient[];

}
