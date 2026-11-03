import { Navigate, Outlet } from "react-router-dom";
import {
  accountHome,
  isPersonal,
  useAuthContext,
} from "../context/AuthContext";
import { usePersonalTrainerContext } from "../context/PersonalTrainerContext";

export default function ProtectedRoute({
  area,
}: {
  area: "personal" | "aluno";
}) {
  const { auth, logout } = useAuthContext();
  const account = usePersonalTrainerContext();
  if (!auth) return <Navigate to="/login" replace />;
  const allowed =
    area === "personal"
      ? isPersonal(auth.roles)
      : auth.roles.some((role) => role.replace(/^ROLE_/, "") === "TRAINEE");
  if (!allowed) return <Navigate to={accountHome(auth.roles)} replace />;
  if (area === "personal" && !account.personalTrainer)
    return (
      <main className="cf-access-state" aria-live="polite">
        <h1>
          {account.isLoading
            ? "Preparando seu espaço…"
            : "Não foi possível carregar seu perfil profissional"}
        </h1>
        {!account.isLoading && (
          <>
            <p>Confira se sua conta está vinculada a um personal trainer.</p>
            <button onClick={account.retry}>Tentar novamente</button>
            <button onClick={logout}>Sair</button>
          </>
        )}
      </main>
    );
  return <Outlet />;
}
