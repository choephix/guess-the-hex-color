export function padColorCode(colorCode: string): string {
  if (colorCode.length < 3) {
    //// pad with zeros e.g. ab -> 0ab
    colorCode = colorCode.padStart(3, '0');
  }

  if (colorCode.length === 3) {
    //// double the chars e.g. abc -> aabbcc
    colorCode = colorCode
      .split('')
      .map(c => c + c)
      .join('');
  }

  if (colorCode.length < 6) {
    //// pad with zeros e.g. abc -> 00abcd
    colorCode = colorCode.padStart(6, '0');
  }

  return colorCode;
}
