export interface ExerciseItemRequest {
	id?: string;
	repetitions: number;
	series: number;
	exerciseId: string;
	trainingId?: string;
}
