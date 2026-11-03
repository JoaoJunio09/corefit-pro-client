export default function LoadFeedback({
  loading,
  error,
  retry,
}: {
  loading: boolean;
  error?: string | null;
  retry: () => void;
}) {
  if (!loading && !error) return null;
  return (
    <div
      className={`cf-load-feedback ${error ? "is-error" : ""}`}
      role={error ? "alert" : "status"}
    >
      <p>{error || "Carregando seus dados…"}</p>
      {error && (
        <button type="button" onClick={retry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
