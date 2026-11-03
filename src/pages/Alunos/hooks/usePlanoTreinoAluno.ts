import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { usePersonalTrainerContext } from "../../../context/PersonalTrainerContext";
import useTrainingPlanService from "../../../hooks/useTrainingPlanService";
import useTrainingService from "../../../hooks/useTrainingService";
import { apiError } from "../../../utils/apiError";
import { WEEK_DAYS } from "../../AlunoPortal/hooks/useAlunoPortal";

export default function usePlanoTreinoAluno(
  traineeId: string,
  createNew: boolean,
  onSaved: () => void,
) {
  const { personalTrainer } = usePersonalTrainerContext();
  const service = useTrainingPlanService();
  const trainingService = useTrainingService();
  const client = useQueryClient();
  const navigate = useNavigate();
  const hydrated = useRef(false);
  const [description, setDescription] = useState("");
  const [objective, setObjective] = useState("");
  const [goal, setGoal] = useState("");
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [showRedirectConfirm, setShowRedirectConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const catalog = useQuery(
    ["trainings", personalTrainer?.id],
    () => trainingService.getAll({ personalTrainerId: personalTrainer!.id }),
    { enabled: Boolean(personalTrainer?.id) },
  );
  const plan = useQuery(
    ["training-plan", traineeId],
    async () => {
      try {
        return await service.getByTrainee(traineeId);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404)
          return null;
        throw err;
      }
    },
    { enabled: !createNew, refetchOnMount: "always" },
  );

  useEffect(() => {
    if (createNew || hydrated.current || plan.isFetching || !plan.isSuccess)
      return;
    setDescription(plan.data?.description ?? "");
    setObjective(plan.data?.objective ?? "");
    setGoal(plan.data?.goal ?? "");
    setAssignments(
      Object.fromEntries(
        (plan.data?.trainings ?? []).map((item) => [
          item.dayOfWeek,
          item.training.id,
        ]),
      ),
    );
    hydrated.current = true;
  }, [createNew, plan.data, plan.isFetching, plan.isSuccess]);

  const trainings = useMemo(() => {
    const available = new Map(
      (catalog.data ?? []).map((training) => [training.id, training]),
    );
    if (!createNew)
      plan.data?.trainings.forEach((item) => {
        if (!available.has(item.training.id))
          available.set(item.training.id, item.training);
      });
    return [...available.values()];
  }, [catalog.data, plan.data, createNew]);

  const save = useMutation(
    async () => {
      if (!personalTrainer?.id)
        throw new Error("Personal trainer não identificado.");
      if (!description.trim() || !objective.trim())
        throw new Error("Informe a descrição e o objetivo do plano.");
      const result = await service.saveComplete({
        id: createNew ? undefined : plan.data?.id,
        traineeId,
        personalTrainerId: personalTrainer.id,
        description: description.trim(),
        objective: objective.trim(),
        goal: goal.trim(),
        trainings: WEEK_DAYS.filter((day) => assignments[day.value]).map(
          (day) => ({
            dayOfWeek: day.value,
            trainingId: assignments[day.value],
          }),
        ),
      });
      client.setQueryData(["training-plan", traineeId], result);
      return result;
    },
    {
      onSuccess: async () => {
        await Promise.all(
          [
            "training-plan",
            "trainee",
            "trainees",
            "dashboard",
            "student-home",
          ].map((key) => client.invalidateQueries(key)),
        );
        onSaved();
      },
      onError: (err) =>
        setError(apiError(err, "Não foi possível salvar o plano de treino.")),
    },
  );

  const loading =
    catalog.isLoading ||
    (!createNew && (plan.isLoading || (!hydrated.current && plan.isFetching)));
  const loadError = catalog.error || (!createNew && plan.error);
  return {
    description,
    setDescription,
    objective,
    setObjective,
    goal,
    setGoal,
    assignments,
    setAssignment: (day: string, trainingId: string) =>
      setAssignments((current) => ({ ...current, [day]: trainingId })),
    trainings,
    days: WEEK_DAYS,
    selectedCount: Object.values(assignments).filter(Boolean).length,
    loading,
    saving: save.isLoading,
    error: error || (loadError ? apiError(loadError) : null),
    canSave: !loading && !loadError && !save.isLoading,
    save: () => {
      setError(null);
      save.mutate();
    },
    retry: () => {
      void catalog.refetch();
      if (!createNew) void plan.refetch();
    },
    showRedirectConfirm,
    setShowRedirectConfirm,
    confirmRedirect: () => navigate("/personal/treinos?novo=1"),
  };
}
