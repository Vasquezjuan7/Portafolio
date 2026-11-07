export function estimateReadingMinutes(text: string, wordsPerMinute: number = 200): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
