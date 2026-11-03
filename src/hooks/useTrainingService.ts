import { useMemo } from "react";
import { useAuthContext } from "../context/AuthContext";
import TrainingService from "../services/TrainingService";

function useTrainingService() {
	const { auth } = useAuthContext();

	const trainingService = useMemo(
		() => new TrainingService(auth?.accessToken ?? ''),
		[auth?.accessToken]
	);

	return trainingService;
}

export default useTrainingService;