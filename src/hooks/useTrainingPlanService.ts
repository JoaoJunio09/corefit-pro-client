import { useMemo } from 'react';
import { useAuthContext } from '../context/AuthContext';
import TrainingPlanService from '../services/TrainingPlanService';

export default function useTrainingPlanService() {
  const { auth } = useAuthContext();
  return useMemo(() => new TrainingPlanService(auth?.accessToken ?? ''), [auth?.accessToken]);
}
