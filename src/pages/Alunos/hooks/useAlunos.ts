import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { usePersonalTrainerContext } from '../../../context/PersonalTrainerContext';
import { TraineeRequest } from '../../../models/trainee/TraineeRequest';
import useTraineeService from '../../../hooks/useTraineeService';
import usePhysicalAssessmentService from '../../../hooks/usePhysicalAssessmentService';
import { PhysicalAssessmentRequest } from '../../../models/physicalAssessment/PhysicalAssessmentRequest';
import {
  PhysicalAssessmentFormData,
  PhysicalAssessmentMutationData,
  PhysicalAssessmentPhotoPosition,
  TraineeFormData
} from '../types/aluno.types';
import { PhysicalAssessmentResponse } from '../../../models/physicalAssessment/PhysicalAssessmentRespons';

const EMPTY_FORM_DATA: TraineeFormData = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  recoveryEmail: '',
  password: '',
  confirmPassword: '',
  photo: null
};

interface CreateTraineePayload {
  trainee: TraineeRequest;
  photo: File | null;
}

const getCurrentLocalDate = () => {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 10);
};

const createEmptyPhysicalAssessment = (age: number): PhysicalAssessmentFormData => ({
  registeredAt: getCurrentLocalDate(),
  age,
  weight: '',
  height: '',
  bodyFat: '',
  fatMass: '',
  muscleMass: '',
  chest: '',
  waist: '',
  abdomen: '',
  hip: '',
  rightArm: '',
  leftArm: '',
  rightThigh: '',
  leftThigh: '',
  activityLevel: '',
  notes: '',
  photos: {
    front: null,
    back: null,
    left: null,
    right: null
  }
});

const toNumberOrNull = (value: string) => {
  if (value.trim() === '') return null;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
};

const ALLOWED_ASSESSMENT_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

const isAllowedAssessmentImage = (file: File) => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return file.type.startsWith('image/') && Boolean(extension && ALLOWED_ASSESSMENT_IMAGE_EXTENSIONS.includes(extension));
};

const getApiErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (!axios.isAxiosError(error)) return fallbackMessage;

  const responseData = error.response?.data;
  if (typeof responseData === 'string' && responseData.trim()) return responseData;
  if (responseData && typeof responseData === 'object' && typeof responseData.message === 'string') {
    return responseData.message;
  }

  return fallbackMessage;
};

