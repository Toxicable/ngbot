import { MessageBuilder } from './../util/message-builder';
import { CommandDecoder2, CommandNodeBuilder } from './../command-tree/command-decoder2';
import { expect } from 'chai';

describe('command-decoder2', () => {

  it('should find simple match', () => {
    const root = new CommandNodeBuilder()
      .withCommand(/a/, (msg) => new MessageBuilder().message('a') )
      .toNode();
    const commands = new CommandDecoder2(root);
    const result = commands.processMessage({ text: 'b' });
    expect(result).to.equal(undefined);
  });

  it('should find simple match', () => {
    const root = new CommandNodeBuilder()
      .withCommand(/a/, (msg) => new MessageBuilder().message('hi') )
      .toNode();
    const commands = new CommandDecoder2(root);
    const result = commands.processMessage({ text: 'a' });
    expect(result.toString()).to.equal('hi');
  });

  it('should find simple parent child match', () => {
    const root = new CommandNodeBuilder()
      .withCommand(/parent/, (msg) => new MessageBuilder().message('parent') )
      .withChild(b => b.withCommand(/child/, msg => new MessageBuilder().message('child')))
      .toNode();
    const commands = new CommandDecoder2(root);
    const result = commands.processMessage({ text: 'parent child' });
    expect(result.toString()).to.equal('child');
  });

  it('should find with with sibling in the way', () => {
    const root = new CommandNodeBuilder()
      .withCommand(/parent/, (msg) => new MessageBuilder().message('parent') )
      .withChild(b => b.withCommand(/child1/, msg => new MessageBuilder().message('child1')))
      .withChild(b => b.withCommand(/child2/, msg => new MessageBuilder().message('child2')))
      .toNode();
    const commands = new CommandDecoder2(root);
    const result = commands.processMessage({ text: 'parent child2' });
    expect(result.toString()).to.equal('child2');
  });


});
