interface AnalysisResults {
  numberOfCharacters: number; // with ''
  numberOfWords: number; // with \b
  numberOfLines: number; // with \n
  numberOfCharactersPerLine: number[]; // for each line
  averageCharactersPerLine: number; // average of above
  numberOfWordsPerLine: number[]; // for each line
  averageWordsPerLine: number; // average of above

  numberOfSemiColons: number; // some; stuff; here
  numberOfSemiColonsBeforeLineEnding: number; // foo;

  numberOfCurlyBraces: number; // {}
  numberOfSquareBrackets: number; // []
  numberOfRoundParenthesis: number; // ()

  numberOfDotsWithoutSpaceAfter: number; // foo.bar
  numberOfUncommonCharacterSequences: number; // +, *, &, |, <, >, ==, ===, !=, !==, >=, <=, =>

  numberOfWordsInCamelCase: number; // camelCase
  numberOfWordsInUnderscoreCase: number; // under_score_case
}

function isUppercase(character: string): boolean {
  if (character == null) {
    return false;
  }
  return character == character.toUpperCase();
}

function isLowerCase(character: string): boolean {
  if (character == null) {
    return false;
  }
  return character == character.toLowerCase();
}

function isLetter(character: string): boolean {
  return character.match(/[a-z]/i).length != 0;
}

function getNumberOfRegexMatches(text: string, regex: RegExp): number {
  if (text == null) {
    return 0;
  }
  const matches = text.match(regex);
  if (matches == null) {
    return 0;
  } else {
    return matches.length;
  }
}

export class Analyzer {

  private getNumberOfCharacters(text: string): number {
    return text.length;
  }

  private getNumberOfWords(text: string): number {
    return text.split(/\b/g)
      .filter(word => word != ' ')
      .length;
  }

  private getNumberOfLines(text: string): number {
    return text.split(/\n/g).length;
  }

  private getNumberOfCharactersPerLine(text: string): number[] {
    const lines: string[] = text.split(/\n/g);
    return lines.map(line => this.getNumberOfCharacters(line));
  }

  private getAverageCharactersPerLine(text: string): number {
    const numberOfCharactersPerLine: number[] = this.getNumberOfCharactersPerLine(text);
    const length = numberOfCharactersPerLine.length;
    return numberOfCharactersPerLine.reduce((acc, curr) => acc + curr) / length;
  }

  private getNumberOfWordsPerLine(text: string): number[] {
    const lines: string[] = text.split(/\n/g);
    return lines.map(line => this.getNumberOfWords(line));
  }

  private getAverageWordsPerLine(text: string): number {
    const numberOfWordsPerLine: number[] = this.getNumberOfWordsPerLine(text);
    const length = numberOfWordsPerLine.length;
    return numberOfWordsPerLine.reduce((acc, curr) => acc + curr) / length;
  }

  private getNumberOfSemiColons(text: string): number {
    return getNumberOfRegexMatches(text, /;/g);
  }

  private getNumberOfSemiColonsBeforeLineEnding(text: string): number {
    return getNumberOfRegexMatches(text, /(;\s*\n|;\s*$)/g);
  }

  private getNumberOfCurlyBraces(text: string): number {
    return getNumberOfRegexMatches(text, /({|})/g);
  }

  private getNumberOfSquareBrackets(text: string): number {
    return getNumberOfRegexMatches(text, /(\[|\])/g);
  }

  private getNumberOfRoundParenthesis(text: string): number {
    return getNumberOfRegexMatches(text, /\(|\)/g);
  }

  private getNumberOfDotsWithoutSpaceAfter(text: string): number {
    return getNumberOfRegexMatches(text, /\.[^\s]/g);
  }

  private getNumberOfUncommonCharacterSequences(text: string): number {
    return getNumberOfRegexMatches(text, /(\+|\*|&|\||<|>|===|!==|==|!=|>=|<=|=>)/g);
  }

  private isWordCamelCase(word: string): boolean {
    const isMadeOfLetters = word.split('').every(char => char.match(/[a-z]/i) != null);
    const hasBothLowerAndUpperCase = word != word.toLowerCase() && word != word.toUpperCase();
    const isJustCapitalizedOnce = isUppercase(word[0]) && word.slice(1).split('').every(isLowerCase);
    return isMadeOfLetters && hasBothLowerAndUpperCase && !isJustCapitalizedOnce;
  }

  private getNumberOfWordsInUnderscoreCase(text: string): number {
    return 0; // TODO
  }

  private getNumberOfWordsInCamelCase(text: string): number {
    return text.split(/\b/g)
      .filter(word => this.isWordCamelCase(word))
      .length;
  }

  public analyze(text: string): AnalysisResults {
    const numberOfCharacters = this.getNumberOfCharacters(text);
    const numberOfWords = this.getNumberOfWords(text);
    const numberOfLines = this.getNumberOfLines(text);
    const numberOfCharactersPerLine = this.getNumberOfCharactersPerLine(text);
    const averageCharactersPerLine = this.getAverageCharactersPerLine(text);
    const numberOfWordsPerLine = this.getNumberOfWordsPerLine(text);
    const averageWordsPerLine = this.getAverageWordsPerLine(text);
    const numberOfSemiColons = this.getNumberOfSemiColons(text);
    const numberOfSemiColonsBeforeLineEnding = this.getNumberOfSemiColonsBeforeLineEnding(text);
    const numberOfCurlyBraces = this.getNumberOfCurlyBraces(text);
    const numberOfSquareBrackets = this.getNumberOfSquareBrackets(text);
    const numberOfRoundParenthesis = this.getNumberOfRoundParenthesis(text);
    const numberOfDotsWithoutSpaceAfter = this.getNumberOfDotsWithoutSpaceAfter(text);
    const numberOfUncommonCharacterSequences = this.getNumberOfUncommonCharacterSequences(text);
    const numberOfWordsInUnderscoreCase = this.getNumberOfWordsInUnderscoreCase(text);
    const numberOfWordsInCamelCase = this.getNumberOfWordsInCamelCase(text);
    const analysisResults: AnalysisResults = {
      numberOfCharacters,
      numberOfWords,
      numberOfLines,
      numberOfCharactersPerLine,
      averageCharactersPerLine,
      numberOfWordsPerLine,
      averageWordsPerLine,
      numberOfSemiColons,
      numberOfSemiColonsBeforeLineEnding,
      numberOfCurlyBraces,
      numberOfSquareBrackets,
      numberOfRoundParenthesis,
      numberOfDotsWithoutSpaceAfter,
      numberOfUncommonCharacterSequences,
      numberOfWordsInUnderscoreCase,
      numberOfWordsInCamelCase,
    };
    return analysisResults;
  }

}
