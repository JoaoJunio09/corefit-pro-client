import axios from "axios";

export function apiError(
  error: unknown,
  fallback = "Não foi possível concluir a operação. Tente novamente.",
) {
  if (axios.isAxiosError(error)) {
    if (!error.response)
      return "Não foi possível conectar ao servidor. Verifique sua conexão.";
    const data = error.response.data;
    if (typeof data === "string" && data.trim()) return data;
    if (data && typeof data.message === "string") return data.message;
  }
  return error instanceof Error && !axios.isAxiosError(error)
    ? error.message
    : fallback;
}
