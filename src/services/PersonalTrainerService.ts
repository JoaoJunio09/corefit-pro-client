import { DashboardResponse } from '../models/personalTrainer/DashboardResponse';
import { PersonalTrainerResponse } from '../models/personalTrainer/PersonalTrainerResponse';
import api from './api';

export default class PersonalTrainerService {
  private readonly baseUrl = '/api/personalTrainers/v1';
  constructor(private readonly accessToken: string) {}
  private get config() { return { headers: { Authorization: `Bearer ${this.accessToken}` } }; }
  async getAll() { return (await api.get<PersonalTrainerResponse[]>(this.baseUrl, this.config)).data; }
  async getDashboard(id: string) { return (await api.get<DashboardResponse>(`${this.baseUrl}/dashboard/${id}`, this.config)).data; }
  async getById(id: string) { return (await api.get<PersonalTrainerResponse>(`${this.baseUrl}/${id}`, this.config)).data; }
  async getByUsername(username: string) {
    return (await api.get<PersonalTrainerResponse>(`${this.baseUrl}/username/${encodeURIComponent(username)}`, this.config)).data;
  }
}
