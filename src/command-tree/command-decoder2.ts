import { MessageBuilder } from './../util/message-builder';
import { MessageModel } from './../angie/gitter.models';

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
    //if it has a matcher than it's
    //probably at the bottom of the tree
    if (node.matcher) {
      //return this fn only if we get a match
      if (node.matcher.test(message.text)) {
        return node.commandFn;
      } else {
        return null;
      }
    } else {
      //only one of these should match
      //so return the first match
      for (const subNode of node.children) {
        const childMatch = this.getMatch(message, subNode);
        if (childMatch) {
          return childMatch;
        }
      }
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
  withCommand(regex: RegExp, commandFn: CommandFn) {
    this.node.matcher = regex;
    this.node.commandFn = commandFn;
    return this;
  }
  withHelp(helpFn: HelpFn) {
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

export type CommandFn = (message: MessageModel) => MessageBuilder;
export type HelpFn = () => MessageBuilder;

export interface CommandNode {
  helpFn: HelpFn;
  commandFn: CommandFn;
  matcher: RegExp;
  children: CommandNode[];
}
