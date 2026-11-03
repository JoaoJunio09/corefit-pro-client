import { useQuery } from 'react-query';
import { usePersonalTrainerContext } from '../../../context/PersonalTrainerContext';
import usePersonalTrainerService from '../../../hooks/usePersonalTrainerService';

export default function useDashboard() {
  const { personalTrainer } = usePersonalTrainerContext();
  const service = usePersonalTrainerService();
  const query = useQuery(['dashboard', personalTrainer?.id], () => service.getDashboard(personalTrainer!.id), {
    enabled: Boolean(personalTrainer?.id), refetchOnWindowFocus: true
  });
  return { dashboard: query.data ?? null, loading: query.isLoading, error: query.error, retry: () => query.refetch() };
}
