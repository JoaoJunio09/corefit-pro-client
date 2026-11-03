import { ParamsTrainingAPI } from '../models/training/ParamsTrainingAPI';
import { TrainingRequest } from '../models/training/TrainingRequest';
import { TrainingResponse } from '../models/training/TrainingResponse';
import api from './api';

class TrainingService {
	BASE_URL: string = '';
	private accessToken: string = '';

	constructor(accessToken: string) {
		this.BASE_URL = '/api/trainings/v1';
		this.accessToken = accessToken;
	}

	async getAll(params: ParamsTrainingAPI) {
		try {
			const response = await api.get<TrainingResponse[]>(this.BASE_URL, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${this.accessToken}`
				},
				params
			});

			return response.data;
		}
		catch (err: any) {
			if (err.response?.status === 500) {
				console.log('Erro ao carregar todos os Trainamentos do Personal');
			}
			throw err;
		}
	}

	async create(training: TrainingRequest) {
		try {
			const response = await api.post<TrainingResponse>(this.BASE_URL, training, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${this.accessToken}`
				}
			});

			return response.data;
		}
		catch (err: any) {
			if (err.response?.status === 500) {
				console.log('Erro ao criar Treinamento');
			}
			throw err;
		}
	}

	async update(training: TrainingRequest) {
		try {
			const response = await api.put<TrainingResponse>(this.BASE_URL, training, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${this.accessToken}`
				}
			});

			return response.data;
		}
		catch (err: any) {
			if (err.response?.status === 500) {
				console.log('Erro ao atualizar Treinamento');
			}
			throw err;
		}
	}

	async delete(id: string) {
		await api.delete(`${this.BASE_URL}/${id}`, {
			headers: {
				'Authorization': `Bearer ${this.accessToken}`
			}
		});
	}
}

export default TrainingService;
