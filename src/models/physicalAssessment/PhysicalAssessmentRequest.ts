import { ActivityLevel } from '../../types/ActivityLevel';

export interface PhysicalAssessmentRequest {
  id?: string;
  traineeId: string;
  registeredAt: string;
  age: number;
  weight: number | null;
  height: number | null;
  imc: number | null;
  bodyFat: number | null;
  fatMass: number | null;
  muscleMass: number | null;
  chest: number | null;
  waist: number | null;
  abdomen: number | null;
  hip: number | null;
  rightArm: number | null;
  leftArm: number | null;
  rightThigh: number | null;
  leftThigh: number | null;
  activityLevel: ActivityLevel | null;
  notes: string | null;
}
