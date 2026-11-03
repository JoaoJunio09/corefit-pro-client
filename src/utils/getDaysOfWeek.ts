import { DaysOfWeek } from "../types/DaysOfWeek";

export default function getDaysOfWeek(dayOfWeek: DaysOfWeek) {
	switch (dayOfWeek) {
		case 'MONDAY': return 'SEG'
		case 'TUESDAY': return 'TER'
		case 'WEDNESDAY': return 'QUA'
		case 'THURSDAY': return 'QUI'
		case 'FRIDAY': return 'SEX'
		case 'SATURDAY': return 'SAB'
		case 'SUNDAY': return 'DOM'
	}
}