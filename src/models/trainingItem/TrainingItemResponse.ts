import { DaysOfWeek } from "../../types/DaysOfWeek";
import { TrainingResponse } from "../training/TrainingResponse";

export interface TrainingItemResponse {
	id: string;
	dayOfWeek: DaysOfWeek;
	completed: boolean;
	training: TrainingResponse;
}