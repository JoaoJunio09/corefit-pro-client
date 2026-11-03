import { MuscleGroupResponse } from '../muscleGroup/MuscleGroupResponse';

export interface ExerciseResponse {
	id: string;
	name: string;
	system: boolean | null;
	favorite: boolean | null;
	photoKey: string | null;
	videoKey: string | null;
	photoFileId: string | null;
	videoFileId: string | null;
	muscleGroups: MuscleGroupResponse[];
}