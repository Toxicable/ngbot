import { ExplainClient } from './../../src/explain/explain.client';
import { Explaination } from './../../src/explain/explain.models';
describe('explain client', () => {

  const client = new ExplainClient([
    {keys: ['hello'], message: 'greetings'},
    {keys: ['two words'], message: 'explain two words'},
    {keys: ['firstkey', 'secondkey'], message: 'multi key explaination'},
  ]);

  it('should reply to help', () => {
    const actual: string = client.commandSubtree.children[0].help;
    const expected: string = `Ask me to explain different topics, for example: \`angie explain getting started\``;
    expect(actual).toEqual(expected);
  })

  it('should get a basic reply', () => {
    const actual: string = client.commandSubtree.children[0].fn({text: 'angie explain hllo'}, 'hello').toString();
    const expected: string = `greetings`;
    expect(actual).toEqual(expected);
  })

  it('should find a Explaination with multiple words', () => {
    const actual: string = client.commandSubtree.children[0].fn({text: 'angie explain two words'}, 'two words').toString();
    const expected: string = `explain two words`;
    expect(actual).toEqual(expected);
  })

  it('should match on second key', () => {
    const actual: string = client.commandSubtree.children[0].fn({text: 'angie explain secondkey'}, 'secondkey').toString();
    const expected: string = `multi key explaination`;
    expect(actual).toEqual(expected);
  })

});
