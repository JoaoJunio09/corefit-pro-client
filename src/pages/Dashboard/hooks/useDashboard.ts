import { useQuery } from 'react-query';
import { usePersonalTrainerContext } from '../../../context/PersonalTrainerContext';
import usePersonalTrainerService from '../../../hooks/usePersonalTrainerService';
import { calculateWorkoutPercentage, formatWorkoutPercentage } from '../../../utils/workoutProgress';

export default function useDashboard() {
  const { personalTrainer } = usePersonalTrainerContext();
  const service = usePersonalTrainerService();
  const query = useQuery(['dashboard', personalTrainer?.id], () => service.getDashboard(personalTrainer!.id), {
    enabled: Boolean(personalTrainer?.id), refetchOnWindowFocus: true
  });
  const percentageCompletedToday = calculateWorkoutPercentage(query.data?.workoutsCompletedToday ?? 0, query.data?.workoutsToday.length ?? 0);
  return { dashboard: query.data ?? null, percentageCompletedToday, percentageCompletedTodayLabel: formatWorkoutPercentage(percentageCompletedToday), loading: query.isLoading, error: query.error, retry: () => query.refetch() };
}
