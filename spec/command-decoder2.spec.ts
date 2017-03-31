import { MessageBuilder } from './../src/util/message-builder';
import { CommandDecoder2, CommandNodeBuilder } from './../src/command-tree/command-decoder2';
describe('command-decoder2', () => {
  it('should auto register first node', () => {
    let root = new CommandNodeBuilder()
      .withHelp(() => new MessageBuilder().message('i r helping'))
      .toNode();
    let commands = new CommandDecoder2(root);
    let result = commands.processMessage({ text: 'hi' });
    expect(result).toBeUndefined
    ();
  })
});
