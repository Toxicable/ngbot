import { MessageBuilder } from './../util/message-builder';
import { DocsModule, DocsApi } from './docs.models';
import { MessageModel } from './../bot/gitter.models';
import { CommandClient } from '../reply-client';
import { Http } from '../util/http';
import { CommandNode, CommandNodeBuilder } from '../command-tree/command-decoder2';
import { getQuery } from "../util/string-helpers";

export class DocsClient implements CommandClient {

  private docsApiBaseUrl = 'https://angular.io/docs/ts/latest/api';
  private docsApiUrl = this.docsApiBaseUrl + '/api-list.json';
  private apis: DocsApi[];
  private mb = new MessageBuilder();

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
  constructor(
    private http = new Http(),
  ) {
    this.http.get<DocsModule>(this.docsApiUrl).subscribe(docs => {
      this.apis = this.processDocs(docs);
    });

    this.commandNode = new CommandNodeBuilder()
      .withCommand(/(give\s+me\s+|get\s+|get\s+me\s+)?\s*docs(\sfor)?/i,
      msg => new MessageBuilder(`Search the [API Reference](https://angular.io/docs/ts/latest/api)`)
      )
      .withName('docs')
      .withChild(b => b.withCommand(/\w/, this.command))
      .toNode();
  }

  commandNode: CommandNode;

  command = (msg: MessageModel) => {
    const query = getQuery(this.commandNode.matcher, msg.text);
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
