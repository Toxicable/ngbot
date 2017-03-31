import { MessageBuilder } from './../util/message-builder';
import { MessageModel } from './../angie/gitter.models';
export class CommandDecoder2 {
  constructor(
    private root: CommandNode,
  ) {

  }
  registerSubNodes(subNodes: CommandNode[]) {
    subNodes.forEach(node => this.root.children.push(node));
  }

  processMessage(message: MessageModel): MessageBuilder {
    const command = this.getMatch(message, this.root);
    if (command instanceof Function) {
      return command(message);
    }
  }
  private getMatch(message: MessageModel, node: CommandNode): commandFn {
    if (node.matcher && node.matcher.test(message.text)) {
      return node.commandFn;
    }
    for (const subNode of node.children) {
      return this.getMatch(message, subNode);
    }
  }
}

export class CommandNodeBuilder {
  node: CommandNode = {
    helpFn: null,
    commandFn: null,
    matcher: null,
    children: [],
  };
  withCommand(regex: RegExp, commandFn: commandFn) {
    this.node.matcher = regex;
    this.node.commandFn = commandFn;
    return this;
  }
  withHelp(helpFn: helpFn) {
    this.node.helpFn = helpFn;
    return this;
  }
  withChildren(children: CommandNode[]) {
    this.node.children = children;
    return this;
  }
  toNode() {
    return this.node;
  }
}

export type commandFn = (message: MessageModel) => MessageBuilder;
export type helpFn = () => MessageBuilder;

export interface CommandNode {
  helpFn: helpFn;
  commandFn: commandFn;
  matcher: RegExp;
  children: CommandNode[];
}
