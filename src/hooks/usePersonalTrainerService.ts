import { useMemo } from "react";
import { useAuthContext } from "../context/AuthContext";
import PersonalTrainerService from "../services/PersonalTrainerService";

function usePersonalTrainerService() {
	const { auth } = useAuthContext();

	const personalTrainerService = useMemo(
		() => new PersonalTrainerService(auth?.accessToken ?? ''),
		[auth?.accessToken]
	);

	return personalTrainerService;
}

export default usePersonalTrainerService;