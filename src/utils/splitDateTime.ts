export interface SplitDateTime {
  date: string; // formato "DD/MM"
  time: string; // formato "HH:mm"
}

const FALLBACK: SplitDateTime = { date: '--/--', time: '--:--' };

/**
 * Recebe um LocalDateTime serializado pelo Spring Boot como string ISO
 * sem timezone (ex: "2026-09-21T07:00:00") e separa em date ("21/09")
 * e time ("07:00"), sem nenhuma conversão de fuso horário.
 */
export function splitDateTime(dateTime: string | null | undefined): SplitDateTime {
  if (!dateTime) return FALLBACK;

  const [datePart, timePart] = dateTime.split('T');
  if (!datePart || !timePart) return FALLBACK;

  const [, month, day] = datePart.split('-');
  const [hour, minute] = timePart.split(':');

  if (!day || !month || hour === undefined || minute === undefined) return FALLBACK;

  return {
    date: `${day}/${month}`,
    time: `${hour}:${minute}`
  };
}