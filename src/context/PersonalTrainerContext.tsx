import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQuery } from "react-query";
import { PersonalTrainerResponse } from "../models/personalTrainer/PersonalTrainerResponse";
import PersonalTrainerService from "../services/PersonalTrainerService";
import { isPersonal, useAuthContext } from "./AuthContext";

interface PersonalTrainerContextType {
  personalTrainer: PersonalTrainerResponse | null;
  setPersonalTrainerByUser: (account: PersonalTrainerResponse) => void;
  isLoading: boolean;
  error: unknown;
  retry: () => void;
}
const PersonalTrainerContext = createContext<PersonalTrainerContextType | null>(
  null,
);

export function PersonalTrainerProvider({ children }: { children: ReactNode }) {
  const { auth } = useAuthContext();
  const [override, setOverride] = useState<PersonalTrainerResponse | null>(
    null,
  );
  const service = useMemo(
    () => new PersonalTrainerService(auth?.accessToken ?? ""),
    [auth?.accessToken],
  );
  const enabled = Boolean(auth && isPersonal(auth.roles));
  const query = useQuery(
    ["personal-account", auth?.username],
    () => service.getByUsername(auth!.username),
    { enabled, retry: 1 },
  );
  useEffect(() => {
    setOverride(null);
  }, [auth?.username]);
  return (
    <PersonalTrainerContext.Provider
      value={{
        personalTrainer: enabled ? (override ?? query.data ?? null) : null,
        setPersonalTrainerByUser: setOverride,
        isLoading: enabled && query.isLoading,
        error: query.error,
        retry: () => {
          void query.refetch();
        },
      }}
    >
      {children}
    </PersonalTrainerContext.Provider>
  );
}

export function usePersonalTrainerContext() {
  const context = useContext(PersonalTrainerContext);
  if (!context)
    throw new Error(
      "usePersonalTrainerContext deve ser usado dentro de PersonalTrainerProvider",
    );
  return context;
}
