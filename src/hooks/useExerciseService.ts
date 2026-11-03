import { useMemo } from "react";
import { useAuthContext } from "../context/AuthContext";
import ExerciseService from "../services/ExerciseService";

function useExerciseService() {
	const { auth } = useAuthContext();

	const exerciseService = useMemo(
		() => new ExerciseService(auth?.accessToken ?? ''),
		[auth?.accessToken]
	);

	return exerciseService;
}

export default useExerciseService;