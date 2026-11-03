import { ExerciseResponse } from '../models/exercise/ExerciseResponse';
import { ExerciseRequest } from '../models/exercise/ExerciseRequest';
import { ParamsExerciseAPI } from '../models/exercise/ParamsExerciseAPI';
import api from './api';

class ExerciseService {
	BASE_URL: string = '';
	private accessToken: string = '';

	constructor(accessToken: string) {
		this.BASE_URL = '/api/exercises/v1';
		this.accessToken = accessToken;
	}

	async getAll(params: ParamsExerciseAPI) {
		try {
			const response = await api.get<ExerciseResponse[]>(this.BASE_URL, {
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
				console.log('Erro ao carregar todos os Exercícios');
			}
			throw err;
		}
	}

	async create(exercise: ExerciseRequest, image: File | null) {
		const formData = new FormData();

		formData.append(
			'exercise',
			new Blob([JSON.stringify(exercise)], {
				type: 'application/json'
			})
		);

		if (image) {
			formData.append('file', image);
		}

		const response = await api.post<ExerciseResponse>(this.BASE_URL, formData, {
			headers: {
				'Authorization': `Bearer ${this.accessToken}`
			}
		});

		return response.data;
	}

	async update(exercise: ExerciseRequest, image: File | null) {
		const formData = new FormData();

		formData.append(
			'exercise',
			new Blob([JSON.stringify(exercise)], {
				type: 'application/json'
			})
		);

		if (image) {
			formData.append('file', image);
		}

		const response = await api.put<ExerciseResponse>(this.BASE_URL, formData, {
			headers: {
				'Authorization': `Bearer ${this.accessToken}`
			}
		});

		return response.data;
	}

	async delete(id: string) {
		await api.delete(`${this.BASE_URL}/${id}`, {
			headers: { 'Authorization': `Bearer ${this.accessToken}` }
		});
	}

	async toggleFavorite(id: string, favorite: boolean) {
		const response = await api.patch<ExerciseResponse>(`${this.BASE_URL}/toggleFavorite/${id}`, favorite, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${this.accessToken}`
			}
		});

		return response.data;
	}
}

export default ExerciseService;