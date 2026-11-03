import { PhysicalAssessmentRequest } from '../models/physicalAssessment/PhysicalAssessmentRequest';
import { PhysicalAssessmentResponse } from '../models/physicalAssessment/PhysicalAssessmentRespons';
import api from './api';

class PhysicalAssessmentService {
  private readonly BASE_URL = '/api/physicalAssessments/v1';

  constructor(private readonly accessToken: string) {}

  async getAll(traineeId?: string) {
    const response = await api.get<PhysicalAssessmentResponse[]>(this.BASE_URL, {
      headers: { 'Authorization': `Bearer ${this.accessToken}` },
      params: traineeId ? { traineeId } : undefined
    });

    return response.data;
  }

  async update(physicalAssessment: PhysicalAssessmentRequest) {
    const response = await api.put<PhysicalAssessmentResponse>(this.BASE_URL, physicalAssessment, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    return response.data;
  }

  async updatePhotos(
    id: string,
    frontPhoto: File | null,
    backPhoto: File | null,
    leftPhoto: File | null,
    rightPhoto: File | null
  ) {
    const formData = new FormData();
    if (frontPhoto) formData.append('frontPhoto', frontPhoto);
    if (backPhoto) formData.append('backPhoto', backPhoto);
    if (leftPhoto) formData.append('leftPhoto', leftPhoto);
    if (rightPhoto) formData.append('rightPhoto', rightPhoto);

    const response = await api.put<PhysicalAssessmentResponse>(`${this.BASE_URL}/${id}/photos`, formData, {
      headers: { 'Authorization': `Bearer ${this.accessToken}` }
    });

    return response.data;
  }

  async create(
    physicalAssessment: PhysicalAssessmentRequest,
    frontPhoto: File | null,
    backPhoto: File | null,
    leftPhoto: File | null,
    rightPhoto: File | null
  ) {

    const formData = new FormData();

		formData.append(
			'physicalAssessment',
			new Blob([JSON.stringify(physicalAssessment)], {
				type: 'application/json'
			})
		);

		if (frontPhoto) formData.append('frontPhoto', frontPhoto);
		if (backPhoto) formData.append('backPhoto', backPhoto);
		if (leftPhoto) formData.append('leftPhoto', leftPhoto);
		if (rightPhoto) formData.append('rightPhoto', rightPhoto);
    
    const response = await api.post<PhysicalAssessmentResponse>(this.BASE_URL, formData, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    return response.data;
  }
}

export default PhysicalAssessmentService;
