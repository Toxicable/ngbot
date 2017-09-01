import * as util from '../util/formatting';
import { expect } from 'chai';

describe(`getTextOutsideCodeBlock`, () => {

  it(`should work when there is no code block in the message`, () => {
    const message: string = `A random message without any code block.`;
    expect(util.getTextOutsideCodeBlocks(message)).to.equal(message + '\n');
  });

  it(`should strip out code blocks`, () => {
    const message: string = `A *line* that is _not_ code
\`\`\`
this.isCode(which.isProperly);
formatted(() => {});
\`\`\`
and \`some _more_\` text`;
    const actual = util.getTextOutsideCodeBlocks(message);
    const expected = `A line that is not code
and some _more_ text
`;
    expect(actual).to.equal(expected);
  });

  it(`should not strip out things that it should not strip out ;)`, () => {
    const message: string = `A *line* that is _not_ code

this.isCode(which.isAbsolutelyNotProperly);
formatted(() => {});

and \`some _more_\` text`;
    const actual = util.getTextOutsideCodeBlocks(message);
    const expected = `A line that is not code
this.isCode(which.isAbsolutelyNotProperly);
formatted(() => {});
and some _more_ text
`;
    expect(actual).to.equal(expected);
  });

});
