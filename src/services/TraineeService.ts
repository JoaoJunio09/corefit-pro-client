import { ParamsTraineeAPI } from '../models/trainee/ParamsTraineeAPI';
import { TraineeDetails } from '../models/trainee/TraineeDetails';
import { TraineeResponse } from '../models/trainee/TraineeResponse';
import { TraineeRequest } from '../models/trainee/TraineeRequest';
import api from './api';

class TraineeService {
	BASE_URL: string = '';
	private accessToken: string = '';

	constructor(accessToken: string) {
		this.BASE_URL = '/api/trainees/v1';
		this.accessToken = accessToken;
	}

	async getAll(params: ParamsTraineeAPI) {
		try {
			const response = await api.get<TraineeResponse[]>(this.BASE_URL, {
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
				console.log('Erro ao carregar todos os Alunos');
			}
			throw err;
		}
	}

	async getDetails(id: string | null) {
		if (!id) return null;
		const URL = `${this.BASE_URL}/details/${id}`;
		try {
			const response = await api.get<TraineeDetails>(URL, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${this.accessToken}`
				}
			});

			return response.data;
		}
		catch (err: any) {
			if (err.response?.status === 500) {
				console.log('Erro ao carregar detalhes do Aluno');
			}
			throw err;
		}
	}

	async create(trainee: TraineeRequest, photo: File | null) {
		const formData = new FormData();

		formData.append('trainee', new Blob([JSON.stringify(trainee)], {
			type: 'application/json'
		}));

		if (photo) formData.append('avatar', photo);

		const response = await api.post<TraineeResponse>(this.BASE_URL, formData, {
			headers: { 'Authorization': `Bearer ${this.accessToken}` }
		});

		return response.data;
	}
}

export default TraineeService;
