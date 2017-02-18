import {VersionsClient, VERSIONS_FALLBACK} from '../../src/versions/versions.client';
import {MessageBuilder} from '../../src/util/message-builder';

describe(`Versions`, () => {

  const client = new VersionsClient(new MessageBuilder(), null, VERSIONS_FALLBACK);

  it(`should get latest version`, () => {
    const actual = client.commandSubtree.fn().toString();
    const expected = '[**`angular/angular`**](https://www.github.com/angular/angular) is at ' +
      '[**2.4.7**](https://www.github.com/angular/angular/commit/e90661aaee5ff6580a52711e1b75795b75cc9700) ' +
      '(and [4.0.0-beta.7](https://www.github.com/angular/angular/commit/09b4bd0dfbfda800796f7dac0b0206e49243b23c))';
    expect(actual).toEqual(expected);
  });

});

