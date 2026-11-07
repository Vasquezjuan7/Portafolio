export function getScrollPercentage(): number {
  if (typeof window === 'undefined') return 0;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  if (scrollHeight <= 0) return 0;
  return Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
}
