// TypeScript Twitter/X 280-Character Firewall
export function splitIntoTweets(threadText: string): string[] {
  const sentences = threadText.split(/(?<=[.?!])\s+/);
  const tweets: string[] = [];
  let current = "";
  for (const s of sentences) {
    if ((current + " " + s).trim().length <= 270) {
      current = (current + " " + s).trim();
    } else {
      if (current) tweets.push(current);
      current = s.trim();
    }
  }
  if (current) tweets.push(current);
  return tweets;
}
