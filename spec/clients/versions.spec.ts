import {VersionsClient} from '../../src/versions/versions.client';
import {MessageBuilder} from '../../src/util/message-builder';

export const VERSIONS_FALLBACK = [
  {
    name: 'g3_v2_0',
    zipball_url: 'https://api.github.com/repos/angular/angular/zipball/g3_v2_0',
    tarball_url: 'https://api.github.com/repos/angular/angular/tarball/g3_v2_0',
    commit: {
      sha: 'ca16fc29a640bd0201a5045ff128d3813088bdc0',
      url: 'https://api.github.com/repos/angular/angular/commits/ca16fc29a640bd0201a5045ff128d3813088bdc0'
    }
  },
  {
    name: '4.0.0-beta.7',
    zipball_url: 'https://api.github.com/repos/angular/angular/zipball/4.0.0-beta.7',
    tarball_url: 'https://api.github.com/repos/angular/angular/tarball/4.0.0-beta.7',
    commit: {
      sha: '09b4bd0dfbfda800796f7dac0b0206e49243b23c',
      url: 'https://api.github.com/repos/angular/angular/commits/09b4bd0dfbfda800796f7dac0b0206e49243b23c'
    }
  },
  {
    name: '2.4.7',
    zipball_url: 'https://api.github.com/repos/angular/angular/zipball/2.4.7',
    tarball_url: 'https://api.github.com/repos/angular/angular/tarball/2.4.7',
    commit: {
      sha: 'e90661aaee5ff6580a52711e1b75795b75cc9700',
      url: 'https://api.github.com/repos/angular/angular/commits/e90661aaee5ff6580a52711e1b75795b75cc9700'
    }
  },
  {
    name: '2.4.6',
    zipball_url: 'https://api.github.com/repos/angular/angular/zipball/2.4.6',
    tarball_url: 'https://api.github.com/repos/angular/angular/tarball/2.4.6',
    commit: {
      sha: '343ee8a3a23dfcd171b018b8dfe85d571afccd6b',
      url: 'https://api.github.com/repos/angular/angular/commits/343ee8a3a23dfcd171b018b8dfe85d571afccd6b'
    }
  },
];

describe(`Versions`, () => {

  const client = new VersionsClient( null, VERSIONS_FALLBACK);

  it(`should get latest version`, () => {
    const actual = client.commandSubtree.fn().toString();
    const expected = '[**`angular/angular`**](https://www.github.com/angular/angular) is at ' +
      '[**2.4.7**](https://www.github.com/angular/angular/commit/e90661aaee5ff6580a52711e1b75795b75cc9700) ' +
      '(and [4.0.0-beta.7](https://www.github.com/angular/angular/commit/09b4bd0dfbfda800796f7dac0b0206e49243b23c))';
    expect(actual).toEqual(expected);
  });

});

