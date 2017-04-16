import { MessageBuilder } from './../util/message-builder';
import { MessageModel } from './../bot/gitter.models';

export class CommandDecoder2 {
  constructor(
    //it must have a root node
    private root: CommandNode,
  ) { }

  //it needs a root but dosen't need extra children
  registerSubNodes(subNodes: CommandNode[]) {
    subNodes.forEach(node => this.root.children.push(node));
  }

  processMessage(message: MessageModel): MessageBuilder {
    const command = this.getMatch(message, this.root);
    //its possible it might not pass back a function
    if (command instanceof Function) {
      return command(message);
    }
    // so we jsut fail it silently and return an implicit undefined
  }

  private getMatch(message: MessageModel, node: CommandNode): CommandFn {
    if (node.matcher.test(message.text)) {
      if (node.children.length !== 0) {
        for (const subNode of node.children) {
          const childMatch = this.getMatch(message, subNode);
          if (childMatch) {
            return childMatch;
          }
        }
      } else {
        return node.commandFn;
      }
    }
  }
}

export class CommandNodeBuilder {
  private node: CommandNode = {
    commandFn: null,
    matcher: null,
    children: [],
  };
  withCommand(regex: RegExp, commandFn: CommandFn ) {
    this.node.matcher = regex;
    this.node.commandFn = commandFn;
    return this;
  }
  withChildren(nodes: CommandNode[]) {
    this.node.children = nodes;
    return this;
  }
  withChild(childBuilderFn: (builder: CommandNodeBuilder) => CommandNodeBuilder) {
    this.node.children.push(childBuilderFn(new CommandNodeBuilder).toNode());
    return this;
  }
  withName(name: string){
    this.node.name = name;
    return this;
  }
  toNode() {
    return this.node;
  }
}

export type CommandFn = (message: MessageModel) => MessageBuilder;

export interface CommandNode {
  commandFn: CommandFn;
  matcher: RegExp;
  children: CommandNode[];
  name?: string;
}
