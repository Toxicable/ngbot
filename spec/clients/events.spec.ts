import {EventsClient} from '../../src/events/events.client';
import {MessageModel} from '../../src/angie/gitter';
import {MessageBuilder} from '../../src/util/message-builder';


describe(`Docs Client`, () => {

  const client = new EventsClient(new MessageBuilder(),
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
    ]
  );

  const dummyMessage: MessageModel = {
    id: '53316ec37bfc1a0000000011',
    text: 'angie docs AsyncPipe',
    html: 'angie docs AsyncPipe',
    sent: '2014-03-25T11:55:47.537Z',
    editedAt: null,
    fromUser: {
      id: '53307734c3599d1de448e192',
      username: 'malditogeek',
      displayName: 'Mauro Pompilio',
      url: '/malditogeek',
      avatarUrlSmall: 'https://avatars.githubusercontent.com/u/14751?',
      avatarUrlMedium: 'https://avatars.githubusercontent.com/u/14751?'
    },
    unread: false,
    readBy: 0,
    urls: [],
    mentions: [],
    issues: [{
      number: '11'
    }],
    meta: {},
    v: 1,
  };

  it(`should get all events (angie events)`, () => {
    dummyMessage.text = 'angie events';
    const actual: string = client.getGlobal(dummyMessage).toString();
    const expected: string = `Events for this year include [conf-name](www.google.com), [conf-name-2](www.google.rs)`;
    expect(actual).toEqual(expected);
  });

  it(`should get help for events (angie events help)`, () => {
    dummyMessage.text = 'angie events help';
    const actual: string = client.getGlobal(dummyMessage).toString();
    const expected: string = 'You can see all with `angie events`, for specific events use `angie events {eventName}`';
    expect(actual).toEqual(expected);
  });

  it(`should find a concrete event (angie events :event)`, () => {
    dummyMessage.text = 'angie events conf-name';
    const actual: string = client.getGlobal(dummyMessage).toString();
    const expected: string = `[conf-name](www.google.com): located at conf location Thu Jan 01 1970`;
    expect(actual).toEqual(expected);
  });

  it(`should reply with a helpful hint when conference name is not found`, () => {
    dummyMessage.text = 'angie events non-existing-conf-name';
    const actual: string = client.getGlobal(dummyMessage).toString();
    const expected: string = `Sorry I wasn't able to find that event`;
    expect(actual).toEqual(expected);
  });

});
