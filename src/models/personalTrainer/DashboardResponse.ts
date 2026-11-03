import { DaysOfWeek } from "../../types/DaysOfWeek";
import { Severity } from "../../types/Severity";
import { RecentActivityResponse } from "../RecentActivity/RecentActivityResponse";
import { TrainingItemSummary } from "../trainingItem/TrainingItemSummary";

export interface AttentionResponse {
	traineeName: string;
	message: string;
	destination: string;
	severity: Severity;
}

export interface WeeklyRhythmCompletedWorkoutsResponse {
	dayOfWeek: DaysOfWeek;
	totalTrainings: number;
	completedTrainings: number;
}

export interface DashboardResponse {
	activeTrainees: number;
	activePlans: number;
	pendings: number;
	workoutsCompletedToday: number;
	percentageWorkoutsCompletedToday: number;
	workoutsToday: TrainingItemSummary[];
	necessaryAttention: AttentionResponse[];
	rhythmWeekly: WeeklyRhythmCompletedWorkoutsResponse[];
	recentActivities: RecentActivityResponse[];
}