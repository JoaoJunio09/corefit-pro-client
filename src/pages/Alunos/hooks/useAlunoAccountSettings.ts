import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useTraineeService from "../../../hooks/useTraineeService";
import { useAuthContext } from "../../../context/AuthContext";
import {
  TraineeAccount,
  TraineeAccountRequest,
} from "../../../models/trainee/TraineeAccount";
import { apiError } from "../../../utils/apiError";

const EMPTY_ACCOUNT: TraineeAccountRequest = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  recoveryEmail: "",
  enabled: true,
};

export default function useAlunoAccountSettings(traineeId: string) {
  const service = useTraineeService();
  const { username } = useAuthContext();
  const client = useQueryClient();
  const key = ["trainee-account", username, traineeId];
  const account = useQuery(key, () => service.getAccount(traineeId), {
    staleTime: 0,
  });
  const [form, setForm] = useState<TraineeAccountRequest>(EMPTY_ACCOUNT);
  const [passwords, setPasswords] = useState({ next: "", confirm: "" });
  const [showPasswords, setShowPasswords] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  function populate(data: TraineeAccount) {
    setForm({
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      recoveryEmail: data.recoveryEmail ?? "",
      enabled: data.enabled,
    });
  }

  useEffect(() => {
    if (account.data) populate(account.data);
  }, [account.data]);

  const update = useMutation(
    () =>
      service.updateAccount(traineeId, {
        ...form,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        recoveryEmail: form.recoveryEmail.trim(),
      }),
    {
      onSuccess: async (data) => {
        client.setQueryData(key, data);
        populate(data);
        setProfileMessage("Dados e acesso do aluno atualizados com sucesso.");
        await Promise.all([
          client.invalidateQueries("trainees"),
          client.invalidateQueries(["trainee", traineeId]),
          client.invalidateQueries(["training-plan", traineeId]),
          client.invalidateQueries("dashboard"),
          client.invalidateQueries("physical-assessments"),
          client.invalidateQueries("student-home"),
        ]);
      },
      onError: (error) =>
        setProfileError(
          apiError(error, "Não foi possível salvar os dados do aluno."),
        ),
    },
  );

  const reset = useMutation(
    () => service.resetPassword(traineeId, passwords.next),
    {
      onSuccess: () => {
        setPasswords({ next: "", confirm: "" });
        setShowPasswords(false);
        setPasswordMessage(
          "Senha redefinida. Informe a nova senha ao aluno para o próximo acesso.",
        );
      },
      onError: (error) =>
        setPasswordError(
          apiError(error, "Não foi possível redefinir a senha."),
        ),
    },
  );
  const busy = update.isLoading || reset.isLoading;

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setProfileError(null);
    setProfileMessage(null);
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setProfileError("Informe o nome e o sobrenome do aluno.");
      return;
    }
    if (`${form.firstName.trim()} ${form.lastName.trim()}`.length > 150) {
      setProfileError("O nome completo deve ter no máximo 150 caracteres.");
      return;
    }
    if (!form.username.trim() || /\s/.test(form.username.trim())) {
      setProfileError("Informe um usuário sem espaços.");
      return;
    }
    update.mutate();
  }

  function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setPasswordError(null);
    setPasswordMessage(null);
    if (
      passwords.next.length < 6 ||
      passwords.next.length > 128 ||
      !passwords.next.trim()
    ) {
      setPasswordError("A nova senha deve ter entre 6 e 128 caracteres.");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPasswordError("A confirmação da senha não confere.");
      return;
    }
    reset.mutate();
  }

  return {
    form,
    setForm,
    passwords,
    setPasswords,
    showPasswords,
    togglePasswords: () => setShowPasswords((current) => !current),
    profileMessage,
    passwordMessage,
    profileError,
    passwordError,
    busy,
    loading: account.isLoading,
    loadError: account.error ? apiError(account.error) : null,
    loaded: Boolean(account.data),
    retry: () => {
      void account.refetch();
    },
    savingProfile: update.isLoading,
    resettingPassword: reset.isLoading,
    saveProfile,
    resetPassword,
    discard: () => {
      if (account.data) populate(account.data);
      setProfileError(null);
      setProfileMessage(null);
    },
  };
}
