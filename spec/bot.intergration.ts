import { MockHttp } from './mock-utils';
import { VersionsClient } from './../src/versions/versions.client';
import { AnalyzerClient } from './../src/reply-client';
import { Bot } from '../src/bot/bot';
import { EventsClient } from '../src/events/events.client';
import { DocsClient } from '../src/docs/docs.client';
import { MessageModel } from '../src/bot/gitter.models';
import { MessageBuilder } from '../src/util/message-builder';


const mockDocsHttp = new MockHttp(
  {
    '@angular/common': [
      {
        'title': 'AsyncPipe',
        'path': 'common/index/AsyncPipe-pipe.html',
        'docType': 'pipe',
        'stability': 'stable',
        'secure': 'false',
        'barrel': '@angular/common'
      },
      {
        'title': 'CommonModule',
        'path': 'common/index/CommonModule-class.html',
        'docType': 'class',
        'stability': 'stable',
        'secure': 'false',
        'barrel': '@angular/common',
      },
    ],
  }
)

const docsClient = new DocsClient(mockDocsHttp)

const eventsClient = new EventsClient(
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

const mockAnalyzerClient: AnalyzerClient = {
  getReply(msg: MessageModel) {
    const mb = new MessageBuilder();
    if (msg.text.includes('angular3')) {
      return mb.message('its Angular time!');
    }
  }
};

const replyClients = [
  docsClient,
  eventsClient,
]
const analyzerClients = [mockAnalyzerClient];

const dummyMessage: MessageModel = {
  text: 'some text here'
};

describe(`Bot`, () => {

  const angie = new Bot({ token: null, roomName: null, isProd: false, replyClients, analyzerClients });

  it('should reply to a global analyzer', () => {
    dummyMessage.text = 'Hey guys, whens angular3 comming out?';
    const reply = angie.getReply(dummyMessage);
    expect(reply).toEqual('its Angular time!');
  });

  it(`should reply to a command 'Angie, give me docs for AsyncPipe'`, () => {
    dummyMessage.text = 'ngbot, give me docs for AsyncPipe';
    const reply = angie.getReply(dummyMessage);
    expect(reply).toEqual('***[`AsyncPipe`](https://angular.io/docs/ts/latest/api/co' +
      'mmon/index/AsyncPipe-pipe.html)*** is a **pipe** found in `@angular/common` and is considered *stable*.');
  });

  it(`should not do anything when message is not a command`, () => {
    dummyMessage.text = 'hello people';
    const reply = angie.getReply(dummyMessage);
    expect(reply).toBe(null);
  });

  it(`should handle bad command 'angie what's up?'`, () => {
    dummyMessage.text = `Hey ngbot, what's up?`;
    const reply = angie.getReply(dummyMessage);
    const expected = `Hello, I'm ngbot. The current areas you can ask me about are: \`docs\`, \`events\`.`;
    expect(reply).toEqual(expected);
  });

});
