import {EventsClient} from '../../src/events/events.client';
import {MessageBuilder} from '../../src/util/message-builder';

import { expect } from 'chai';

describe(`Event Client`, () => {

  const client = new EventsClient(
    [
      {
        name: 'conf-name',
        location: 'conf location',
        date: new Date(0),
        link: 'www.google.com',
      },
      {
        name: 'conf-name-2',
        location: 'conf location',
        date: new Date(1),
        link: 'www.google.rs',
      },
      {
        name: 'conf name with a space',
        location: 'some spacey place',
        date: new Date(2),
        link: 'www.google.co.nz',
      }
    ]
  );

  it(`should get all events`, () => {
    const actual: string = client.commandNode.commandFn({text: ''}).toString();
    const expected: string = `Events for this year include [conf-name](www.google.com), ` +
      `[conf-name-2](www.google.rs), [conf name with a space](www.google.co.nz).`;
    expect(actual).to.equal(expected);
  });

  it(`should find a concrete event`, () => {
    const actual: string = client.commandNode.children[0].commandFn({text: 'event conf-name'}).toString();
    const expected: string = `[conf-name](www.google.com): located at conf location Thu Jan 01 1970`;
    expect(actual).to.equal(expected);
  });

  it(`should reply with a helpful hint when conference name is not found`, () => {
    const actual: string = client.commandNode.children[0].commandFn({text: 'event random name'}).toString();
    const expected: string = `Oops! :flushed: I don't know about an event named _random name_.`;
    expect(actual).to.equal(expected);
  });

  it(`should find an event with a space in name`, () => {
    const actual: string = client.commandNode.children[0].commandFn({text: 'event conf name with a space'}).toString();
    const expected: string = `[conf name with a space](www.google.co.nz): located at some spacey place Thu Jan 01 1970`;
    expect(actual).to.equal(expected);
  });

});
