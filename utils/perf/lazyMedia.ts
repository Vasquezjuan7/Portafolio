export function getLazyMediaAttributes() {
  return {
    loading: 'lazy' as const,
    decoding: 'async' as const,
  };
}
