import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import AccountService, {
  AccountProfile,
} from "../../../services/AccountService";
import { useAuthContext } from "../../../context/AuthContext";
import { apiError } from "../../../utils/apiError";

export default function useConfiguracoes() {
  const { auth, logout, updateDisplayName } = useAuthContext();
  const service = useMemo(
    () => new AccountService(auth?.accessToken ?? ""),
    [auth?.accessToken],
  );
  const client = useQueryClient();
  const key = ["account", auth?.username];
  const query = useQuery(key, () => service.get());
  const [profile, setProfile] = useState<AccountProfile>({
    username: "",
    fullName: "",
    email: "",
    recoveryEmail: "",
  });
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [tab, setTab] = useState("perfil");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (query.data) setProfile(query.data);
  }, [query.data]);
  const save = useMutation(() => service.update(profile), {
    onSuccess: (data) => {
      client.setQueryData(key, data);
      updateDisplayName(data.fullName);
      setMessage("Dados da conta atualizados.");
    },
    onError: (err) => setError(apiError(err)),
  });
  const password = useMutation(
    () => service.changePassword(passwords.current, passwords.next),
    {
      onSuccess: () => {
        setPasswords({ current: "", next: "", confirm: "" });
        setMessage(
          "Senha alterada com sucesso. Use a nova senha no próximo acesso.",
        );
      },
      onError: (err) => setError(apiError(err)),
    },
  );
  function submit(event: FormEvent) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    if (tab === "perfil") {
      save.mutate();
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setError("A confirmação da nova senha não confere.");
      return;
    }
    password.mutate();
  }
  return {
    profile,
    setProfile,
    passwords,
    setPasswords,
    tab,
    setTab: (value: string) => {
      setTab(value);
      setMessage(null);
      setError(null);
    },
    message,
    error: error ?? (query.error ? apiError(query.error) : null),
    loading: query.isLoading,
    saving: save.isLoading || password.isLoading,
    submit,
    logout,
    retry: () => {
      void query.refetch();
    },
  };
}
