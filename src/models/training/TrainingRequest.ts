import { ExerciseItemRequest } from "../exercise/ExerciseItemRequest";

export interface TrainingRequest {
	id?: string;
	title: string;
	description: string;
	personalTrainerId: string;
	muscleGroupsId: string[];
	exerciseItems: ExerciseItemRequest[];
}
