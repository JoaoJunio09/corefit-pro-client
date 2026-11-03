import { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { useAuthContext } from "../../../context/AuthContext";

export default function useLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuthContext();

  function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    setError(null);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    if (!form.username.trim() || !form.password) {
      setError("Informe seu usuário e sua senha.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signIn({ username: form.username.trim(), password: form.password });
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? !err.response
            ? "Não conseguimos conectar ao servidor. Tente novamente em instantes."
            : [401, 403].includes(err.response.status)
              ? "Usuário ou senha incorretos. Confira e tente novamente."
              : "Não foi possível entrar agora. Tente novamente."
          : err instanceof Error
            ? err.message
            : "Não foi possível entrar.",
      );
    } finally {
      setLoading(false);
    }
  }
  return {
    form,
    handleOnChange,
    submit,
    error,
    loading,
    showPassword,
    togglePassword: () => setShowPassword((current) => !current),
  };
}
