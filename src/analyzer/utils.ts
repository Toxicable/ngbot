export function isUppercase(character: string): boolean {
  if (character == null) {
    return false;
  }
  return character == character.toUpperCase();
}


export function isLowerCase(character: string): boolean {
  if (character == null) {
    return false;
  }
  return character == character.toLowerCase();
}


export function isLetter(character: string): boolean {
  return character.match(/[a-z]/i).length != 0;
}


export function getNumberOfRegexMatches(text: string, regex: RegExp): number {
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


export function curryPercent(total: number): (value: number) => number {
  return value => value / total;
}


function sum(arr: number[]): number {
  return arr.reduce((acc, curr) => acc + curr);
}


function scalarProduct(arr1: number[], arr2: number[]): number {
  if (arr1.length != arr2.length) {
    throw new Error(`Arrays must be of same length to participate in scalar product`);
  }
  return arr1.reduce((acc, curr, index) => acc + curr * arr2[index], 0);
}


export function weightedAverage(weights: number[], values: number[]): number {
  return scalarProduct(weights, values) / sum(weights);
}
