import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { usePersonalTrainerContext } from '../../../context/PersonalTrainerContext';
import usePhysicalAssessmentService from '../../../hooks/usePhysicalAssessmentService';
import useTraineeService from '../../../hooks/useTraineeService';
import { PhysicalAssessmentResponse } from '../../../models/physicalAssessment/PhysicalAssessmentRespons';
import { TraineeResponse } from '../../../models/trainee/TraineeResponse';

const PAGE_SIZE = 8;

export interface AssessmentSummary {
  assessment: PhysicalAssessmentResponse;
  trainee: TraineeResponse | null;
}

function useHistoricoAvaliacoes() {
  const { personalTrainer } = usePersonalTrainerContext();
  const physicalAssessmentService = usePhysicalAssessmentService();
  const traineeService = useTraineeService();
  const [searchParams, setSearchParams] = useSearchParams();
  const [traineeSearch, setTraineeSearch] = useState('');
  const [page, setPage] = useState(1);
  const selectedTraineeId = searchParams.get('traineeId') ?? '';

  const traineesQuery = useQuery(
    ['trainees', personalTrainer?.id],
    () => traineeService.getAll({ personalTrainerId: personalTrainer?.id }),
    { enabled: Boolean(personalTrainer?.id) }
  );

  const summariesQuery = useQuery(
    ['physical-assessment-summaries', personalTrainer?.id, selectedTraineeId],
    async (): Promise<AssessmentSummary[]> => {
      const assessments = await physicalAssessmentService.getAll(selectedTraineeId || undefined);
      const trainees = traineesQuery.data ?? [];

      if (selectedTraineeId) {
        const selectedTrainee = trainees.find(trainee => trainee.id === selectedTraineeId) ?? null;
        return assessments.map(assessment => ({ assessment, trainee: selectedTrainee }));
      }

      const details = await Promise.all(trainees.map(async trainee => ({
        trainee,
        details: await traineeService.getDetails(trainee.id)
      })));
      const traineeByAssessmentId = new Map<string, TraineeResponse>();
      details.forEach(({ trainee, details: traineeDetails }) => {
        traineeDetails?.physicalAssessments.forEach(assessment => traineeByAssessmentId.set(assessment.id, trainee));
      });

      return assessments.map(assessment => ({
        assessment,
        trainee: traineeByAssessmentId.get(assessment.id) ?? null
      }));
    },
    { enabled: traineesQuery.isSuccess }
  );

  const selectableTrainees = useMemo(() => {
    const search = traineeSearch.trim().toLowerCase();
    if (!search) return traineesQuery.data ?? [];
    return (traineesQuery.data ?? []).filter(trainee =>
      `${trainee.firstName} ${trainee.lastName}`.toLowerCase().includes(search)
    );
  }, [traineeSearch, traineesQuery.data]);

  const summaries = useMemo(() => (summariesQuery.data ?? [])
    .sort((first, second) => new Date(second.assessment.registeredAt).getTime() - new Date(first.assessment.registeredAt).getTime()), [summariesQuery.data]);

  const totalPages = Math.max(1, Math.ceil(summaries.length / PAGE_SIZE));
  const paginatedSummaries = summaries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selectTrainee = (traineeId: string) => {
    setPage(1);
    setTraineeSearch('');
    setSearchParams(traineeId ? { traineeId } : {});
  };

  return {
    isLoading: traineesQuery.isLoading || summariesQuery.isLoading,
    summaries: paginatedSummaries,
    selectableTrainees,
    selectedTraineeId,
    traineeSearch,
    setTraineeSearch,
    selectTrainee,
    page,
    totalPages,
    setPage
  };
}

export default useHistoricoAvaliacoes;
