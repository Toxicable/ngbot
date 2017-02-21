import { AnalyzerClient } from './../reply-client';
import { MessageBuilder } from './../util/message-builder';
import { MessageModel } from './../angie/gitter.models';
import {
  getNumberOfRegexMatches,
  isUppercase,
  isLowerCase,
  curryPercent,
  weightedAverage
} from './utils';
import { getTextOutsideCodeBlocks } from '../util/formatting';

export const WEIGHTS: AnalysisWeights = {
  curlyBraces: 10,
  squareBrackets: 9,
  roundParenthesis: 5,

  semiColons: 7,
  semiColonsBeforeLineEnding: 10,

  dotsWithoutSpaceAfter: 10,
  uncommonCharacterSequences: 10,

  camelCase: 6,
};


export class FormattingAnalyzer implements AnalyzerClient {

  private mb = new MessageBuilder()

  constructor(
  ) { }

  getReply(msg: MessageModel) {
    const isCode = this.isCode(getTextOutsideCodeBlocks(msg.text));
    if (isCode) {
      return this.mb
        .message('yo, there\'s code in that dude')
        .tag(msg.fromUser.displayName);
    }
  }

  private getNumberOfCharacters(text: string): number {
    return text.length;
  }

  private getNumberOfWords(text: string): number {
    return text.split(/\b/g)
      .filter(word => word !== ' ')
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
    const isMadeOfLetters = word.split('').every(char => char.match(/[a-z]/i) !== null);
    const hasBothLowerAndUpperCase = word !== word.toLowerCase() && word !== word.toUpperCase();
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
    const characters = this.getNumberOfCharacters(text);
    const words = this.getNumberOfWords(text);
    const lines = this.getNumberOfLines(text);
    const charactersPerLine = this.getNumberOfCharactersPerLine(text);
    const averageCharactersPerLine = this.getAverageCharactersPerLine(text);
    const wordsPerLine = this.getNumberOfWordsPerLine(text);
    const averageWordsPerLine = this.getAverageWordsPerLine(text);
    const semiColons = this.getNumberOfSemiColons(text);
    const semiColonsBeforeLineEnding = this.getNumberOfSemiColonsBeforeLineEnding(text);
    const curlyBraces = this.getNumberOfCurlyBraces(text);
    const squareBrackets = this.getNumberOfSquareBrackets(text);
    const roundParenthesis = this.getNumberOfRoundParenthesis(text);
    const dotsWithoutSpaceAfter = this.getNumberOfDotsWithoutSpaceAfter(text);
    const uncommonCharacterSequences = this.getNumberOfUncommonCharacterSequences(text);
    const underscoreCase = this.getNumberOfWordsInUnderscoreCase(text);
    const camelCase = this.getNumberOfWordsInCamelCase(text);

    const analysisResults: AnalysisResults = {
      characters,
      words,
      lines,
      charactersPerLine,
      averageCharactersPerLine,
      wordsPerLine,
      averageWordsPerLine,
      semiColons,
      semiColonsBeforeLineEnding,
      curlyBraces,
      squareBrackets,
      roundParenthesis,
      dotsWithoutSpaceAfter,
      uncommonCharacterSequences,
      underscoreCase,
      camelCase,
    };

    return analysisResults;
  }

  public normalizeAnalysis(analysis: AnalysisResults): AnalysisResults {
    const charactersPercent = curryPercent(analysis.characters);
    const wordsPercent = curryPercent(analysis.words);

    return {
      characters: 1,
      words: 1,
      lines: 1,
      charactersPerLine: analysis.charactersPerLine.map(v => v / analysis.lines),
      averageCharactersPerLine: curryPercent(analysis.lines)(analysis.averageCharactersPerLine),
      wordsPerLine: analysis.wordsPerLine.map(v => v / analysis.lines),
      averageWordsPerLine: curryPercent(analysis.lines)(analysis.averageWordsPerLine),
      semiColons: charactersPercent(analysis.semiColons),
      semiColonsBeforeLineEnding: charactersPercent(analysis.semiColonsBeforeLineEnding),
      curlyBraces: charactersPercent(analysis.curlyBraces),
      squareBrackets: charactersPercent(analysis.squareBrackets),
      roundParenthesis: charactersPercent(analysis.roundParenthesis),
      dotsWithoutSpaceAfter: wordsPercent(analysis.dotsWithoutSpaceAfter),
      uncommonCharacterSequences: charactersPercent(analysis.uncommonCharacterSequences),
      camelCase: wordsPercent(analysis.camelCase),
      underscoreCase: wordsPercent(analysis.underscoreCase),
    };
  }

  public getScore(text: string, weights: AnalysisWeights = WEIGHTS): number {
    // filtering out nonsense
    if (text === null || text.trim() === '') {
      return 0;
    }

    const analysis: AnalysisResults = this.analyze(text);
    const normalizedAnalysis: AnalysisResults = this.normalizeAnalysis(analysis);

    // filtering out very short messages
    if (!analysis.charactersPerLine.some(n => n > 400) && analysis.lines <= 3) {
      return 0;
    }

    const keys: string[] = Object.keys(weights);

    const weightsArray: number[] = keys.map(key => weights[key]);
    const scoresArray: number[] = keys.map(key => normalizedAnalysis[key]);

    return weightedAverage(weightsArray, scoresArray);
  }

  public isCode(text: string, weights: AnalysisWeights = WEIGHTS): boolean {
    const score = this.getScore(text, weights);
    return score > 0.02;
  }

}
