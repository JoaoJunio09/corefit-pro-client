export interface ExerciseRequest {
  id?: string;
  name: string;
  videoUrl: string | null;
  favorite: boolean;
  personalTrainerId?: string;
  muscleGroupsId: string[];
}
