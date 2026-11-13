export function isAccessibleContrast(contrastRatio: number): boolean {
  return contrastRatio >= 4.5; // WCAG AA standard for normal text
}
