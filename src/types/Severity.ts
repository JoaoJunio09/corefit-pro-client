const Severity = {
	HIGH: 'HIGH',
	MEDIUM: 'MEDIUM',
} as const;

export type Severity = typeof Severity[keyof typeof Severity];