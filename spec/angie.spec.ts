import { AnalyzerClient } from './../src/reply-client';
import { Angie } from '../src/angie/angie';
import { VersionsClient } from '../src/versions/versions.client';
import { EventsClient } from '../src/events/events.client';
import { DocsClient } from '../src/docs/docs.client';
import { CommandTree } from '../src/command-tree/command-decoder';
import { MessageModel } from '../src/angie/gitter.models';
import { MessageBuilder } from '../src/util/message-builder';

const commandTree: CommandTree = new CommandTree();

const docsClient = new DocsClient(null, {
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
);

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
}

const analyzers = [mockAnalyzerClient];

commandTree.registerSubCommand(docsClient.commandSubtree);
commandTree.registerSubCommand(eventsClient.commandSubtree);

const dummyMessage: MessageModel = {
  text: 'some text here'
};

describe(`Angie`, () => {

  const angie = new Angie(null, null, true, commandTree, analyzers, 0, null, null);

  it('should reply to a global analyzer', () => {
    dummyMessage.text = 'Hey guys, whens angular3 comming out?';
    const reply = angie.getReply(dummyMessage);
    expect(reply).toEqual('its Angular time!');
  });

  it(`should reply to a command 'Angie, give me docs for AsyncPipe'`, () => {
    dummyMessage.text = 'Angie, give me docs for AsyncPipe';
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
    dummyMessage.text = `Hey Angie, what's up?`;
    const reply = angie.getReply(dummyMessage);
    expect(reply).toBe('Based on `Hey Angie,` I figured you were actually giving me command for ' +
      '`angie`, but I have no idea what you mean by `what\'s up?`. I was expecting something ' +
      'of the following: `help`, `docs`, `events`. Maybe you made a typo, or my ' +
      'creators @Toxicable and @lazarljubenovic made a mistake creating me! :sweat_smile:');
  });

});
