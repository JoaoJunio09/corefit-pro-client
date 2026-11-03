import { DaysOfWeek } from "../../types/DaysOfWeek";
import { TraineeSummary } from "../trainee/TraineeSummary";
import { TrainingSummary } from "../training/TrainingSummary";

export interface TrainingItemSummary {
	id: string;
	dayOfWeek: DaysOfWeek;
	completed: boolean;
	training: TrainingSummary;
	trainee: TraineeSummary;
}