const ActivityLevel = {
	SEDENTARY: 'SEDENTARY',
	LIGHT: 'LIGHT',
	MODERATE: 'MODERATE',
	ACTIVE: 'ACTIVE',
	VERY_ACTIVE: 'VERY_ACTIVE'
} as const;

export type ActivityLevel = typeof ActivityLevel[keyof typeof ActivityLevel];