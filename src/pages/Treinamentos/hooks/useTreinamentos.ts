import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { usePersonalTrainerContext } from '../../../context/PersonalTrainerContext';
import useExerciseService from '../../../hooks/useExerciseService';
import useMuscleGroupService from '../../../hooks/useMuscleGroupService';
import useTrainingService from '../../../hooks/useTrainingService';
import { ExerciseResponse } from '../../../models/exercise/ExerciseResponse';
import { TrainingRequest } from '../../../models/training/TrainingRequest';
import { TrainingResponse } from '../../../models/training/TrainingResponse';
import { ExerciseItemConfig, TrainingFormData, TreinamentosView } from '../types/treinamento.types';
import { apiError } from '../../../utils/apiError';

const EMPTY_FORM_DATA: TrainingFormData = { id: '', title: '', description: '', exercises: [] };
const EMPTY_EXERCISE_CONFIG: ExerciseItemConfig = { series: '', repetitions: '' };

function useTreinamentos() {
	const [searchParams, setSearchParams] = useSearchParams();
	const { personalTrainer } = usePersonalTrainerContext();
	const queryClient = useQueryClient();
	const trainingService = useTrainingService();
	const exerciseService = useExerciseService();
	const muscleGroupService = useMuscleGroupService();

	const [view, setView] = useState<TreinamentosView>(() => searchParams.has('novo') ? 'form' : 'list');
	useEffect(() => {
		if (searchParams.has('novo')) { setView('form'); setSearchParams({}, { replace: true }); }
	}, [searchParams, setSearchParams]);
	const [searchQuery, setSearchQuery] = useState('');
	const [currentTraining, setCurrentTraining] = useState<TrainingResponse | null>(null);
	const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
	const [formData, setFormData] = useState<TrainingFormData>(EMPTY_FORM_DATA);
	const [exerciseConfig, setExerciseConfig] = useState<ExerciseItemConfig>(EMPTY_EXERCISE_CONFIG);
	const [exerciseSearch, setExerciseSearch] = useState('');
	const [selectedExerciseDef, setSelectedExerciseDef] = useState<ExerciseResponse | null>(null);
	const [selectedMuscleGroupIds, setSelectedMuscleGroupIds] = useState<string[]>([]);
	const [formError, setFormError] = useState<string | null>(null);

	const trainingsQueryKey = ['trainings', personalTrainer?.id];
	const queryTrainings = useQuery(trainingsQueryKey, () => trainingService.getAll({ personalTrainerId: personalTrainer?.id }), { enabled: Boolean(personalTrainer?.id), retry: 3 });
	const queryExercises = useQuery(['exercises', personalTrainer?.id], () => exerciseService.getAll({ personalTrainerId: personalTrainer?.id }), { enabled: Boolean(personalTrainer?.id) });
	const queryMuscleGroups = useQuery(['muscle-groups'], () => muscleGroupService.getAll(), { retry: 3 });

	const refreshTrainings = () => queryClient.invalidateQueries(trainingsQueryKey);
	const createMutation = useMutation(trainingService.create.bind(trainingService), { onSuccess: refreshTrainings });
	const updateMutation = useMutation(trainingService.update.bind(trainingService), { onSuccess: refreshTrainings });
	const deleteMutation = useMutation(trainingService.delete.bind(trainingService), { onSuccess: refreshTrainings });

	const trainings = useMemo(() => queryTrainings.data ?? [], [queryTrainings.data]);
	const exercises = useMemo(() => queryExercises.data ?? [], [queryExercises.data]);
	const muscleGroups = queryMuscleGroups.data ?? [];
	const filteredTrainings = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		if (!query) return trainings;
		return trainings.filter(({ title, description }) => title.toLowerCase().includes(query) || (description ?? '').toLowerCase().includes(query));
	}, [searchQuery, trainings]);
	const exerciseSearchResults = useMemo(() => {
		const query = exerciseSearch.trim().toLowerCase();
		if (!query) return [];
		return exercises.filter(exercise => exercise.name.toLowerCase().includes(query));
	}, [exerciseSearch, exercises]);

	const openCreate = () => {
		setFormData(EMPTY_FORM_DATA);
		setSelectedMuscleGroupIds([]);
		setSelectedExerciseDef(null);
		setExerciseSearch('');
		setExerciseConfig(EMPTY_EXERCISE_CONFIG);
		setFormError(null);
		setView('form');
	};
	const openEdit = (training: TrainingResponse) => {
		setFormData({ id: training.id, title: training.title, description: training.description, exercises: training.exercises.map(item => ({ id: item.id, exerciseId: item.exercise.id, exerciseName: item.exercise.name, series: item.series, repetitions: item.repetitions })) });
		setSelectedMuscleGroupIds(training.muscleGroups.map(group => group.id));
		setSelectedExerciseDef(null);
		setExerciseSearch('');
		setExerciseConfig(EMPTY_EXERCISE_CONFIG);
		setFormError(null);
		setView('form');
	};
	const openDetails = (training: TrainingResponse) => { setCurrentTraining(training); setView('details'); };
	const closeForm = () => { setFormError(null); setView('list'); };
	const toggleMuscleGroup = (id: string) => setSelectedMuscleGroupIds(current => current.includes(id) ? current.filter(groupId => groupId !== id) : [...current, id]);
	const selectExercise = (exercise: ExerciseResponse) => { setSelectedExerciseDef(exercise); setExerciseSearch(''); };
	const addExercise = () => {
		const series = Number(exerciseConfig.series);
		const repetitions = Number(exerciseConfig.repetitions);
		if (!selectedExerciseDef || !Number.isInteger(series) || series < 1 || !Number.isInteger(repetitions) || repetitions < 1) {
			setFormError('Informe números inteiros maiores que zero para séries e repetições.');
			return;
		}
		setFormData(current => ({ ...current, exercises: [...current.exercises, { exerciseId: selectedExerciseDef.id, exerciseName: selectedExerciseDef.name, series, repetitions }] }));
		setSelectedExerciseDef(null);
		setExerciseConfig(EMPTY_EXERCISE_CONFIG);
		setFormError(null);
	};
	const removeExercise = (index: number) => setFormData(current => ({ ...current, exercises: current.exercises.filter((_, currentIndex) => currentIndex !== index) }));
	const saveTraining = async () => {
		if (!personalTrainer?.id) return setFormError('Não foi possível identificar o personal trainer.');
		if (!formData.title.trim() || !formData.description.trim()) return setFormError('Preencha o nome e a descrição do treinamento.');
		if (!selectedMuscleGroupIds.length) return setFormError('Selecione ao menos um agrupamento muscular.');
		if (!formData.exercises.length) return setFormError('Adicione ao menos um exercício ao treinamento.');
		const request: TrainingRequest = { ...(formData.id ? { id: formData.id } : {}), title: formData.title.trim(), description: formData.description.trim(), personalTrainerId: personalTrainer.id, muscleGroupsId: selectedMuscleGroupIds, exerciseItems: formData.exercises.map(({ id, exerciseId, series, repetitions }) => ({ ...(id ? { id } : {}), exerciseId, series, repetitions })) };
		try {
			if (formData.id) await updateMutation.mutateAsync(request);
			else await createMutation.mutateAsync(request);
			closeForm();
		} catch {
			setFormError('Não foi possível salvar o treinamento. Tente novamente.');
		}
	};
	const requestDelete = (id: string) => {
		setFormError(null);
		setDeleteConfirmId(id);
	};
	const confirmDelete = async () => {
		if (!deleteConfirmId) return;
		try {
			await deleteMutation.mutateAsync(deleteConfirmId);
			if (currentTraining?.id === deleteConfirmId) setView('list');
			setDeleteConfirmId(null);
		} catch { setFormError('Não foi possível excluir o treinamento. Tente novamente.'); }
	};

	return { loading: queryTrainings.isLoading, loadError: queryTrainings.error ? apiError(queryTrainings.error) : null, retry: () => { void queryTrainings.refetch(); }, view, setView, searchQuery, setSearchQuery, currentTraining, deleteConfirmId, setDeleteConfirmId, formData, setFormData, exerciseConfig, setExerciseConfig, exerciseSearch, setExerciseSearch, selectedExerciseDef, setSelectedExerciseDef, selectedMuscleGroupIds, filteredTrainings, exerciseSearchResults, muscleGroups, trainingToDelete: trainings.find(training => training.id === deleteConfirmId), formError, isSaving: createMutation.isLoading || updateMutation.isLoading, isDeleting: deleteMutation.isLoading, openCreate, openEdit, openDetails, closeForm, toggleMuscleGroup, selectExercise, addExercise, removeExercise, saveTraining, requestDelete, confirmDelete };
}

export default useTreinamentos;
