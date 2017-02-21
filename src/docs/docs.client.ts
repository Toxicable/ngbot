import { DocsModule, DocsApi } from './docs.models';
import { MessageModel } from './../angie/gitter.models';
import {MessageBuilder} from '../util/message-builder';
import {CommandClient} from '../reply-client';
import {Http} from '../util/http';
import {CommandNode} from '../command-tree/command.models';

export class DocsClient implements CommandClient {

  private docsApiBaseUrl = 'https://angular.io/docs/ts/latest/api';
  private docsApiUrl = this.docsApiBaseUrl + '/api-list.json';
  private apis: DocsApi[];

  private typePluralMapping = {
    class: 'a',
    decorator: 'a',
    directive: 'a',
    enum: 'an',
    function: 'a',
    interface: 'an',
    let: 'a', // let !?
    pipe: 'a',
    'type-alias': 'a'
  }

  constructor(private http = new Http(),
              private mb = new MessageBuilder(),
              fallback = {}) {
    // We can provide a static fallback to use before observable is completed
    // Good for testing, too
    this.apis = this.processDocs(fallback);
    // If no http is given, don't even attempt to connect
    if (this.http) {

      this.http.get<DocsModule>(this.docsApiUrl).subscribe(docs => {
        this.apis = this.processDocs(docs);
      });
    }
  }

  private processDocs(docs): DocsApi[] {
    return Object.keys(docs)
      .map(key => docs[key])
      // flatten out the modules into a single list of APIs
      .reduce((a, b) => [...a, ...b], [])
  }

  private formatApiToMessage(api: DocsApi): string {
    const title = api.title;
    const link = `${this.docsApiBaseUrl}/${api.path}`;
    const type = api.docType;
    const stableString = api.stability === 'stable' ? 'stable' : 'unstable';
    const barrel = api.barrel;
    return `***[\`${title}\`](${link})*** is ${this.typePluralMapping[type]} **${type}** found in \`${barrel}\` and is considered *${stableString}*.`;
  }

  public commandSubtree: CommandNode = {
    name: 'docs',
    regex: /^(give\s+me\s+|get\s+|get\s+me\s+)?\s*docs(\sfor)?/i,
    fn: null,
    help: null,
    children: [
      {
        name: ':query',
        regex: null,
        children: null,
        help: 'Search the [API Reference](https://angular.io/docs/ts/latest/api)',
        fn: (msg: MessageModel, query: string = '') => {
          const matchedApi = this.apis.find(api => {
            return query.toLowerCase().includes(api.title.toLowerCase());
          });

          let reply: string;
          if (matchedApi) {
            reply = this.formatApiToMessage(matchedApi);
          } else {
            reply = `Aww, bummer :anguished: Looks like you wanted docs for _${query}_, but I ` +
              `couldn't find anything. Might be a good idea to look directly at ` +
              `[API Reference](https://angular.io/docs/ts/latest/api/)! :grin:`;
          }
          return this.mb.message(reply);
        }
      }
    ]
  };

}
