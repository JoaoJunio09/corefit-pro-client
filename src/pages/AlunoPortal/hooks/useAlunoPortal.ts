import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import StudentService from "../../../services/StudentService";
import { apiError } from "../../../utils/apiError";
import { calculateWorkoutPercentage, formatWorkoutPercentage } from '../../../utils/workoutProgress';

export const WEEK_DAYS = [
  { value: "MONDAY", label: "Segunda-feira", short: "SEG" },
  { value: "TUESDAY", label: "Terça-feira", short: "TER" },
  { value: "WEDNESDAY", label: "Quarta-feira", short: "QUA" },
  { value: "THURSDAY", label: "Quinta-feira", short: "QUI" },
  { value: "FRIDAY", label: "Sexta-feira", short: "SEX" },
  { value: "SATURDAY", label: "Sábado", short: "SÁB" },
  { value: "SUNDAY", label: "Domingo", short: "DOM" },
] as const;

const formatDate = (date: Date) =>
  date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

export default function useAlunoPortal() {
  const { auth, logout } = useAuthContext();
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const client = useQueryClient();
  const service = useMemo(
    () => new StudentService(auth?.accessToken ?? ""),
    [auth?.accessToken],
  );
  const key = ["student-home", auth?.username];
  const query = useQuery(key, () => service.getHome(), {
    enabled: Boolean(auth),
    refetchOnWindowFocus: true,
    staleTime: 30000,
  });
  const mutation = useMutation(
    ({ id, completed }: { id: string; completed: boolean }) =>
      service.setCompleted(id, completed),
    {
      onSuccess: async () => {
        await Promise.all([
          client.invalidateQueries(key),
          client.invalidateQueries("trainees"),
          client.invalidateQueries("trainee"),
          client.invalidateQueries("dashboard"),
        ]);
      },
    },
  );
  const home = query.data;
  const plan = home?.plan;
  const todayIndex = (new Date().getDay() + 6) % 7;
  const days = useMemo(
    () =>
      WEEK_DAYS.map((day, index) => {
        const date = home?.weekStart
          ? new Date(`${home.weekStart}T12:00:00`)
          : new Date();
        if (!home?.weekStart)
          date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
        date.setDate(date.getDate() + index);
        return {
          ...day,
          date,
          dateLabel: formatDate(date),
          isToday: index === todayIndex,
          item: plan?.trainings.find((item) => item.dayOfWeek === day.value),
        };
      }),
    [home?.weekStart, plan, todayIndex],
  );
  const completed =
    plan?.trainings.filter((item) => item.completed).length ?? 0;
  const total = plan?.trainings.length ?? 0;
  const progress = calculateWorkoutPercentage(completed, total);
  const selected = plan?.trainings.find((item) => item.id === itemId);
  const selectedDay = days.find((day) => day.item?.id === itemId);
  const today = days[todayIndex];
  return {
    home,
    plan,
    days,
    selected,
    selectedDay,
    today,
    itemId,
    completed,
    total,
    progress,
    progressLabel: formatWorkoutPercentage(progress),
    loading: query.isLoading,
    error: query.error
      ? apiError(query.error, "Não foi possível carregar seus treinos.")
      : null,
    retry: () => {
      void query.refetch();
    },
    logout,
    saving: mutation.isLoading,
    completionError: mutation.error ? apiError(mutation.error) : null,
    setCompleted: (id: string, value: boolean) => {
      mutation.reset();
      mutation.mutate({ id, completed: value });
    },
    openTraining: (id: string) => {
      mutation.reset();
      navigate(`/aluno/treinos/${id}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    back: () => {
      mutation.reset();
      navigate("/aluno");
    },
  };
}
