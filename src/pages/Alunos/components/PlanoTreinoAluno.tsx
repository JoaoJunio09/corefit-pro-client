import { ArrowLeft, Plus, Save } from "lucide-react";
import usePlanoTreinoAluno from "../hooks/usePlanoTreinoAluno";
import "./PlanoTreinoAluno.css";

interface Props {
  traineeId: string;
  traineeName: string;
  onBack: () => void;
  onSaved: () => void;
  createNew?: boolean;
}

export default function PlanoTreinoAluno({
  traineeId,
  traineeName,
  onBack,
  onSaved,
  createNew = false,
}: Props) {
  const plan = usePlanoTreinoAluno(traineeId, createNew, onSaved);
  return (
    <form
      className="cf-training-plan-view"
      onSubmit={(event) => {
        event.preventDefault();
        if (plan.canSave) plan.save();
      }}
    >
      <div className="cf-trainee-create-header">
        <button
          className="cf-btn-back cf-btn-back--history"
          type="button"
          disabled={plan.saving}
          onClick={onBack}
        >
          <ArrowLeft size={17} />
          Voltar para o aluno
        </button>
        <div className="cf-trainee-create-title">
          <span className="cf-trainee-create-eyebrow">Plano de treino</span>
          <h1 className="cf-h1">Treinos de {traineeName}</h1>
          <p className="cf-text-body">
            Organize os treinamentos de cada dia e defina a direção da evolução
            do aluno.
          </p>
        </div>
      </div>
      {plan.error && (
        <div className="cf-trainee-form-error" role="alert">
          {plan.error}
          <button
            type="button"
            className="cf-btn cf-btn--ghost"
            onClick={plan.retry}
          >
            Tentar novamente
          </button>
        </div>
      )}
      {plan.loading && (
        <p role="status">Carregando o plano e seus treinamentos…</p>
      )}
      <fieldset
        disabled={plan.loading || plan.saving}
        className="cf-plan-fieldset"
      >
        <section className="cf-trainee-panel">
          <div className="cf-trainee-panel-heading">
            <div>
              <span className="cf-trainee-panel-eyebrow">Visão geral</span>
              <h2>Configuração do plano</h2>
            </div>
            <strong className="cf-plan-count">
              {plan.selectedCount} de 7 dias planejados
            </strong>
          </div>
          <div className="cf-trainee-form-grid">
            <div className="cf-trainee-form-group">
              <label htmlFor="plan-objective">Objetivo do plano *</label>
              <input
                id="plan-objective"
                value={plan.objective}
                onChange={(event) => plan.setObjective(event.target.value)}
                maxLength={255}
                required
                placeholder="Ex.: ganhar força e massa muscular"
              />
            </div>
            <div className="cf-trainee-form-group">
              <label htmlFor="plan-goal">Meta</label>
              <input
                id="plan-goal"
                value={plan.goal}
                onChange={(event) => plan.setGoal(event.target.value)}
                maxLength={255}
                placeholder="Ex.: treinar 4 vezes por semana"
              />
            </div>
            <div className="cf-trainee-form-group cf-trainee-form-group--full">
              <label htmlFor="plan-description">Descrição *</label>
              <textarea
                id="plan-description"
                value={plan.description}
                onChange={(event) => plan.setDescription(event.target.value)}
                maxLength={500}
                rows={3}
                required
                placeholder="Descreva o planejamento do aluno"
              />
            </div>
          </div>
        </section>
        <section className="cf-trainee-panel">
          <div className="cf-trainee-panel-heading">
            <div>
              <span className="cf-trainee-panel-eyebrow">
                Programação semanal
              </span>
              <h2>Montagem por dia</h2>
              <p>
                Selecione um treinamento por dia. Deixe em “Descanso” quando não
                houver treino.
              </p>
            </div>
            <button
              type="button"
              className="cf-btn cf-btn--ghost"
              onClick={() => plan.setShowRedirectConfirm(true)}
            >
              <Plus size={17} />
              Adicionar novo treinamento
            </button>
          </div>
          {!plan.loading && !plan.trainings.length && (
            <p className="cf-training-empty">
              Você ainda não possui treinamentos. Crie um para começar a montar
              este plano.
            </p>
          )}
          <div className="cf-training-week-grid">
            {plan.days.map((day) => {
              const selected = plan.assignments[day.value] ?? "";
              const training = plan.trainings.find(
                (item) => item.id === selected,
              );
              return (
                <div
                  className={`cf-training-day-card ${selected ? "is-planned" : ""}`}
                  key={day.value}
                >
                  <div>
                    <span>{day.label}</span>
                    <strong>{training?.title ?? "Descanso"}</strong>
                    {training && (
                      <small>{training.numberOfExercises} exercícios</small>
                    )}
                  </div>
                  <select
                    aria-label={`Treinamento de ${day.label}`}
                    value={selected}
                    onChange={(event) =>
                      plan.setAssignment(day.value, event.target.value)
                    }
                  >
                    <option value="">Descanso</option>
                    {plan.trainings.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </section>
      </fieldset>
      <div className="cf-trainee-form-actions">
        <button
          className="cf-btn cf-btn--ghost"
          type="button"
          disabled={plan.saving}
          onClick={onBack}
        >
          Cancelar
        </button>
        <button
          className="cf-btn cf-btn--primary"
          type="submit"
          disabled={!plan.canSave}
        >
          <Save size={17} />
          {plan.saving ? "Salvando plano…" : "Salvar plano de treino"}
        </button>
      </div>
      {plan.showRedirectConfirm && (
        <div className="cf-plan-confirm-overlay">
          <div
            className="cf-plan-confirm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="redirect-plan-title"
          >
            <h2 id="redirect-plan-title">Ir para treinamentos?</h2>
            <p>
              Ao confirmar, as alterações ainda não salvas deste plano serão
              perdidas.
            </p>
            <div>
              <button
                className="cf-btn cf-btn--ghost"
                type="button"
                onClick={() => plan.setShowRedirectConfirm(false)}
              >
                Cancelar
              </button>
              <button
                className="cf-btn cf-btn--primary"
                type="button"
                onClick={plan.confirmRedirect}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
