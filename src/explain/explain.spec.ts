import { ExplainClient } from './../../src/explain/explain.client';
import { Explaination } from './../../src/explain/explain.models';
import { expect } from 'chai';

describe('explain client', () => {

  const client = new ExplainClient([
    {keys: ['hello'], message: 'greetings'},
    {keys: ['two words'], message: 'explain two words'},
    {keys: ['firstkey', 'secondkey'], message: 'multi key explaination'},
  ]);

  it('should reply to help', () => {
    const actual = client.commandNode.commandFn({text: 'explain'}).toString();
    const expected = 'Ask me to explain different topics, for example: `explain getting started`';
    expect(actual).to.equal(expected);
  })

  it('should get a basic reply', () => {
    const actual = client.commandNode.children[0].commandFn({text: 'angie explain hello'}).toString();
    const expected = `greetings`;
    expect(actual).to.equal(expected);
  })

  it('should find a Explaination with multiple words', () => {
    const actual = client.commandNode.children[0].commandFn({text: 'angie explain two words'}).toString();
    const expected = `explain two words`;
    expect(actual).to.equal(expected);
  })

  it('should match on second key', () => {
    const actual = client.commandNode.children[0].commandFn({text: 'angie explain secondkey'}).toString();
    const expected = `multi key explaination`;
    expect(actual).to.equal(expected);
  })

});
