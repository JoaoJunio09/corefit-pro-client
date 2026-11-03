import { DaysOfWeek } from "../../types/DaysOfWeek";
import { TrainingStatus } from "../../types/TrainingStatus";
import { PhysicalAssessmentResponse } from "../physicalAssessment/PhysicalAssessmentRespons";
import { TraineeResponse } from "./TraineeResponse";

export interface TraineeWeeklyTraining {
	trainingItemId: string;
	day: DaysOfWeek;
	isToday: boolean;
	title: string;
	focus: string;
	dateTime: string;
	status: TrainingStatus;
}

export interface TraineeDetails {
	trainee: TraineeResponse;
	physicalAssessments: PhysicalAssessmentResponse[];
	trainings: TraineeWeeklyTraining[];
	totalTrainings: number;
	completedTrainings: number
}