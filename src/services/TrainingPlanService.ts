import api from "./api";
import { TrainingResponse } from "../models/training/TrainingResponse";

export interface TrainingPlanItem {
  id: string;
  dayOfWeek: string;
  completed: boolean;
  training: TrainingResponse;
}

export interface TrainingPlanDetails {
  id: string;
  description: string;
  objective: string;
  goal?: string;
  trainings: TrainingPlanItem[];
}

export interface TrainingPlanRequest {
  id?: string;
  description: string;
  objective: string;
  goal: string;
  personalTrainerId: string;
  traineeId: string;
  trainings?: { dayOfWeek: string; trainingId: string }[];
}

class TrainingPlanService {
  private readonly planUrl = "/api/trainingsPlans/v1";
  private readonly itemUrl = "/api/trainingItems/v1";

  constructor(private readonly accessToken: string) {}

  private get headers() {
    return { Authorization: `Bearer ${this.accessToken}` };
  }

  async getByTrainee(traineeId: string) {
    const response = await api.get<TrainingPlanDetails>(
      `${this.planUrl}/trainee/${traineeId}`,
      { headers: this.headers },
    );
    return response.data;
  }

  async createPlan(data: TrainingPlanRequest) {
    const response = await api.post<TrainingPlanDetails>(this.planUrl, data, {
      headers: { ...this.headers, "Content-Type": "application/json" },
    });
    return response.data;
  }

  async updatePlan(data: TrainingPlanRequest) {
    const response = await api.put<TrainingPlanDetails>(this.planUrl, data, {
      headers: { ...this.headers, "Content-Type": "application/json" },
    });
    return response.data;
  }

  async saveComplete(data: TrainingPlanRequest) {
    const config = {
      headers: { ...this.headers, "Content-Type": "application/json" },
    };
    const response = data.id
      ? await api.put<TrainingPlanDetails>(
          `${this.planUrl}/with-items`,
          data,
          config,
        )
      : await api.post<TrainingPlanDetails>(
          `${this.planUrl}/with-items`,
          data,
          config,
        );
    return response.data;
  }

  async createItem(
    dayOfWeek: string,
    trainingId: string,
    trainingPlainId: string,
  ) {
    await api.post(
      this.itemUrl,
      { dayOfWeek, trainingId, trainingPlainId },
      { headers: { ...this.headers, "Content-Type": "application/json" } },
    );
  }

  async updateItem(
    id: string,
    dayOfWeek: string,
    trainingId: string,
    trainingPlainId: string,
  ) {
    await api.put(
      this.itemUrl,
      { id, dayOfWeek, trainingId, trainingPlainId },
      { headers: { ...this.headers, "Content-Type": "application/json" } },
    );
  }

  async deleteItem(id: string) {
    await api.delete(`${this.itemUrl}/${id}`, { headers: this.headers });
  }
}

export default TrainingPlanService;
