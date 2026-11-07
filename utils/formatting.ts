export function formatNumberWithCommas(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatXPDisplay(current: number, target: number): string {
  return `${formatNumberWithCommas(current)} / ${formatNumberWithCommas(target)} XP`;
}
