import { MessageModel } from './../bot/gitter.models';
import { events } from './events';
import { Event } from './events.models';
import { MessageBuilder } from '../util/message-builder';
import { CommandClient } from '../reply-client';
import { CommandNode, CommandNodeBuilder } from '../command-tree/command-decoder2';
import { getQuery } from "../util/string-helpers";


export class EventsClient implements CommandClient {

  private mb: MessageBuilder = new MessageBuilder();
  events: Event[];

  constructor(
    fallback?: Event[]
  ) {
    this.events = fallback || events;
    this.eventsList = `Events for this year include ${this.events.map(e => `[${e.name}](${e.link})`).join(', ')}.`;
    this.commandNode = new CommandNodeBuilder()
      .withCommand(/(events|event)/, msg => this.mb.message(this.eventsList))
      .withName('events')
      .withChild(b => b.withCommand(/\w/, this.command))
      .toNode();
  }

  commandNode: CommandNode;

  private eventsList: string;

  private command = (msg: MessageModel) => {
    const query = getQuery(this.commandNode.matcher, msg.text);

    if(!query){
      return this.mb.message(this.eventsList);
    }

    const event = this.events.find(e => e.name.toLowerCase() === query.toLowerCase());

    if (!event) {
      return this.mb.message(`Oops! :flushed: I don't know about an event named _${query}_.`);
    }

    return this.mb.message(`[${event.name}](${event.link}): located at ${event.location} ${event.date.toDateString()}`);
  }
}
