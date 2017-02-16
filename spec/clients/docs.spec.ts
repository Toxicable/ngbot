import {DocsClient} from '../../src/docs/docs.client';
import {MessageModel} from '../../src/angie/gitter';
import {MessageBuilder} from '../../src/util/message-builder';


describe(`Docs Client`, () => {

  const client = new DocsClient(null, new MessageBuilder(), {
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

  it(`should get docs for an existing entry`, () => {
    const actual: string = client.commandSubtree.children[0].fn('AsyncPipe').toString();
    const expected: string = `***[\`AsyncPipe\`](https://angular.io/docs/ts/latest/api/api-list.json` +
      `/common/index/AsyncPipe-pipe.html)*** is a **pipe** found in \`@angular/common\` and ` +
      `is considered *stable*.`;
    expect(actual).toEqual(expected);
  });

  it(`should provide a helpful message if docs don't exist`, () => {
    const actual: string = client.commandSubtree.children[0].fn('nonsense').toString();
    const expected: string = `Aww, bummer :anguished: Looks like you wanted docs for _nonsense_, ` +
      `but I couldn't find anything. Might be a good idea to look directly at ` +
      `[API Reference](https://angular.io/docs/ts/latest/api/)! :grin:`;
    expect(actual).toEqual(expected);
  });

  it(`should provide a helpful message if docs don't exist (for more than one word)`, () => {
    const actual: string = client.commandSubtree.children[0].fn('some nonsense here').toString();
    const expected: string = `Aww, bummer :anguished: Looks like you wanted docs for ` +
      `_some nonsense here_, but I couldn't find anything. Might be a good idea ` +
      `to look directly at [API Reference](https://angular.io/docs/ts/latest/api/)! :grin:`;
    expect(actual).toEqual(expected);
  });

});
