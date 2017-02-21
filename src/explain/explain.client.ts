import { CommandNode } from './../command-tree/command.models';
import { AnalyzerClient } from './../reply-client';
import { Explaination } from './explain.models';
import { MessageBuilder } from './../util/message-builder';
import { MessageModel } from '../angie/gitter.models';
import { explanations } from './explanations';
import { CommandClient } from '../reply-client';


export class ExplainClient implements CommandClient {

  private explaintions: Explaination[];
  private mb = new MessageBuilder();

  private findExplaination(query: string): Explaination {

    const reply = this.explaintions
      .find(explaination => {
        return explaination.keys.some(key =>
          key.toLowerCase()
            .split(' ')
            .every(keyPart => query.includes(keyPart))
        )
      });
    return query ? reply : null;
  }

  constructor(
    fallback?: Explaination[]
  ) {
    this.explaintions = fallback || explanations;
  }

  public commandSubtree: CommandNode = {
    name: 'explain',
    regex: /explain/i,
    fn: null,
    help: 'Ask me to explain different topics, for example: `angie explain getting started`',
    children: [
      {
        name: ':query',
        regex: null,
        children: null,
        help: 'Ask me to explain different topics, for example: `angie explain getting started`',
        fn: (msg: MessageModel, query: string = '') => {

          const reply = this.findExplaination(query);

          return reply ? this.mb.message(reply.message) : this.mb.message(`Oops! :flushed: I don't know how to explain _${query}_.`)
        }
      }
    ]
  };
}
