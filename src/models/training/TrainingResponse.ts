import { ExerciseItemResponse } from "../exerciseItem/ExerciseItemResponse";
import { MuscleGroupResponse } from "../muscleGroup/MuscleGroupResponse";

export interface TrainingResponse {
	id: string;
	title: string;
	description: string;
	numberOfExercises: number;
	numberOfTrainees: number;
	muscleGroups: MuscleGroupResponse[];
	exercises: ExerciseItemResponse[];
}