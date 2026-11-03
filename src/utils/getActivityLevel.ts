import { ActivityLevel } from "../types/ActivityLevel";

export function getActivityLevel(activityLevel: ActivityLevel) {
	switch (activityLevel) {
		case 'SEDENTARY': return 'Sedantário';
		case 'LIGHT': return 'Pouco Ativo';
		case 'MODERATE': return 'Moderado';
		case 'ACTIVE': return 'Ativo';
		case 'VERY_ACTIVE': return 'Muito Ativo';
	}
}