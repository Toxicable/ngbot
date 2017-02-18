import {CommandNode, CommandTree, ParsingObject} from '../src/angie/command-decoder';
import {MessageBuilder} from '../src/util/message-builder';


describe(`Command Decoder`, () => {

  const complicatedCommand: CommandNode = {
    name: 'a',
    regex: /^(a+)/,
    fn: () => new MessageBuilder('do a'),
    help: 'help for a',
    children: [
      {
        name: 'b',
        regex: /^b/,
        fn: () => new MessageBuilder('do b'),
        help: 'help for b',
        children: null,
      },
      {
        name: 'c',
        regex: /^c/,
        fn: () => new MessageBuilder('do c'),
        help: 'help for c',
        children: [
          {
            name: 'd',
            regex: /^(multi word|d)/,
            fn: null,
            help: null,
            children: [
              {
                name: ':e',
                regex: null,
                fn: (q) => new MessageBuilder(`do e: ${q}`),
                help: 'help for e',
                children: null,
              },
            ],
          },
        ],
      },
    ],
  };

  const tree = new CommandTree();
  tree.registerSubCommand(complicatedCommand);

  it(`should properly look up commands`, () => {
    let cmd: ParsingObject;

    cmd = tree.getExe('angie a', {text: 'angie a'});
    expect(cmd.error.exists).toBe(false, cmd.error.type);
    expect(cmd.commandFn().toString()).toEqual('do a');

    cmd = tree.getExe('Angie a', {text: 'Angie a'});
    expect(cmd.error.exists).toBe(false, cmd.error.type);
    expect(cmd.commandFn().toString()).toEqual('do a');

    cmd = tree.getExe('Angie, a', {text: 'Angie, a'});
    expect(cmd.error.exists).toBe(false, cmd.error.type);
    expect(cmd.commandFn().toString()).toEqual('do a');

    cmd = tree.getExe('   angie   a  ', {text: '   angie   a  '});
    expect(cmd.error.exists).toBe(false, cmd.error.type);
    expect(cmd.commandFn().toString()).toEqual('do a');

    cmd = tree.getExe('angie aaa', {text: 'angie aaa'});
    expect(cmd.error.exists).toBe(false, cmd.error.type);
    expect(cmd.commandFn().toString()).toEqual('do a');

    cmd = tree.getExe('angie a b', {text: 'angie a b'});
    expect(cmd.error.exists).toBe(false, cmd.error.type);
    expect(cmd.commandFn().toString()).toEqual('do b');

    cmd = tree.getExe('angie aa c', {text: 'angie aa c'});
    expect(cmd.error.exists).toBe(false, cmd.error.type);
    expect(cmd.commandFn().toString()).toEqual('do c');

    cmd = tree.getExe('angie aaaaa c d foo bar', {text: 'angie aaaaa c d foo bar' });
    expect(cmd.error.exists).toBe(false, cmd.error.type);
    expect(cmd.commandFn().toString()).toEqual('do e: foo bar');

    cmd = tree.getExe('angie aaaaa c multi word foo bar', {text: 'angie aaaaa c multi word foo bar'});
    expect(cmd.error.exists).toBe(false, cmd.error.type);
    expect(cmd.commandFn().toString()).toEqual('do e: foo bar');
  });

  it(`should correctly get metadata about result`, () => {
    let cmd = tree.getExe('angie a', {text: 'angie a'});
    expect(cmd.error.exists).toBe(false, cmd.error.type);
    expect(cmd.collectedCommands).toEqual([
      {literal: 'angie', name: 'angie', type: 'keyword'},
      {literal: 'a', name: 'a', type: 'keyword'},
    ]);
    expect(cmd.remainingCommand).toBe('');

    cmd = tree.getExe('angie aaa', {text: 'angie aaa'});
    expect(cmd.error.exists).toBe(false, cmd.error.type);
    expect(cmd.collectedCommands).toEqual([
      {literal: 'angie', name: 'angie', type: 'keyword'},
      {literal: 'aaa', name: 'a', type: 'keyword'},
    ]);
    expect(cmd.remainingCommand).toBe('');

    cmd = tree.getExe('Angie, aaaaa c multi word foo bar', {text: 'Angie, aaaaa c multi word foo bar'});
    expect(cmd.error.exists).toBe(false, cmd.error.type);
    expect(cmd.collectedCommands).toEqual([
      {literal: 'Angie,', name: 'angie', type: 'keyword'},
      {literal: 'aaaaa', name: 'a', type: 'keyword'},
      {literal: 'c', name: 'c', type: 'keyword'},
      {literal: 'multi word', name: 'd', type: 'keyword'},
      {literal: 'foo bar', name: ':e', type: 'query'},
    ]);
    expect(cmd.remainingCommand).toBe('');
  });

  it(`should fail gracefully when unknown command is given`, () => {
    let cmd = tree.getExe('angie random', {text: 'angie random'});
    expect(cmd.error.exists).toBe(true);
    expect(cmd.error.type).toBe('no-match');
    expect(cmd.collectedCommands).toEqual([
      {literal: 'angie', name: 'angie', type: 'keyword'},
    ]);
    expect(cmd.remainingCommand).toBe('random');
    expect(cmd.expected).toEqual(['help', 'a']);

    cmd = tree.getExe('angie b', {text: 'angie b'});
    expect(cmd.error.exists).toBe(true);
    expect(cmd.error.type).toBe('no-match');
    expect(cmd.collectedCommands).toEqual([
      {literal: 'angie', name: 'angie', type: 'keyword'},
    ]);
    expect(cmd.remainingCommand).toBe('b');
    expect(cmd.expected).toEqual(['help', 'a']);

    cmd = tree.getExe('angie c a', {text: 'angie c a'});
    expect(cmd.error.exists).toBe(true);
    expect(cmd.error.type).toBe('no-match');
    expect(cmd.collectedCommands).toEqual([
      {literal: 'angie', name: 'angie', type: 'keyword'},
    ]);
    expect(cmd.remainingCommand).toBe('c a');
    expect(cmd.expected).toEqual(['help', 'a']);

    cmd = tree.getExe('angie c d', {text: 'angie c d'});
    expect(cmd.error.exists).toBe(true);
    expect(cmd.error.type).toBe('no-match');
    expect(cmd.collectedCommands).toEqual([
      {literal: 'angie', name: 'angie', type: 'keyword'},
    ]);
    expect(cmd.remainingCommand).toBe('c d');
    expect(cmd.expected).toEqual(['help', 'a']);

    cmd = tree.getExe('angie a c d', {text: 'angie a c d'});
    expect(cmd.error.exists).toBe(true);
    expect(cmd.error.type).toBe('premature-exit');
    expect(cmd.collectedCommands).toEqual([
      {literal: 'angie', name: 'angie', type: 'keyword'},
      {literal: 'a', name: 'a', type: 'keyword'},
      {literal: 'c', name: 'c', type: 'keyword'},
      {literal: 'd', name: 'd', type: 'keyword'},
    ]);
    expect(cmd.remainingCommand).toEqual('');
    expect(cmd.expected).toEqual([':e']);

    cmd = tree.getExe('angie a c foo bar', {text: 'angie a c foo bar'});
    expect(cmd.error.exists).toBe(true);
    expect(cmd.error.type).toBe('no-match');
    expect(cmd.collectedCommands).toEqual([
      {literal: 'angie', name: 'angie', type: 'keyword'},
      {literal: 'a', name: 'a', type: 'keyword'},
      {literal: 'c', name: 'c', type: 'keyword'},
    ]);
    expect(cmd.remainingCommand).toEqual('foo bar');
    expect(cmd.expected).toEqual(['d']);
  });

  it(`should get general help`, () => {
    const cmd = tree.getExe('angie help', {text: 'angie help'});
    expect(cmd.commandFn().toString()).toContain('Hi there! My name is Angie');
    expect(cmd.commandFn().toString()).toContain('following: a.');
  });

  it(`should get help per topics`, () => {
    const cmd = tree.getExe('angie help a', {text: 'angie help a'});
    expect(cmd.commandFn().toString()).toContain('`angie a`: help for a');
    expect(cmd.commandFn().toString()).toContain('`angie a b`: help for b');
    expect(cmd.commandFn().toString()).toContain('`angie a c`: help for c');
    expect(cmd.commandFn().toString()).toContain('`angie a c d :e`: help for e');
  });

});
