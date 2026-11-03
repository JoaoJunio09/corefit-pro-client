const percentageFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 2
});

export function normalizeWorkoutPercentage(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(Math.min(100, Math.max(0, value)) * 100) / 100;
}

export function calculateWorkoutPercentage(completed: number, total: number): number {
  if (!Number.isFinite(completed) || !Number.isFinite(total) || total <= 0) return 0;
  return normalizeWorkoutPercentage(completed / total * 100);
}

export function formatWorkoutPercentage(value: number): string {
  return `${percentageFormatter.format(normalizeWorkoutPercentage(value))}%`;
}
