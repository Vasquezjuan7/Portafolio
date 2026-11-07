export function formatTimelinePeriod(startYear: string, endYear: string = 'Present'): string {
  return `${startYear} — ${endYear}`;
}

export function getYearsOfExperience(startYear: number): number {
  const currentYear = new Date().getFullYear();
  return Math.max(1, currentYear - startYear);
}
