export function getTextPart(text: string[], index: number): string | null {
  return text.length > index ? text[index] : null;
}
