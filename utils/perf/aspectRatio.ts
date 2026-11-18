export function calculateAspectRatioPadding(width: number, height: number): string {
  return `${(height / width) * 100}%`;
}
