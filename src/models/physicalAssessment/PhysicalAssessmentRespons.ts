import { ActivityLevel } from "../../types/ActivityLevel";

export interface PhysicalAssessmentResponse {
	id: string;
	registeredAt: string;
	age: number;
	weight: number;
	height: number;
	imc: number;
	bodyFat: number;
	fatMass: number;
	muscleMass: number;
	chest: number;
	waist: number;
	abdomen: number;
	hip: number;
	rightArm: number;
	leftArm: number;
	rightThigh: number;
	leftThigh: number;
	activityLevel: ActivityLevel;
	notes: string;
	frontViewPhotoUrl: string;
	backViewPhotoUrl: string;
	leftViewPhotoUrl: string;
	rightViewPhotoUrl: string;
}