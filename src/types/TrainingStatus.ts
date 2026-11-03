const TrainingStatus = {
	COMPLETED: 'COMPLETED',
	PENDING: 'PENDING',
	REST: 'REST'
} as const;

export type TrainingStatus = typeof TrainingStatus[keyof typeof TrainingStatus];