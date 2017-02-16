import { events } from './events';
import { Event } from './event';
import { MessageBuilder } from './../util/message-builder';
import { MessageModel } from './../angie/gitter';
import { ReplyClient } from './../reply-client';
export class EventsClient implements ReplyClient {

  events: Event[];

  constructor(
    private mb: MessageBuilder = new MessageBuilder(),
  ) {
    this.events = events;
  }


  getReply(message: MessageModel) {
    return null;
  }
  getGlobal(message: MessageModel) {
    const textParts = message.text.split(' ');

    if (textParts[1] === 'events') {
      if (textParts[2] === 'help') {
        return this.mb.message('You can see all with `angie events`, for specific events use `angie events {eventName}`');
      }

      if (!textParts[2]) {
        const upcommingEvents = this.events.map(e => `[${e.name}](${e.link})`).join(', ');
        return this.mb.message(`Events for this year include ${upcommingEvents}`).toString();
      }

      if (textParts[2]) {
        const eventName = textParts[2];
        const event = this.events.find(e => e.name.toLowerCase() === eventName.toLowerCase());

        if (!event) {
          return this.mb.message(`Sorry I wasn't able to find that event`);
        }

        return this.mb.message(`[${event.name}](${event.link}): located at ${event.location} ${event.date.toDateString()}`).toString();
      }
    }
  }
}
