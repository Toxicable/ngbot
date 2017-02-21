import { AnalyzerClient } from './../reply-client';
import { ParsingObject } from '../command-tree/command.models';
import { CommandTree } from '../command-tree/command-decoder';
import { Observable, Subscription } from 'rxjs';
import { Http } from '../util/http';
import { GitterClient, Message, MessageModel, User, Room } from './gitter.models';
import * as Gitter from 'node-gitter';

export class Angie {

  private botId: string;
  private gitterSub: Subscription;
  private lastMessagePostedAt: number = null;


  constructor(private token: string,
    private roomName: string,
    private isProd: boolean,
    private commandTree: CommandTree,
    private analyzers: AnalyzerClient[],
    private throttleThreshold = 250,
    private http = new Http(),
    private gitter: GitterClient = new Gitter(token)

  ) {
    if (this.http) {
      this.start();
    }
  }


  private start() {
    this.gitterSub = Observable.fromPromise(this.gitter.currentUser())
      .do((user: User) => this.botId = user.id)
      .flatMap((user: User) => Observable.fromPromise(this.gitter.rooms.join(this.roomName)))
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
      .subscribe(() => {
      },
      error => console.log('ERROR: ' + error));
  }


  private handleIncomingMessage(room: Room, message: MessageModel): void {
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


  public getReply(message: MessageModel): string {

    const analyzerReply = this.analyzers.map(c => c.getReply(message)).filter(mb => !!mb);
    //TODO: use cooler syntax to do this :D
    if (analyzerReply.length > 0) {
      return analyzerReply[0].toString();
    }

    const parsingObject = this.commandTree.getExe(message.text, message);
    if (!parsingObject.error.exists) {
      return parsingObject.commandFn().toString();
    } else {
      if (parsingObject.expected[0] === 'angie') {
        // not even a command, do nothing
        return null;
      } else {
        return this.getErrorDetails(parsingObject);
      }
    }
  }


  private getErrorDetails(o: ParsingObject): string {
    switch (o.error.type) {
      case 'no-match':
        return this.getNoNextMatchErrorDetails(o);
      case 'premature-exit':
        return this.getPrematureExitErrorDetails(o);
    }
  }


  private getPrematureExitErrorDetails(o: ParsingObject): string {
    return `Based on \`${o.collectedCommands.map(c => c.literal)}\` I figured you were actually giving me command ` +
      `for \`${o.collectedCommands.map(c => c.name)}\`, but that's where your command ends.` +
      `I was expecting something of the following: ${o.expected.map(e => `\`${e}\``).join(', ')}. ` +
      `Maybe you made a typo, or my creators @Toxicable and @lazarljubenovic made a mistake creating me! :sweat_smile:`;
  }


  private getNoNextMatchErrorDetails(o: ParsingObject): string {
    return `Based on \`${o.collectedCommands.map(c => c.literal)}\` I figured you were actually giving me command ` +
      `for \`${o.collectedCommands.map(c => c.name)}\`, but I have no idea what you mean by \`${o.remainingCommand}\`. ` +
      `I was expecting something of the following: ${o.expected.map(e => `\`${e}\``).join(', ')}. ` +
      `Maybe you made a typo, or my creators @Toxicable and @lazarljubenovic made a mistake creating me! :sweat_smile:`;
  }


}
