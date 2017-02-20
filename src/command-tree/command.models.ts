import { MessageBuilder } from './../util/message-builder';
import { MessageModel } from '../angie/gitter.models';

export type CommandFn = (msg?: MessageModel, query?: string) => MessageBuilder;

export interface CollectedCommand {
  type: 'query' | 'keyword';
  name: string;
  literal: string;
}

export interface ParsingObject {
  commandFn: CommandFn;
  wholeCommand: string;
  collectedCommands: CollectedCommand[];
  remainingCommand: string;
  expected: string[];
  error: {
    exists: boolean;
    type?: 'premature-exit' | 'no-match';
  };
}

export interface CommandNode {
  name: string;
  regex: RegExp;
  children: CommandNode[];
  fn: CommandFn;
  help: string;
}

export interface HelpData {
  path: string;
  text: string;
}
