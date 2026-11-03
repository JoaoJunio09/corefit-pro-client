import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import AuthService from "../services/AuthService";
import { AccountCredentials } from "../models/auth/AccountCredentials";
import { Token } from "../models/auth/Token";

export const isPersonal = (roles: string[]) =>
  roles.some((role) =>
    ["PERSONAL", "ADMIN"].includes(role.replace(/^ROLE_/, "")),
  );
export const accountHome = (roles: string[]) =>
  isPersonal(roles) ? "/personal/dashboard" : "/aluno";

interface AuthContextType {
  auth: Token | null;
  username: string | null;
  fullName: string | null;
  isAuthenticated: boolean;
  signIn: (credentials: AccountCredentials) => Promise<void>;
  logout: () => void;
  updateDisplayName: (name: string) => void;
  hasRole: (role: string) => boolean;
}
const AuthContext = createContext<AuthContextType | null>(null);

function readSession(): Token | null {
  try {
    const stored = JSON.parse(
      sessionStorage.getItem("auth") ?? "null",
    ) as Token | null;
    return stored?.accessToken &&
      Array.isArray(stored.roles) &&
      new Date(stored.expiration).getTime() > Date.now()
      ? stored
      : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<Token | null>(readSession);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const service = useMemo(() => new AuthService(), []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("auth");
    sessionStorage.removeItem("personalTrainer");
    queryClient.clear();
    setAuth(null);
    navigate("/login", { replace: true });
  }, [navigate, queryClient]);

  useEffect(() => {
    if (!auth) return;
    const timer = window.setTimeout(
      logout,
      Math.max(0, new Date(auth.expiration).getTime() - Date.now()),
    );
    window.addEventListener("corefit:session-expired", logout);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("corefit:session-expired", logout);
    };
  }, [auth, logout]);

  async function signIn(credentials: AccountCredentials) {
    const token: Token = await service.signIn(credentials);
    if (
      !token.roles?.some((role) =>
        ["PERSONAL", "ADMIN", "TRAINEE"].includes(role.replace(/^ROLE_/, "")),
      )
    ) {
      throw new Error(
        "Esta conta não possui um perfil de acesso ao CorefitPro.",
      );
    }
    queryClient.clear();
    sessionStorage.removeItem("personalTrainer");
    sessionStorage.setItem("auth", JSON.stringify(token));
    setAuth(token);
    navigate(accountHome(token.roles), { replace: true });
  }

  function updateDisplayName(name: string) {
    if (!auth) return;
    const updated = { ...auth, fullName: name };
    sessionStorage.setItem("auth", JSON.stringify(updated));
    setAuth(updated);
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        username: auth?.username ?? null,
        fullName: auth?.fullName ?? null,
        isAuthenticated: auth !== null,
        signIn,
        logout,
        updateDisplayName,
        hasRole: (role) =>
          Boolean(
            auth?.roles.some(
              (value) =>
                value.replace(/^ROLE_/, "") === role.replace(/^ROLE_/, ""),
            ),
          ),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext deve ser usado dentro de AuthProvider");
  return context;
}
