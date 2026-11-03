import api from "./api";
import { TrainingPlanDetails } from "./TrainingPlanService";

export interface StudentHome {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  personalTrainerName: string | null;
  weekStart: string;
  plan: TrainingPlanDetails | null;
}

export default class StudentService {
  private readonly baseUrl = "/api/student/v1";
  constructor(private readonly accessToken: string) {}
  private get config() {
    return { headers: { Authorization: `Bearer ${this.accessToken}` } };
  }
  async getHome() {
    return (await api.get<StudentHome>(this.baseUrl, this.config)).data;
  }
  async setCompleted(itemId: string, completed: boolean) {
    await api.patch(
      `${this.baseUrl}/trainings/${itemId}/completion`,
      { completed },
      this.config,
    );
  }
}
