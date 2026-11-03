const DaysOfWeek = {
	MONDAY: 'MONDAY',
	TUESDAY: 'TUESDAY',
	WEDNESDAY: 'WEDNESDAY',
	THURSDAY: 'THURSDAY',
	FRIDAY: 'FRIDAY',
	SATURDAY: 'SATURDAY',
	SUNDAY: 'SUNDAY',
} as const;

export type DaysOfWeek = typeof DaysOfWeek[keyof typeof DaysOfWeek];