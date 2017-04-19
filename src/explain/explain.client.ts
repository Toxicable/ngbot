import { CommandNodeBuilder, CommandNode } from './../command-tree/command-decoder2';
import { AnalyzerClient } from './../reply-client';
import { Explaination } from './explain.models';
import { MessageBuilder } from './../util/message-builder';
import { MessageModel } from '../bot/gitter.models';
import { explanations } from './explanations';
import { CommandClient } from '../reply-client';
import { getQuery } from "../util/string-helpers";


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
        );
      });
    return query ? reply : null;
  }

  command = (msg: MessageModel) => {
    const query = getQuery(this.commandNode.matcher, msg.text);
    const reply = this.findExplaination(query);
    return reply ? this.mb.message(reply.message) : this.mb.message(`Oops! :flushed: I don't know how to explain _${query}_.`);
  }

  constructor(
    fallback?: Explaination[]
  ) {
    this.explaintions = fallback || explanations;

    this.commandNode = new CommandNodeBuilder()
      .withCommand(/explain/, msg => new MessageBuilder('Ask me to explain different topics, for example: `explain getting started`'))
      .withChild(builder => builder.withCommand(/\w/, this.command))
      .withName('explain')
      .toNode();

  }

  commandNode: CommandNode;



}
