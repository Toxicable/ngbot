import {Analyzer} from '../src/analyzer/analyzer';

function isBetween(a: number, b: number): (value: number) => boolean {
  return value => a <= value && value < b;
}

describe(`Analyzer`, () => {

  const aly = new Analyzer();

  it(`should analyze "The quick brown fox jumps over the lazy dog"`, () => {
    const text = 'The quick brown fox jumps over the lazy dog';
    const analysis = aly.analyze(text);

    expect(analysis.characters).toEqual(43, `number of characters`);
    expect(analysis.words).toEqual(9, `number of words`);
    expect(analysis.lines).toEqual(1, `number of lines`);
    expect(analysis.charactersPerLine).toEqual([43], `number of characters per line`);
    expect(analysis.averageCharactersPerLine).toEqual(43, `average characters per line`);
    expect(analysis.wordsPerLine).toEqual([9], `number of words per line`);
    expect(analysis.averageWordsPerLine).toEqual(9, `average words per line`);

    expect(analysis.semiColons).toEqual(0, `number of semis`);
    expect(analysis.semiColonsBeforeLineEnding).toEqual(0, `number of semi before newline`);

    expect(analysis.curlyBraces).toEqual(0, `number of {}`);
    expect(analysis.squareBrackets).toEqual(0, `number of []`);
    expect(analysis.roundParenthesis).toEqual(0, `number of ()`);

    expect(analysis.dotsWithoutSpaceAfter).toEqual(0, `number.of.dots.without.space`);
    expect(analysis.uncommonCharacterSequences).toEqual(0, `number + of => uncommon || seq`);

    expect(analysis.camelCase).toEqual(0, `numberOfWordsInCamelCase`);
    // expect(analysis.numberOfWordsInUnderscoreCase).toEqual(0, `number_of_words_in_underscore`);

    const score = aly.getScore(text);
    expect(isBetween(0, 1)(score)).toBe(true, `score was ${score}`);
  });

  it(`should analyze "the.quickBrownFox;\njumps('over', the_lazy_dog);"`, () => {
    const text = `the.quickBrownFox;\njumps('over', the_lazy_dog);`;
    const analysis = aly.analyze(text);

    expect(analysis.characters).toEqual(47);
    // expect(analysis.numberOfWords).toEqual(5); // no idea what this should even be
    expect(analysis.lines).toEqual(2);
    expect(analysis.charactersPerLine).toEqual([18, 28]);
    expect(analysis.averageCharactersPerLine).toEqual(23);
    // expect(analysis.numberOfWordsPerLine).toEqual([9]);
    // expect(analysis.averageWordsPerLine).toEqual(9);

    expect(analysis.semiColons).toEqual(2);
    expect(analysis.semiColonsBeforeLineEnding).toEqual(2);

    expect(analysis.curlyBraces).toEqual(0);
    expect(analysis.squareBrackets).toEqual(0);
    expect(analysis.roundParenthesis).toEqual(2);

    expect(analysis.dotsWithoutSpaceAfter).toEqual(1);
    expect(analysis.uncommonCharacterSequences).toEqual(0);

    expect(analysis.camelCase).toEqual(1);
    // expect(analysis.numberOfWordsInUnderscoreCase).toEqual(0);
  });

});
