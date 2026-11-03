import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../layouts/Header';
import { formatRelativeTime } from '../../utils/formatLocaldateTime';
import getDaysOfWeek from '../../utils/getDaysOfWeek';
import './Dashboard.css';
import useDashboard from './hooks/useDashboard';

const IconPlus = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const IconClock = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconAlertTriangle = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IconChevronRight = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const IconActivity = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const IconTrendingUp = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/); 
  
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};


const getStatusLabel = (status: boolean) => {
  if (status) return 'Concluído';
  return 'Pendente';
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  const { dashboard, error, retry, percentageCompletedToday, percentageCompletedTodayLabel } = useDashboard();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!dashboard) return <div className="cf-app-wrapper"><div className="cf-container"><Header active="dashboard" /><section className="cf-access-state"><h1>{error ? 'Não foi possível carregar o painel' : 'Carregando seu painel…'}</h1>{Boolean(error) && <button onClick={retry}>Tentar novamente</button>}</section></div></div>;

  return (
    <div className="cf-app-wrapper">
      <div className="cf-container">
        <Header active='dashboard' />

        {/* HERO OVERVIEW */}
        <section className="cf-hero">
          <div className="cf-hero-content">
            <div className="cf-hero-text">
              <h1 className="cf-h1">Visão Geral</h1>
              <p className="cf-text-body" style={{ marginTop: '0.5rem', maxWidth: '400px' }}>
                Acompanhe os treinos e o engajamento dos seus alunos em tempo real.
              </p>
              <div className="cf-hero-metrics-bar">
                <div className="cf-metric-mini">
                  <span className="cf-metric-val">{dashboard.activeTrainees}</span>
                  <span className="cf-metric-label">Alunos Ativos</span>
                </div>
                <div className="cf-metric-mini">
                  <span className="cf-metric-val">{dashboard.activePlans}</span>
                  <span className="cf-metric-label">Planos Ativos</span>
                </div>
                <div className="cf-metric-mini">
                  <span className="cf-metric-val">{dashboard.pendings}</span>
                  <span className="cf-metric-label">Pendências para hoje</span>
                </div>
              </div>
            </div>

            <div className="cf-hero-stats">
              {dashboard.workoutsToday.length > 0 && (
                <div className="cf-progress-circle-wrap">
                  <svg width="64" height="64" viewBox="0 0 100 100">
                    <circle className="cf-progress-circle-bg" cx="50" cy="50" r="40" />
                    <circle
                      className="cf-progress-circle-value"
                      cx="50" cy="50" r="40"
                      strokeDasharray="251"
                      strokeDashoffset={251 - (251 * percentageCompletedToday) / 100}
                    />
                  </svg>
                  <span className="cf-progress-circle-text">{percentageCompletedTodayLabel}</span>
                </div>
              )}

              <div className="cf-hero-stat-info">
                {dashboard.workoutsToday.length > 0 ? (
                  <>
                    <span className="cf-hero-stat-value">{dashboard.workoutsCompletedToday}/{dashboard.workoutsToday.length}</span>
                    <span className="cf-text-small">Treinos de hoje concluídos</span>
                  </>                  
                ) : (
                  <span className="cf-text-small">Nenhum treino programado para hoje</span>
                )}  
              </div>
            </div>
          </div>
        </section>

        {/* MAIN GRID */}
        <div className="cf-dashboard-grid">

          {/* LEFT COLUMN: Main Lists */}
          <div className="cf-stack">

            {/* TODAY'S TRAININGS PANEL */}
            {dashboard.workoutsToday.length > 0 && (
              <div className="cf-panel">
                <div className="cf-panel-header">
                  <h2 className="cf-h2"><IconActivity /> Treinos de Hoje</h2>
                  <Link to={'/personal/treinos'} className="cf-btn cf-btn--secondary">
                    Ver Todos
                  </Link>
                </div>
                <div className="cf-panel-body" style={{ padding: 0 }}>
                  <div className="cf-list-rich">
                    {dashboard.workoutsToday.map(training => (
                      <div className="cf-list-row" key={training.id}>
                        <div className="cf-avatar">
                          {getInitials(training.trainee.firstName)}
                        </div>
                        <div className="cf-list-col-main">
                          <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--cf-text-primary)' }}>
                            {training.trainee.firstName}
                          </span>
                          <span className="cf-text-small">{training.training.title}</span>
                        </div>

                        <div className="cf-list-col-meta">
                          <span className="cf-badge"><IconClock /> 1h30</span>
                          <span className="cf-text-small" style={{ width: '60px', textAlign: 'center' }}>
                            {training.training.numberOfExercises} ex.
                          </span>
                        </div>

                        <div className="cf-list-col-status">
                          <span className={`cf-status-pill ${training.completed ? 'completed' : 'pending'}`}>
                            {getStatusLabel(training.completed)}
                          </span>
                          <div className="cf-row-action">
                            <IconChevronRight />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* WEEKLY RHYTHM PANEL */}
            <div className="cf-panel">
              <div className="cf-panel-header">
                <h2 className="cf-h2"><IconTrendingUp /> Ritmo Semanal</h2>
                <span className="cf-text-small">Treinos concluídos vs. programados</span>
              </div>
              <div className="cf-panel-body">
                <div className="cf-week-container">
                  {dashboard.rhythmWeekly.map(day => {
                    const isToday = new Date()
                      .toLocaleDateString('en-US', { weekday: 'long' })
                      .toUpperCase();
                    const dots = [];
                    for (let i = 0; i < 9; i++) {
                      if (i < day.totalTrainings) {
                        dots.push(<div key={i} className={`cf-dot ${i < day.completedTrainings ? 'filled' : ''}`} />);
                      }
                    }

                    return (
                      <div key={day.dayOfWeek} className={`cf-day-col ${day.dayOfWeek === isToday ? 'is-today' : ''}`}>
                        <div className="cf-day-dots">
                          {dots}
                        </div>
                        <span className="cf-day-label">{getDaysOfWeek(day.dayOfWeek)}</span>
                        <span className="cf-day-fraction">{day.completedTrainings}/{day.totalTrainings}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Secondary Info & Activity */}
          <div className="cf-stack">

            {/* ACTIONS PANEL */}
            <div className="cf-panel" style={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }}>
              <Link to="/personal/treinos?novo=1" className="cf-btn cf-btn--primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}>
                <IconPlus /> Novo Treinamento
              </Link>
            </div>

            {/* ATTENTION REQUIRED */}
            <div className="cf-panel">
              <div className="cf-panel-header">
                <h2 className="cf-h2"><IconAlertTriangle /> Atenção Necessária</h2>
              </div>
              <div className="cf-panel-body">
                <div className="cf-attention-list">
                  {dashboard.necessaryAttention.map(item => (
                    <div key={item.traineeName} className={`cf-attention-card ${item.severity.toLowerCase()}`}>
                      <div className="cf-avatar" style={{ width: '32px', height: '32px', fontSize: '0.75rem', backgroundColor: 'var(--cf-surface)' }}>
                        {getInitials(item.traineeName)}
                      </div>
                      <div className="cf-attention-content">
                        <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--cf-text-primary)' }}>
                          {item.traineeName}
                        </span>
                        <span className="cf-text-small" style={{ color: 'inherit', opacity: 0.9 }}>{item.message}</span>
                        {/* <span className="cf-attention-action">Detalhes</span> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RECENT ACTIVITY TIMELINE */}
            <div className="cf-panel">
              <div className="cf-panel-header">
                <h2 className="cf-h2">Atividade Recente</h2>
              </div>
              <div className="cf-panel-body">
                <div className="cf-timeline-wrap">
                  {dashboard.recentActivities.map(activity => (
                    <div key={activity.id} className="cf-timeline-item">
                      <div className="cf-timeline-marker" />
                      <div className="cf-timeline-time">{formatRelativeTime(activity.registeredAt)}</div>
                      <div className="cf-timeline-text">
                        <>{activity.description}</>
                        {/* {activity.type === 'workout' && (
                          <><span className="cf-timeline-highlight">{activity.highlight}</span> {activity.description}</>
                        )}
                        {activity.type === 'system' && (
                          <>{activity.description} <span className="cf-timeline-highlight">{activity.highlight}</span></>
                        )}
                        {activity.type === 'student' && (
                          <>{activity.description} <span className="cf-timeline-highlight">{activity.highlight}</span></>
                        )} */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
