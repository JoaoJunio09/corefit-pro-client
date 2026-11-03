import { useMemo } from 'react';
import { useAuthContext } from '../context/AuthContext';
import PhysicalAssessmentService from '../services/PhysicalAssessmentService';

function usePhysicalAssessmentService() {
  const { auth } = useAuthContext();

  return useMemo(
    () => new PhysicalAssessmentService(auth?.accessToken ?? ''),
    [auth?.accessToken]
  );
}

export default usePhysicalAssessmentService;
