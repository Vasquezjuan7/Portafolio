export function logMetric(metric: { name: string; value: number }) {
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[Web Vitals] ${metric.name}: ${metric.value}`);
  }
}
