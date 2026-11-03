import { useMemo } from 'react';
import { useAuthContext } from '../context/AuthContext';
import MuscleGroupService from '../services/MuscleGroupService';

function useMuscleGroupService() {
  const { auth } = useAuthContext();

  return useMemo(
    () => new MuscleGroupService(auth?.accessToken ?? ''),
    [auth?.accessToken]
  );
}

export default useMuscleGroupService;
