import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { usePersonalTrainerContext } from '../../../context/PersonalTrainerContext';
import useExerciseService from '../../../hooks/useExerciseService';
import useMuscleGroupService from '../../../hooks/useMuscleGroupService';
import { ExerciseRequest } from '../../../models/exercise/ExerciseRequest';
import { ExerciseResponse } from '../../../models/exercise/ExerciseResponse';
import { ActiveTab, ExerciseFormData } from '../types/exercicio.types';
import { apiError } from '../../../utils/apiError';

const EMPTY_FORM_DATA: ExerciseFormData = {
  name: '',
  photo: null,
  videoUrl: '',
  muscleGroupsId: []
};

export function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    const isYoutubeHost = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be'].includes(parsedUrl.hostname);
    if (!isYoutubeHost) return null;

    const videoId = parsedUrl.hostname === 'youtu.be'
      ? parsedUrl.pathname.slice(1)
      : parsedUrl.searchParams.get('v') ?? parsedUrl.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/)?.[1];

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

function useExercicios() {
  // ---------------------------------------------------------------------
  // Contexto e serviço
  // ---------------------------------------------------------------------
  const { personalTrainer } = usePersonalTrainerContext();
  const exerciseService = useExerciseService();
  const muscleGroupService = useMuscleGroupService();
  const queryClient = useQueryClient();
  const exercisesQueryKey = ['exercises', personalTrainer?.id];

  // ---------------------------------------------------------------------
  // Estado de UI (busca, aba ativa, modais e formulário)
  // ---------------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');
  const [selectedExercise, setSelectedExercise] = useState<ExerciseResponse | null>(null);
  const [editingExercise, setEditingExercise] = useState<ExerciseResponse | null>(null);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<ExerciseResponse | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<ExerciseFormData>(EMPTY_FORM_DATA);
  const [formError, setFormError] = useState<string | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);

  // ---------------------------------------------------------------------
  // Dados remotos (React Query)
  // ---------------------------------------------------------------------
  const exercisesQuery = useQuery(
    exercisesQueryKey,
    () => exerciseService.getAll({ personalTrainerId: personalTrainer?.id }),
    {
      retry: 3,
      enabled: Boolean(personalTrainer?.id) // evita buscar antes do contexto carregar
    }
  );

  const refreshExercises = () => queryClient.invalidateQueries(exercisesQueryKey);

  const muscleGroupsQuery = useQuery(['muscle-groups'], () => muscleGroupService.getAll(), {
    retry: 3
  });

  const buildRequestPayload = (data: ExerciseFormData): ExerciseRequest => ({
    id: data.id,
    name: data.name,
    videoUrl: data.videoUrl,
    favorite: false,
    personalTrainerId: personalTrainer?.id,
    muscleGroupsId: data.muscleGroupsId
  });

  const extractPhotoFile = (data: ExerciseFormData): File | null =>
    data.photo instanceof File ? data.photo : null;

  const createMutation = useMutation(
    (data: ExerciseFormData) => exerciseService.create(buildRequestPayload(data), extractPhotoFile(data)),
    { onSuccess: refreshExercises }
  );

  const updateMutation = useMutation(
    (data: ExerciseFormData) => exerciseService.update(buildRequestPayload(data), extractPhotoFile(data)),
    { onSuccess: refreshExercises }
  );

  const deleteMutation = useMutation(
    (id: string) => exerciseService.delete(id),
    { onSuccess: refreshExercises }
  );

  const favoriteMutation = useMutation(
    ({ id, favorite }: { id: string, favorite: boolean }) => exerciseService.toggleFavorite(id, favorite),
    {
      onSuccess: updatedExercise => {
        queryClient.setQueryData<ExerciseResponse[]>(exercisesQueryKey, currentExercises =>
          currentExercises?.map(exercise => exercise.id === updatedExercise.id ? updatedExercise : exercise) ?? []
        );
        setSelectedExercise(currentExercise =>
          currentExercise?.id === updatedExercise.id ? updatedExercise : currentExercise
        );
      }
    }
  );

  // ---------------------------------------------------------------------
  // Dados derivados (contagens e filtro da lista)
  // ---------------------------------------------------------------------
  const exercises = useMemo(() => exercisesQuery.data ?? [], [exercisesQuery.data]);
  const muscleGroups = muscleGroupsQuery.data ?? [];
  const videoPreviewUrl = useMemo(() => formData.videoUrl.trim(), [formData.videoUrl]);
  const videoEmbedUrl = useMemo(() => getYoutubeEmbedUrl(videoPreviewUrl), [videoPreviewUrl]);

  useEffect(() => {
    if (!(formData.photo instanceof File)) {
      setPhotoPreviewUrl(typeof formData.photo === 'string' ? formData.photo : null);
      return;
    }

    const objectUrl = URL.createObjectURL(formData.photo);
    setPhotoPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [formData.photo]);

  const counts = useMemo(() => ({
    all: exercises.length,
    favorites: exercises.filter(exercise => exercise.favorite).length,
    system: exercises.filter(exercise => exercise.system).length,
    personal: exercises.filter(exercise => !exercise.system).length
  }), [exercises]);

  const filteredExercises = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return exercises.filter(exercise => {
      if (activeTab === 'favorites' && !exercise.favorite) return false;
      if (activeTab === 'system' && !exercise.system) return false;
      if (activeTab === 'personal' && exercise.system) return false;

      if (!query) return true;

      const matchesName = exercise.name.toLowerCase().includes(query);
      const matchesMuscleGroup = exercise.muscleGroups.some(group => group.name.toLowerCase().includes(query));
      return matchesName || matchesMuscleGroup;
    });
  }, [activeTab, exercises, searchQuery]);

  // ---------------------------------------------------------------------
  // Formulário (criar / editar)
  // ---------------------------------------------------------------------
  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Selecione um arquivo de imagem válido.');
      return;
    }

    setFormData(prev => ({ ...prev, photo: file }));
    setFormError(null);
  };

  const toggleMuscleGroup = (id: string) => {
    setFormData(prev => ({
      ...prev,
      muscleGroupsId: prev.muscleGroupsId.includes(id)
        ? prev.muscleGroupsId.filter(groupId => groupId !== id)
        : [...prev.muscleGroupsId, id]
    }));
  };

  const toggleFavorite = async (exercise: ExerciseResponse) => {
    setFormError(null);
    try {
      await favoriteMutation.mutateAsync({ id: exercise.id, favorite: !exercise.favorite });
    } catch {
      setFormError('Não foi possível atualizar o favorito Tente novamente.');
    }
  };

  const openCreate = () => {
    setEditingExercise(null);
    setFormData(EMPTY_FORM_DATA);
    setFormError(null);
    setIsFormOpen(true);
  };

  const openEdit = (exercise: ExerciseResponse) => {
    setEditingExercise(exercise);
    setFormData({
      id: exercise.id,
      name: exercise.name,
      photo: exercise.photoKey ?? '', // URL temporária já existente, usada só como prévia
      videoUrl: exercise.videoKey ?? '',
      muscleGroupsId: exercise.muscleGroups.map(group => group.id)
    });
    setSelectedExercise(null);
    setFormError(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setFormError(null);
  };

  const saveExercise = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setFormError('Informe o nome do exercício.');
      return;
    }

    if (!formData.muscleGroupsId.length) {
      setFormError('Selecione ao menos um agrupamento muscular.');
      return;
    }

    try {
      if (editingExercise) {
        await updateMutation.mutateAsync(formData);
      } else {
        await createMutation.mutateAsync(formData);
      }
      closeForm();
    } catch {
      setFormError('Não foi possível salvar o exercício. Tente novamente.');
    }
  };

  // ---------------------------------------------------------------------
  // Exclusão
  // ---------------------------------------------------------------------
  const openDelete = (exercise: ExerciseResponse) => {
    setFormError(null);
    setDeleteConfirmTarget(exercise);
  };

  const closeDelete = () => {
    setDeleteConfirmTarget(null);
    setFormError(null);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmTarget) return;

    try {
      await deleteMutation.mutateAsync(deleteConfirmTarget.id);
      if (selectedExercise?.id === deleteConfirmTarget.id) setSelectedExercise(null);
      closeDelete();
    } catch {
      setFormError('Não foi possível excluir o exercício. Tente novamente.');
    }
  };

  // ---------------------------------------------------------------------
  // API exposta para a página
  // ---------------------------------------------------------------------
  return {
    loading: exercisesQuery.isLoading,
    loadError: exercisesQuery.error ? apiError(exercisesQuery.error) : null,
    retry: () => { void exercisesQuery.refetch(); },
    // busca e filtro
    searchQuery, setSearchQuery, activeTab, setActiveTab, filteredExercises, counts,

    // detalhes / seleção
    selectedExercise, setSelectedExercise, toggleFavorite, isUpdatingFavorite: favoriteMutation.isLoading,

    // formulário
    isFormOpen, formData, setFormData, editingExercise, formError, handlePhotoChange,
    muscleGroups, toggleMuscleGroup, photoPreviewUrl, videoPreviewUrl, videoEmbedUrl,
    openCreate, openEdit, closeForm, saveExercise, isSaving: createMutation.isLoading || updateMutation.isLoading,

    // exclusão
    deleteConfirmTarget, openDelete, closeDelete, confirmDelete, isDeleting: deleteMutation.isLoading
  };
}

export default useExercicios;
