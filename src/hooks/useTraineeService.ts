import { useMemo } from "react";
import { useAuthContext } from "../context/AuthContext";
import TraineeService from "../services/TraineeService";

function useTraineeService() {
	const { auth } = useAuthContext();

	const traineeService = useMemo(
		() => new TraineeService(auth?.accessToken ?? ''),
		[auth?.accessToken]
	);

	return traineeService;
}

export default useTraineeService;