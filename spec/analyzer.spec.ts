import {Analyzer} from '../src/analyzer/analyzer';


describe(`Analyzer`, () => {

  const aly = new Analyzer();

  it(`should analyze "The quick brown fox jumps over the lazy dog"`, () => {
    const text = 'The quick brown fox jumps over the lazy dog';
    const analysis = aly.analyze(text);

    expect(analysis.numberOfCharacters).toEqual(43, `number of characters`);
    expect(analysis.numberOfWords).toEqual(9, `number of words`);
    expect(analysis.numberOfLines).toEqual(1, `number of lines`);
    expect(analysis.numberOfCharactersPerLine).toEqual([43], `number of characters per line`);
    expect(analysis.averageCharactersPerLine).toEqual(43, `average characters per line`);
    expect(analysis.numberOfWordsPerLine).toEqual([9], `number of words per line`);
    expect(analysis.averageWordsPerLine).toEqual(9, `average words per line`);

    expect(analysis.numberOfSemiColons).toEqual(0, `number of semis`);
    expect(analysis.numberOfSemiColonsBeforeLineEnding).toEqual(0, `number of semi before newline`);

    expect(analysis.numberOfCurlyBraces).toEqual(0, `number of {}`);
    expect(analysis.numberOfSquareBrackets).toEqual(0, `number of []`);
    expect(analysis.numberOfRoundParenthesis).toEqual(0, `number of ()`);

    expect(analysis.numberOfDotsWithoutSpaceAfter).toEqual(0, `number.of.dots.without.space`);
    expect(analysis.numberOfUncommonCharacterSequences).toEqual(0, `number + of => uncommon || seq`);

    expect(analysis.numberOfWordsInCamelCase).toEqual(0, `numberOfWordsInCamelCase`);
    // expect(analysis.numberOfWordsInUnderscoreCase).toEqual(0, `number_of_words_in_underscore`);
  });

  it(`should analyze "the.quickBrownFox;\njumps('over', the_lazy_dog);"`, () => {
    const text = `the.quickBrownFox;\njumps('over', the_lazy_dog);`;
    const analysis = aly.analyze(text);

    expect(analysis.numberOfCharacters).toEqual(47);
    // expect(analysis.numberOfWords).toEqual(5); // no idea what this should even be
    expect(analysis.numberOfLines).toEqual(2);
    expect(analysis.numberOfCharactersPerLine).toEqual([18, 28]);
    expect(analysis.averageCharactersPerLine).toEqual(23);
    // expect(analysis.numberOfWordsPerLine).toEqual([9]);
    // expect(analysis.averageWordsPerLine).toEqual(9);

    expect(analysis.numberOfSemiColons).toEqual(2);
    expect(analysis.numberOfSemiColonsBeforeLineEnding).toEqual(2);

    expect(analysis.numberOfCurlyBraces).toEqual(0);
    expect(analysis.numberOfSquareBrackets).toEqual(0);
    expect(analysis.numberOfRoundParenthesis).toEqual(2);

    expect(analysis.numberOfDotsWithoutSpaceAfter).toEqual(1);
    expect(analysis.numberOfUncommonCharacterSequences).toEqual(0);

    expect(analysis.numberOfWordsInCamelCase).toEqual(1);
    // expect(analysis.numberOfWordsInUnderscoreCase).toEqual(0);
  });

});
