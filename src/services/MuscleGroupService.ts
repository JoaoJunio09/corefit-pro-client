import { MuscleGroupResponse } from '../models/muscleGroup/MuscleGroupResponse';
import api from './api';

class MuscleGroupService {
  private readonly baseUrl = '/api/muscleGroups/v1';

  constructor(private readonly accessToken: string) {}

  async getAll() {
    const response = await api.get<MuscleGroupResponse[]>(this.baseUrl, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });

    return response.data;
  }
}

export default MuscleGroupService;
