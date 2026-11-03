import { ExerciseResponse } from "../exercise/ExerciseResponse";

export interface ExerciseItemResponse {
	id: string;
	exercise: ExerciseResponse;
	repetitions: number;
	series: number;
}