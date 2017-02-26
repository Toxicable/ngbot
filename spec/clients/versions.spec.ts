import { VersionsClient } from '../../src/versions/versions.client';
import { Version } from '../../src/versions/versions.models';
import { MessageBuilder } from '../../src/util/message-builder';
import { Observable } from 'rxjs';

export const MockHttp = {
  get(url: string): Observable<Version> {
    return Observable.of(
      {
      name: '1.0.0',
      versions: {
        '1.0.0': {
          versions: 'idk',
          homepage: 'hompage',
          bugs: {
            url: 'bug url',
          }
        }
      },
      'dist-tags': {
        latest: '1.0.0',
        next: '1.0.0',
        experimental: '1.0.0',
      }
    }
    )
  }
}

describe(`Versions`, () => {

  const client = new VersionsClient((<any>MockHttp));

  it(`should get latest version`, () => {
    const actual = client.commandSubtree.fn().toString();
    expect(actual).toBeDefined();
  });

});

