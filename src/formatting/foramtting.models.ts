interface AnalysisResults {
  characters: number; // with ''
  words: number; // with \b
  lines: number; // with \n

  charactersPerLine: number[]; // for each line
  averageCharactersPerLine: number; // average of above

  wordsPerLine: number[]; // for each line
  averageWordsPerLine: number; // average of above

  semiColons: number; // some; stuff; here
  semiColonsBeforeLineEnding: number; // foo;

  curlyBraces: number; // {}
  squareBrackets: number; // []
  roundParenthesis: number; // ()

  dotsWithoutSpaceAfter: number; // foo.bar
  uncommonCharacterSequences: number; // +, *, &, |, <, >, ==, ===, !=, !==, >=, <=, =>

  camelCase: number; // camelCase
  underscoreCase: number; // under_score_case
}

interface AnalysisWeights {
  curlyBraces: number;
  squareBrackets: number;
  roundParenthesis: number;

  semiColons: number;
  semiColonsBeforeLineEnding: number;

  dotsWithoutSpaceAfter: number;
  uncommonCharacterSequences: number;

  camelCase: number;
}