function useAlunos() {
  const [traineeSelectedId, setTraineeSelectedId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState<TraineeFormData>(EMPTY_FORM_DATA);
  const [formError, setFormError] = useState<string | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [isPhysicalAssessmentOpen, setIsPhysicalAssessmentOpen] = useState(false);
  const [physicalAssessmentForm, setPhysicalAssessmentForm] = useState<PhysicalAssessmentFormData>(() => createEmptyPhysicalAssessment(0));
  const [physicalAssessmentError, setPhysicalAssessmentError] = useState<string | null>(null);
  const [isSavingAssessmentPhotos, setIsSavingAssessmentPhotos] = useState(false);
  const [editingPhysicalAssessment, setEditingPhysicalAssessment] = useState<PhysicalAssessmentResponse | null>(null);
  const [physicalAssessmentPhotoPreviews, setPhysicalAssessmentPhotoPreviews] = useState<Record<PhysicalAssessmentPhotoPosition, string | null>>({
    front: null,
    back: null,
    left: null,
    right: null
  });

  const { personalTrainer } = usePersonalTrainerContext();
  const traineeService = useTraineeService();
  const physicalAssessmentService = usePhysicalAssessmentService();
  const queryClient = useQueryClient();
  const traineesQueryKey = ['trainees', personalTrainer?.id];

  const queryTrainees = useQuery({
    queryKey: traineesQueryKey,
    queryFn: () => traineeService.getAll({ personalTrainerId: personalTrainer?.id }),
    retry: 3,
    enabled: Boolean(personalTrainer?.id)
  });

  const queryDetailsTrainee = useQuery({
    queryKey: ['trainee', traineeSelectedId],
    queryFn: () => traineeService.getDetails(traineeSelectedId),
    retry: 3,
    enabled: Boolean(traineeSelectedId)
  });

  const createMutation = useMutation(
    async ({ trainee, photo }: CreateTraineePayload) => {
      return traineeService.create(trainee, photo);
    },
    { onSuccess: () => queryClient.invalidateQueries(traineesQueryKey) }
  );

  const createPhysicalAssessmentMutation = useMutation<
    PhysicalAssessmentResponse,
    Error,
    PhysicalAssessmentMutationData
  >(
    ({
      physicalAssessment,
      frontPhoto,
      backPhoto,
      leftPhoto,
      rightPhoto
    }) =>
      physicalAssessmentService.create(
        physicalAssessment,
        frontPhoto,
        backPhoto,
        leftPhoto,
        rightPhoto
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['trainee', traineeSelectedId]);
        queryClient.invalidateQueries(traineesQueryKey);
      }
    }
  );

  const updatePhysicalAssessmentMutation = useMutation(
    (physicalAssessment: PhysicalAssessmentRequest) => physicalAssessmentService.update(physicalAssessment),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['trainee', traineeSelectedId]);
        queryClient.invalidateQueries(traineesQueryKey);
      }
    }
  );

  const calculatedImc = useMemo(() => {
    const weight = toNumberOrNull(physicalAssessmentForm.weight);
    const height = toNumberOrNull(physicalAssessmentForm.height);

    if (!weight || !height || height <= 0) return null;
    return Number((weight / (height * height)).toFixed(2));
  }, [physicalAssessmentForm.height, physicalAssessmentForm.weight]);

  useEffect(() => {
    if (!formData.photo) {
      setPhotoPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(formData.photo);
    setPhotoPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [formData.photo]);

  useEffect(() => {
    const objectUrls = (Object.entries(physicalAssessmentForm.photos) as [PhysicalAssessmentPhotoPosition, File | null][])
      .reduce<Record<PhysicalAssessmentPhotoPosition, string | null>>((previews, [position, photo]) => {
        previews[position] = photo ? URL.createObjectURL(photo) : null;
        return previews;
      }, { front: null, back: null, left: null, right: null });

    setPhysicalAssessmentPhotoPreviews(objectUrls);
    return () => Object.values(objectUrls).forEach(url => url && URL.revokeObjectURL(url));
  }, [physicalAssessmentForm.photos]);

  const openCreate = () => {
    setTraineeSelectedId(null);
    setFormData(EMPTY_FORM_DATA);
    setFormError(null);
    setIsCreateOpen(true);
  };

  const closeCreate = () => {
    setIsCreateOpen(false);
    setFormError(null);
  };

  const openPhysicalAssessment = (age: number) => {
    setEditingPhysicalAssessment(null);
    setPhysicalAssessmentForm(createEmptyPhysicalAssessment(age));
    setPhysicalAssessmentError(null);
    setIsPhysicalAssessmentOpen(true);
  };

  const openEditPhysicalAssessment = (assessment: PhysicalAssessmentResponse) => {
    setEditingPhysicalAssessment(assessment);
    setPhysicalAssessmentForm({
      registeredAt: assessment.registeredAt,
      age: assessment.age,
      weight: String(assessment.weight ?? ''),
      height: String(assessment.height ?? ''),
      bodyFat: String(assessment.bodyFat ?? ''),
      fatMass: String(assessment.fatMass ?? ''),
      muscleMass: String(assessment.muscleMass ?? ''),
      chest: String(assessment.chest ?? ''),
      waist: String(assessment.waist ?? ''),
      abdomen: String(assessment.abdomen ?? ''),
      hip: String(assessment.hip ?? ''),
      rightArm: String(assessment.rightArm ?? ''),
      leftArm: String(assessment.leftArm ?? ''),
      rightThigh: String(assessment.rightThigh ?? ''),
      leftThigh: String(assessment.leftThigh ?? ''),
      activityLevel: assessment.activityLevel ?? '',
      notes: assessment.notes ?? '',
      photos: { front: null, back: null, left: null, right: null }
    });
    setPhysicalAssessmentError(null);
    setIsPhysicalAssessmentOpen(true);
  };

  const closePhysicalAssessment = () => {
    setIsPhysicalAssessmentOpen(false);
    setEditingPhysicalAssessment(null);
    setPhysicalAssessmentError(null);
  };

  const updatePhysicalAssessmentField = <Field extends keyof PhysicalAssessmentFormData>(
    field: Field,
    value: PhysicalAssessmentFormData[Field]
  ) => {
    setPhysicalAssessmentForm(current => ({ ...current, [field]: value }));
  };

  const handlePhysicalAssessmentPhotoChange = (
    position: PhysicalAssessmentPhotoPosition,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const photo = event.target.files?.[0] ?? null;
    if (!photo) return;

    if (!isAllowedAssessmentImage(photo)) {
      setPhysicalAssessmentError('Use imagens JPG, JPEG, PNG ou WEBP nas fotos da avaliação.');
      return;
    }

    setPhysicalAssessmentForm(current => ({
      ...current,
      photos: { ...current.photos, [position]: photo }
    }));
    setPhysicalAssessmentError(null);
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const photo = event.target.files?.[0] ?? null;
    if (!photo) return;

    if (!photo.type.startsWith('image/')) {
      setFormError('Selecione um arquivo de imagem válido.');
      return;
    }

    setFormData(current => ({ ...current, photo }));
    setFormError(null);
  };

  const saveTrainee = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!personalTrainer?.id) return setFormError('Não foi possível identificar o personal trainer.');
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      return setFormError('Preencha o primeiro nome e o sobrenome do aluno.');
    }
    if (!formData.username.trim() || !formData.email.trim() || !formData.password) {
      return setFormError('Preencha os dados de acesso obrigatórios.');
    }
    if (formData.password !== formData.confirmPassword) {
      return setFormError('As senhas informadas não coincidem.');
    }

    try {
      await createMutation.mutateAsync({
        trainee: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          username: formData.username.trim(),
          personalTrainerId: personalTrainer.id,
          credentials: {
            username: formData.username.trim(),
            email: formData.email.trim(),
            recoveryEmail: formData.recoveryEmail.trim() || undefined,
            fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
            password: formData.password
          }
        },
        photo: formData.photo
      });
      closeCreate();
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Não foi possível concluir o cadastro. Verifique os dados e tente novamente.'));
    }
  };

  const savePhysicalAssessment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!traineeSelectedId) {
      setPhysicalAssessmentError('Não foi possível identificar o aluno para esta avaliação.');
      return;
    }

    const weight = toNumberOrNull(physicalAssessmentForm.weight);
    const height = toNumberOrNull(physicalAssessmentForm.height);
    if (!weight || !height || weight <= 0 || height <= 0) {
      setPhysicalAssessmentError('Informe peso e altura com valores maiores que zero.');
      return;
    }
    if (!physicalAssessmentForm.registeredAt) {
      setPhysicalAssessmentError('Informe a data em que a avaliação foi realizada.');
      return;
    }

    const physicalAssessment: PhysicalAssessmentRequest = {
      ...(editingPhysicalAssessment ? { id: editingPhysicalAssessment.id } : {}),
      traineeId: traineeSelectedId,
      registeredAt: physicalAssessmentForm.registeredAt,
      age: physicalAssessmentForm.age,
      weight,
      height,
      imc: calculatedImc,
      bodyFat: toNumberOrNull(physicalAssessmentForm.bodyFat),
      fatMass: toNumberOrNull(physicalAssessmentForm.fatMass),
      muscleMass: toNumberOrNull(physicalAssessmentForm.muscleMass),
      chest: toNumberOrNull(physicalAssessmentForm.chest),
      waist: toNumberOrNull(physicalAssessmentForm.waist),
      abdomen: toNumberOrNull(physicalAssessmentForm.abdomen),
      hip: toNumberOrNull(physicalAssessmentForm.hip),
      rightArm: toNumberOrNull(physicalAssessmentForm.rightArm),
      leftArm: toNumberOrNull(physicalAssessmentForm.leftArm),
      rightThigh: toNumberOrNull(physicalAssessmentForm.rightThigh),
      leftThigh: toNumberOrNull(physicalAssessmentForm.leftThigh),
      activityLevel: physicalAssessmentForm.activityLevel || null,
      notes: physicalAssessmentForm.notes.trim() || null
    };

    const {
      front: frontPhoto,
      back: backPhoto,
      left: leftPhoto,
      right: rightPhoto
    } = physicalAssessmentForm.photos;

    // if (!frontPhoto || !backPhoto || !leftPhoto || !rightPhoto) {
    //   setPhysicalAssessmentError('Envie as quatro fotos da avaliação física.');
    //   return;
    // }

    try {
      if (editingPhysicalAssessment) {
        await updatePhysicalAssessmentMutation.mutateAsync(physicalAssessment);
        if (frontPhoto || backPhoto || leftPhoto || rightPhoto) {
          setIsSavingAssessmentPhotos(true);
          await physicalAssessmentService.updatePhotos(
            editingPhysicalAssessment.id,
            frontPhoto,
            backPhoto,
            leftPhoto,
            rightPhoto
          );
          queryClient.invalidateQueries(['trainee', traineeSelectedId]);
        }
      } else {
        await createPhysicalAssessmentMutation.mutateAsync({
          physicalAssessment,
          frontPhoto,
          backPhoto,
          leftPhoto,
          rightPhoto
        });
      }
      closePhysicalAssessment();
    } catch (error) {
      setPhysicalAssessmentError(getApiErrorMessage(
        error,
        'Não foi possível registrar a avaliação física. Tente novamente.'
      ));
    } finally {
      setIsSavingAssessmentPhotos(false);
    }
  };

  return {
    loading: queryTrainees.isLoading || Boolean(traineeSelectedId && queryDetailsTrainee.isLoading),
    loadError: queryTrainees.error || queryDetailsTrainee.error
      ? getApiErrorMessage(queryTrainees.error || queryDetailsTrainee.error, 'Não foi possível carregar os alunos.') : null,
    retry: () => { void queryTrainees.refetch(); if (traineeSelectedId) void queryDetailsTrainee.refetch(); },
    trainees: queryTrainees.data ?? [],
    traineSelected: queryDetailsTrainee.data ?? null,
    setTraineeSelectedId,
    traineeSelectedId,
    isCreateOpen,
    formData,
    setFormData,
    formError,
    photoPreviewUrl,
    isSaving: createMutation.isLoading,
    isPhysicalAssessmentOpen,
    editingPhysicalAssessment,
    physicalAssessmentForm,
    physicalAssessmentError,
    physicalAssessmentPhotoPreviews,
    calculatedImc,
    isSavingPhysicalAssessment: createPhysicalAssessmentMutation.isLoading || updatePhysicalAssessmentMutation.isLoading || isSavingAssessmentPhotos,
    openCreate,
    closeCreate,
    handlePhotoChange,
    saveTrainee,
    openPhysicalAssessment,
    openEditPhysicalAssessment,
    closePhysicalAssessment,
    updatePhysicalAssessmentField,
    handlePhysicalAssessmentPhotoChange,
    savePhysicalAssessment
  };
}

export default useAlunos;
