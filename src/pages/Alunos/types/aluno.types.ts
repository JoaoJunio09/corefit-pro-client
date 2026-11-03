import { PhysicalAssessmentRequest } from '../../../models/physicalAssessment/PhysicalAssessmentRequest';
import { ActivityLevel } from '../../../types/ActivityLevel';

export type AlunoStatus = 'Ativo' | 'Inativo' | 'Pendente';

export type StatusFilter = 'Todos' | AlunoStatus;

export type WorkoutStatus = 'concluido' | 'pendente' | 'descanso' | 'sem_treino';

export interface WeeklyScheduleItem {
  day: string;
  date: string;
  isToday: boolean;
  title: string | null;
  focus: string | null;
  time: string | null;
  status: WorkoutStatus;
}

export interface Measurements {
  chest?: string;
  waist?: string;
  abdomen?: string;
  hip?: string;
  armRight?: string;
  armLeft?: string;
  thighRight?: string;
  thighLeft?: string;
}

export interface EvalPhotos {
  front?: string;
  left?: string;
  right?: string;
  back?: string;
}

export interface Aluno {
  id: number;
  name: string;
  avatar: string;
  age: number;
  weight: number;
  height: number;
  status: AlunoStatus;
  objective: string;
  weeklyCompleted?: number;
  weeklyTotal?: number;
  weeklyProgress: number;
  hasEvaluation: boolean;
  lastEvaluationDate: string | null;
  activityLevel?: string | null;
  evalNotes?: string | null;
  fatPercentage?: number | null;
  muscleMassPercentage?: number | null;
  bmi?: number | null;
  measurements?: Measurements;
  evalPhotos?: EvalPhotos;
  trainingPlanName: string;
  trainingPlanGoal: string;
  weeklySchedule: WeeklyScheduleItem[];
}

export type EvolutionPhotoKey = 'front' | 'left' | 'right' | 'back';

export interface EvolutionPhoto {
  key: EvolutionPhotoKey;
  label: string;
  image?: string;
}

export type VisiblePhotos = Record<EvolutionPhotoKey, boolean>;

export interface CalendarStats {
  totalWorkouts: number;
  completedWorkouts: number;
  percentage: number;
}

export interface TraineeFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  recoveryEmail: string;
  password: string;
  confirmPassword: string;
  photo: File | null;
}

export interface PhysicalAssessmentFormData {
  registeredAt: string;
  age: number;
  weight: string;
  height: string;
  bodyFat: string;
  fatMass: string;
  muscleMass: string;
  chest: string;
  waist: string;
  abdomen: string;
  hip: string;
  rightArm: string;
  leftArm: string;
  rightThigh: string;
  leftThigh: string;
  activityLevel: ActivityLevel | '';
  notes: string;
  photos: PhysicalAssessmentPhotos;
}

export interface PhysicalAssessmentMutationData {
  physicalAssessment: PhysicalAssessmentRequest;
  frontPhoto: File | null;
  backPhoto: File | null;
  leftPhoto: File | null;
  rightPhoto: File | null;
}

export type PhysicalAssessmentPhotoPosition = 'front' | 'back' | 'left' | 'right';

export type PhysicalAssessmentPhotos = Record<PhysicalAssessmentPhotoPosition, File | null>;
