import { FormattingAnalyzer } from './../../src/formatting/formatting.analyzer';
import {getTextOutsideCodeBlocks} from '../../src/util/formatting';
import { expect } from 'chai';

function isBetween(a: number, b: number): (value: number) => boolean {
  return value => a <= value && value < b;
}

const aly = new FormattingAnalyzer();

describe(`Analyzer :: Analysis results`, () => {

  xit(`should analyze "The quick brown fox jumps over the lazy dog"`, () => {
    const text = 'The quick brown fox jumps over the lazy dog';
    const analysis = aly.analyze(text);

    expect(analysis.characters).to.equal(43, `number of characters`);
    expect(analysis.words).to.equal(9, `number of words`);
    expect(analysis.lines).to.equal(1, `number of lines`);
    expect(analysis.charactersPerLine).equal([43]);
    expect(analysis.averageCharactersPerLine).to.equal(43, `average characters per line`);
    expect(analysis.wordsPerLine).to.equal([9]);
    expect(analysis.averageWordsPerLine).to.equal(9, `average words per line`);

    expect(analysis.semiColons).to.equal(0, `number of semis`);
    expect(analysis.semiColonsBeforeLineEnding).to.equal(0, `number of semi before newline`);

    expect(analysis.curlyBraces).to.equal(0, `number of {}`);
    expect(analysis.squareBrackets).to.equal(0, `number of []`);
    expect(analysis.roundParenthesis).to.equal(0, `number of ()`);

    expect(analysis.dotsWithoutSpaceAfter).to.equal(0, `number.of.dots.without.space`);
    expect(analysis.uncommonCharacterSequences).to.equal(0, `number + of => uncommon || seq`);

    expect(analysis.camelCase).to.equal(0, `numberOfWordsInCamelCase`);
    // expect(analysis.numberOfWordsInUnderscoreCase).to.equal(0, `number_of_words_in_underscore`);

    const score = aly.getScore(text);
    expect(isBetween(0, 1)(score)).to.be(`score was ${score}`);
  });

  xit(`should analyze "the.quickBrownFox;\njumps('over', the_lazy_dog);"`, () => {
    const text = `the.quickBrownFox;\njumps('over', the_lazy_dog);`;
    const analysis = aly.analyze(text);

    expect(analysis.characters).to.equal(47);
    // expect(analysis.numberOfWords).to.equal(5); // no idea what this should even be
    expect(analysis.lines).to.equal(2);
    expect(analysis.charactersPerLine).to.equal([18, 28]);
    expect(analysis.averageCharactersPerLine).to.equal(23);
    // expect(analysis.numberOfWordsPerLine).to.equal([9]);
    // expect(analysis.averageWordsPerLine).to.equal(9);

    expect(analysis.semiColons).to.equal(2);
    expect(analysis.semiColonsBeforeLineEnding).to.equal(2);

    expect(analysis.curlyBraces).to.equal(0);
    expect(analysis.squareBrackets).to.equal(0);
    expect(analysis.roundParenthesis).to.equal(2);

    expect(analysis.dotsWithoutSpaceAfter).to.equal(1);
    expect(analysis.uncommonCharacterSequences).to.equal(0);

    expect(analysis.camelCase).to.equal(1);
    // expect(analysis.numberOfWordsInUnderscoreCase).to.equal(0);
  });

});

describe(`Analysis :: Is code or not?`, () => {

  it(`Single line, not code`, () => {
    const foxesAreLazy = `This quick brown dog runs over the lazy fox`;
    const isCode: boolean = aly.isCode(getTextOutsideCodeBlocks(foxesAreLazy));
    expect(isCode).to.equal(false);
  });

  it(`Single line, code`, () => {
    const msg = `const strippedTokens = tokens.filter(token => token.type != 'code');`;
    const isCode: boolean = aly.isCode(getTextOutsideCodeBlocks(msg));
    expect(isCode).to.equal(false);
  });

  it(`Four lines, one is code and is properly formatted`, () => {
    const msg = `This is line one and it is not code.
Ditto for the second line.
\`\`\`
this.isAProperly(formatted => line(of, code))
\`\`\`
Final line.`;
    const isCode: boolean = aly.isCode(getTextOutsideCodeBlocks(msg));
    expect(isCode).to.equal(false);
  });

  it(`Four lines, one is unformatted code`, () => {
    const msg = `This is line one and it is not code.
Ditto for the second line.
this.isNotProperly(formatted => line(of, code))
Final line.`;
    const isCode: boolean = aly.isCode(getTextOutsideCodeBlocks(msg));
    expect(isCode).to.equal(false); // dunno
  });

  it(`Four lines, all are unformatted code`, () => {
    const msg = `const tokens = marked.lexer(message);
const strippedTokens = tokens.filter(token => token.type != 'code');
const html = marked.parser(strippedTokens);
const tokens = marked.lexer(message);`;
    const isCode: boolean = aly.isCode(getTextOutsideCodeBlocks(msg));
    expect(isCode).to.equal(true);
  });

  it(`Seven lines, four are unformatted code`, () => {
    const msg = `This is line one and it is not code.
Ditto for the second line.
this.isNotProperly(formatted => line(of, code));
const tokens = marked.lexer(message);
const strippedTokens = tokens.filter(token => token.type != 'code');
const html = marked.parser(strippedTokens);
Final line.`;
    const isCode: boolean = aly.isCode(getTextOutsideCodeBlocks(msg));
    expect(isCode).equal(true);
  });

});
