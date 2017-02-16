import {VersionsClient, VERSIONS_FALLBACK} from '../../src/versions/versions.client';
import {MessageBuilder} from '../../src/util/message-builder';
import {MessageModel} from '../../src/angie/gitter';

describe(`Versions`, () => {

  const client = new VersionsClient(new MessageBuilder(), null, VERSIONS_FALLBACK);

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

  it(`should get latest version`, () => {
    dummyMessage.text = 'angie versions';
    const actual = client.getReply(dummyMessage).toString();
    const expected = '[**`angular/angular`**](https://www.github.com/angular/angular) is at ' +
      '[**2.4.7**](https://www.github.com/angular/angular/commit/e90661aaee5ff6580a52711e1b75795b75cc9700) ' +
      '(and [4.0.0-beta.7](https://www.github.com/angular/angular/commit/09b4bd0dfbfda800796f7dac0b0206e49243b23c))';
    expect(actual).toEqual(expected);
  });

});

