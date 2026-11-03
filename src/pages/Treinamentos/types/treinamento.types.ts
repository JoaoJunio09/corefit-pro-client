export interface ExerciseItemConfig {
  series: string;
  repetitions: string;
}

export interface TrainingExerciseForm {
  id?: string;
  series: number;
  repetitions: number;
  exerciseId: string;
  exerciseName: string;
}

export interface TrainingFormData {
  id: string;
  title: string;
  description: string;
  exercises: TrainingExerciseForm[];
}

export type TreinamentosView = 'list' | 'details' | 'form';
