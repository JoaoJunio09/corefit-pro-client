export type ActiveTab = 'all' | 'favorites' | 'system' | 'personal';

export interface ExerciseFormData {
  id?: string;
  name: string;
  photo: File | string | null;
  videoUrl: string;
  muscleGroupsId: string[];
}
