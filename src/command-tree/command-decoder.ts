import { CommandNode, HelpData, ParsingObject, CollectedCommand } from './command.models';
import { MessageModel } from '../angie/gitter.models';
import {MessageBuilder} from '../util/message-builder';

export class CommandTree {
  private root: CommandNode;


  private initialize() {
    const generalHelp = () => new MessageBuilder(`Hi there! My name is Angie and I'm here to try my best to provide you ` +
      `with info you quickly wanna look up :smile: I can understand certain phrases, but you can ` +
      `also use simple commands, like \`angie help :topic\`, where \`:topic\` can be one of the ` +
      `following: ${this.root.children[0].children.find(c => c.name === 'help').children.map(t => t.name).join(', ')}.`);
    this.root = {
      name: '#',
      fn: null,
      help: null,
      regex: null,
      children: [
        {
          name: 'angie',
          regex: /^\s*(hey\s+|hi\s+)?Angie+(,)?/i,
          children: [
            {
              name: 'help',
              regex: /^help(\s+me)?(\s+with)?/,
              children: null,
              fn: () => generalHelp(),
              help: null,
            }
          ],
          fn: null,
          help: null,
        },
      ],
    }
    ;
  }

  public registerSubCommand(command: CommandNode): void {
    const helps = this.registerHelpCommand(command, `angie ${command.name}`, []);
    const helpCommandNode = this.root.children[0].children.find(c => c.name === 'help');
    if (helpCommandNode.children == null) {
      helpCommandNode.children = [];
    }
    helpCommandNode.children.push({
      name: command.name,
      regex: new RegExp(`^${command.name}`),
      children: null,
      help: null,
      fn: () => new MessageBuilder(`${helps.map(h => `\`${h.path}\`: ${h.text}`).join('\n')}`),
    });
    this.root.children[0].children.push(command);
  }


  private registerHelpCommand(command: CommandNode, currentPath: string, helps: HelpData[]): HelpData[] {
    if (command.help) {
      helps.push({
        path: currentPath,
        text: command.help,
      });
    }
    if (command.children) {
      command.children.forEach(subCommand => {
        this.registerHelpCommand(subCommand, `${currentPath} ${subCommand.name}`, helps);
      });
    }
    return helps;
  }


  public getExe(query: string, msg: MessageModel): ParsingObject {
    return this.getExeForCommand(query, this.root, query, [], msg);
  }


  private getExeForCommand(remainingCommand: string,
                           currentNode: CommandNode,
                           wholeCommand: string,
                           collectedCommands: {
                             type: 'query' | 'keyword',
                             name: string,
                             literal: string,
                           }[],
                           msg: MessageModel
                           ): ParsingObject {

    if (remainingCommand.trim() === '') {
      if (currentNode.fn != null) {
        return {
          commandFn: currentNode.fn.bind(null, msg),
          error: {
            exists: false,
          },
          remainingCommand,
          collectedCommands,
          wholeCommand,
          expected: currentNode.children ? currentNode.children.map(child => child.name) : [],
        };
      } else {
        return {
          commandFn: null,
          error: {
            exists: true,
            type: 'premature-exit',
          },
          remainingCommand,
          collectedCommands,
          wholeCommand,
          expected: currentNode.children ? currentNode.children.map(child => child.name) : [],
        };
      }
    }

    if (currentNode.children) {
      for (let i = 0; i < currentNode.children.length; i++) {
        const child = currentNode.children[i];

        if (child.name.startsWith(':')) {
          return {
            commandFn: child.fn.bind(null, msg, remainingCommand),
            error: {
              exists: false,
            },
            remainingCommand: '',
            collectedCommands: [...collectedCommands, {
              literal: remainingCommand,
              name: child.name,
              type: 'query',
            }],
            wholeCommand,
            expected: child.children ? child.children.map(c => c.name) : [],
          };
        } else {
          const matches = remainingCommand.match(child.regex);
          if (matches) {
            const match = matches[0];
            const leftoverCommand = remainingCommand.slice(match.length).trim();
            const newCollectedCommands: CollectedCommand[] = [...collectedCommands, {
              literal: match,
              name: child.name,
              type: 'keyword',
            }];
            return this.getExeForCommand(leftoverCommand, child, wholeCommand, newCollectedCommands, msg);
          }
        }
      }
    }

    return {
      commandFn: null,
      error: {
        exists: true,
        type: 'no-match',
      },
      remainingCommand,
      wholeCommand,
      collectedCommands,
      expected: currentNode.children ? currentNode.children.map(child => child.name) : [],
    };

  }


  constructor() {
    this.initialize();
  }


}


