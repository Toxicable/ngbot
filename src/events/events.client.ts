import { MessageModel } from './../angie/gitter.models';
import {events} from './events';
import {Event} from './events.models';
import {MessageBuilder} from '../util/message-builder';
import {ReplyClient} from '../reply-client';
import {CommandNode} from '../command-tree/command.models';


export class EventsClient implements ReplyClient {

  events: Event[];

  constructor(private mb: MessageBuilder = new MessageBuilder(),
              fallback?: Event[]) {
    if (fallback) {
      this.events = fallback;
    } else {
      this.events = events;
    }
  }

  public commandSubtree: CommandNode = {
    name: 'events',
    regex: /events/i,
    fn: () => {
      const upcomingEvents = this.events.map(e => `[${e.name}](${e.link})`).join(', ');
      return this.mb.message(`Events for this year include ${upcomingEvents}`);
    },
    help: `List all events that I'm aware about`,
    children: [
      {
        name: ':query',
        regex: null,
        children: null,
        help: `Find out details about a specific event`,
        fn: (msg: MessageModel, query?: string) => {
          const event = this.events.find(e => e.name.toLowerCase() === query.toLowerCase());

          if (!event) {
            return this.mb.message(`Oops! :flushed: I don't know about an event named _${query}_.`);
          }

          return this.mb.message(`[${event.name}](${event.link}): located at ${event.location} ${event.date.toDateString()}`);
        },
      }
    ]
  };

}
