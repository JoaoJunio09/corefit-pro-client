import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  CheckCheck,
  ChevronRight,
  Dumbbell,
  Flame,
  Leaf,
  LogOut,
  Moon,
  Sun,
  Target,
  CalendarDays,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useThemeContext } from "../../context/ThemeContext";
import ExerciseMedia from "../../components/ExerciseMedia";
import useAlunoPortal from "./hooks/useAlunoPortal";
import "./AlunoPortal.css";

export default function AlunoPortal() {
  const portal = useAlunoPortal();
  const { theme, setTheme } = useThemeContext();
  const {
    home,
    plan,
    selected,
    selectedDay,
    today,
    completed,
    total,
    progress,
  } = portal;
  return (
    <div className="cf-student-app">
      <div className="cf-student-shell">
        <header className="cf-student-header">
          <Link to="/aluno" className="cf-student-brand">
            <Dumbbell size={23} />
            corefit<span>pro</span>
            <i />
          </Link>
          <span className="cf-student-area">ESPAÇO DO ALUNO</span>
          <div className="cf-student-header-actions">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Alternar tema"
            >
              {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <button
              onClick={portal.logout}
              aria-label="Sair da conta"
              title="Sair"
            >
              <LogOut size={19} />
            </button>
          </div>
        </header>
        {portal.loading ? (
          <div className="cf-student-state" role="status">
            <Dumbbell size={36} />
            <h1>Preparando seus treinos…</h1>
            <p>Seu próximo passo está chegando.</p>
          </div>
        ) : portal.error ? (
          <div className="cf-student-state" role="alert">
            <h1>Não conseguimos abrir seus treinos</h1>
            <p>{portal.error}</p>
            <button className="cf-student-button" onClick={portal.retry}>
              <RefreshCw size={17} />
              Tentar novamente
            </button>
          </div>
        ) : portal.itemId ? (
          selected ? (
            <main className="cf-student-detail">
              <button className="cf-student-back" onClick={portal.back}>
                <ArrowLeft size={17} />
                Minha semana
              </button>
              <div className="cf-student-detail-heading">
                <div>
                  <span className="cf-student-eyebrow">
                    {selectedDay?.label} · {selectedDay?.dateLabel}
                  </span>
                  <h1>{selected.training.title}</h1>
                  <p>
                    {selected.training.description ||
                      "Siga as orientações do seu personal e respeite seu ritmo."}
                  </p>
                  <div className="cf-student-chips">
                    {selected.training.muscleGroups?.map((group) => (
                      <span key={group.id}>{group.name}</span>
                    ))}
                    <span>{selected.training.exercises.length} exercícios</span>
                  </div>
                </div>
                <Dumbbell className="cf-student-detail-icon" size={50} />
              </div>
              <div className="cf-student-workout-guide">
                <span>
                  <Flame size={19} />
                  Seu treino, exercício por exercício.
                </span>
                <p>Confira a demonstração e a prescrição antes de começar.</p>
              </div>
              <div className="cf-student-exercises">
                {selected.training.exercises.length ? (
                  selected.training.exercises.map((item, index) => (
                    <article className="cf-student-exercise" key={item.id}>
                      <div className="cf-student-exercise-title">
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <div>
                          <h2>{item.exercise.name}</h2>
                          <p>
                            {item.exercise.muscleGroups
                              ?.map((group) => group.name)
                              .join(" · ") || "Exercício do seu plano"}
                          </p>
                        </div>
                      </div>
                      <div className="cf-student-prescription">
                        <div>
                          <strong>{item.series}</strong>
                          <span>séries</span>
                        </div>
                        <i>×</i>
                        <div>
                          <strong>{item.repetitions}</strong>
                          <span>repetições</span>
                        </div>
                      </div>
                      <ExerciseMedia
                        key={`${item.exercise.id}:${item.exercise.photoKey}:${item.exercise.videoKey}`}
                        photo={item.exercise.photoKey}
                        video={item.exercise.videoKey}
                        name={item.exercise.name}
                      />
                    </article>
                  ))
                ) : (
                  <div className="cf-student-state">
                    <Dumbbell />
                    <h2>
                      Os exercícios deste treino ainda não foram definidos.
                    </h2>
                    <p>Fale com seu personal para completar a prescrição.</p>
                  </div>
                )}
              </div>
              <div
                className={`cf-student-completion ${selected.completed ? "is-completed" : ""}`}
              >
                <div>
                  <CheckCheck size={24} />
                  <div>
                    <strong>
                      {selected.completed
                        ? "Treino concluído. Mais um passo dado!"
                        : "Terminou por hoje?"}
                    </strong>
                    <p>
                      {selected.completed
                        ? "Sua evolução já foi registrada nesta semana."
                        : "Registre a conclusão para acompanhar sua constância."}
                    </p>
                  </div>
                </div>
                <button
                  className="cf-student-button"
                  disabled={portal.saving}
                  onClick={() =>
                    portal.setCompleted(selected.id, !selected.completed)
                  }
                >
                  {portal.saving
                    ? "Salvando…"
                    : selected.completed
                      ? "Desfazer conclusão"
                      : "Concluir treino"}
                  {!selected.completed && <Check size={18} />}
                </button>
              </div>
              {portal.completionError && (
                <p className="cf-student-error" role="alert">
                  {portal.completionError}
                </p>
              )}
            </main>
          ) : (
            <div className="cf-student-state">
              <h1>Treino não encontrado no seu plano atual</h1>
              <p>Seu personal pode ter atualizado sua programação.</p>
              <button className="cf-student-button" onClick={portal.back}>
                Voltar à minha semana
              </button>
            </div>
          )
        ) : (
          <main>
            <div className="cf-student-intro">
              <div>
                <span className="cf-student-eyebrow">UM DIA DE CADA VEZ.</span>
                <h1>Vamos nessa, {home?.firstName}.</h1>
                <p>
                  {home?.personalTrainerName
                    ? `Seu planejamento com ${home.personalTrainerName}.`
                    : "Seu espaço para transformar planejamento em evolução."}
                </p>
              </div>
              <span className="cf-student-week-label">
                <CalendarDays size={17} />
                {portal.days[0].dateLabel} — {portal.days[6].dateLabel}
              </span>
            </div>
            {plan ? (
              <>
                <section className="cf-student-overview">
                  <div className="cf-student-today">
                    <span className="cf-student-eyebrow">
                      HOJE · {today.label.toUpperCase()}
                    </span>
                    {today.item ? (
                      <>
                        <h2>{today.item.training.title}</h2>
                        <p>
                          {today.item.training.description ||
                            "Seu treino de hoje está pronto. Mantenha o foco no próximo movimento."}
                        </p>
                        <button
                          className="cf-student-button"
                          onClick={() => portal.openTraining(today.item!.id)}
                        >
                          {today.item.completed
                            ? "Rever treino concluído"
                            : "Abrir treino de hoje"}
                          <ArrowUpRight size={19} />
                        </button>
                      </>
                    ) : (
                      <>
                        <h2>
                          Recuperar também
                          <br />é evoluir.
                        </h2>
                        <p>
                          Hoje é dia de descanso. Aproveite para recuperar as
                          energias e preparar o próximo treino.
                        </p>
                        <Leaf size={32} className="cf-student-rest-leaf" />
                      </>
                    )}
                  </div>
                  <div className="cf-student-progress">
                    <div className="cf-student-progress-top">
                      <span>SUA CONSTÂNCIA</span>
                      <Flame size={20} />
                    </div>
                    <strong>
                      {completed}
                      <small> / {total}</small>
                    </strong>
                    <p>treinos concluídos na semana</p>
                    <div
                      className="cf-student-progress-bar"
                      role="progressbar"
                      aria-label="Treinos concluídos"
                      aria-valuenow={completed}
                      aria-valuemin={0}
                      aria-valuemax={total || 1}
                    >
                      <span style={{ width: `${progress}%` }} />
                    </div>
                    <span>
                      {total > 0 && completed === total
                        ? "Semana completa. Você fez acontecer!"
                        : total
                          ? "Cada treino é uma conquista."
                          : "Seu personal está preparando os dias de treino."}
                    </span>
                  </div>
                </section>
                <section className="cf-student-plan">
                  <div>
                    <Target size={20} />
                    <span>SEU PLANO</span>
                  </div>
                  <h2>{plan.description || "Plano personalizado"}</h2>
                  <dl>
                    <div>
                      <dt>Objetivo</dt>
                      <dd>{plan.objective || "A definir com seu personal"}</dd>
                    </div>
                    <div>
                      <dt>Meta</dt>
                      <dd>{plan.goal || "A definir com seu personal"}</dd>
                    </div>
                  </dl>
                </section>
                <section className="cf-student-week">
                  <div className="cf-student-section-title">
                    <h2>Sua semana de treino</h2>
                    <span>Treino planejado. Evolução constante.</span>
                  </div>
                  <div className="cf-student-days">
                    {portal.days.map((day) => (
                      <article
                        key={day.value}
                        className={`cf-student-day ${day.isToday ? "is-today" : ""} ${day.item?.completed ? "is-completed" : ""} ${!day.item ? "is-rest" : ""}`}
                      >
                        <div className="cf-student-day-label">
                          <span>{day.short}</span>
                          <span>{day.dateLabel}</span>
                          {day.isToday && <b>HOJE</b>}
                        </div>
                        <div className="cf-student-day-body">
                          {day.item ? (
                            <>
                              <span className="cf-student-day-status">
                                {day.item.completed ? (
                                  <>
                                    <Check size={13} />
                                    Concluído
                                  </>
                                ) : (
                                  <>
                                    <Dumbbell size={13} />
                                    Programado
                                  </>
                                )}
                              </span>
                              <h3>{day.item.training.title}</h3>
                              <p>
                                {day.item.training.exercises.length} exercícios
                              </p>
                              <button
                                onClick={() =>
                                  portal.openTraining(day.item!.id)
                                }
                              >
                                Ver treino
                                <ChevronRight size={17} />
                              </button>
                            </>
                          ) : (
                            <>
                              <Leaf size={25} />
                              <h3>Descanso</h3>
                              <p>
                                Respire. Recupere.
                                <br />
                                Volte mais forte.
                              </p>
                            </>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </>
            ) : (
              <section className="cf-student-state cf-student-empty">
                <Dumbbell size={42} />
                <span className="cf-student-eyebrow">SEU PRÓXIMO PASSO</span>
                <h2>Um plano feito para você está a caminho.</h2>
                <p>
                  Seu personal ainda não publicou um plano de treino ativo.
                  Assim que estiver pronto, seus treinos vão aparecer aqui.
                </p>
                <button className="cf-student-button" onClick={portal.retry}>
                  <RefreshCw size={17} />
                  Atualizar meus treinos
                </button>
              </section>
            )}
          </main>
        )}
        <footer className="cf-student-footer">
          <span>corefitpro</span>
          <span>Planeje. Treine. Evolua.</span>
        </footer>
      </div>
    </div>
  );
}
