export function getQuery(regex: RegExp, msg: string) {
  const parts = msg.split(regex);
  if (msg.length > 1) {
    return msg.replace(parts[0], '').replace(regex, '').trim();
  }
  return '';
}
