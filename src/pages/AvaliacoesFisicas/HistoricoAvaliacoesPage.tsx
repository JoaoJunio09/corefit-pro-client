import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../layouts/Header';
import './HistoricoAvaliacoesPage.css';
import useHistoricoAvaliacoes from './hooks/useHistoricoAvaliacoes';
import { AssessmentSummary } from './hooks/useHistoricoAvaliacoes';

const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
const IconActivity = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h4l3-9 4 18 3-9h4"/></svg>;

export default function HistoricoAvaliacoesPage() {
  const navigate = useNavigate();
  const [selectedSummary, setSelectedSummary] = useState<AssessmentSummary | null>(null);
  const {
    isLoading, summaries, selectableTrainees, selectedTraineeId, traineeSearch,
    setTraineeSearch, selectTrainee, page, totalPages, setPage
  } = useHistoricoAvaliacoes();

  if (selectedSummary) {
    const { assessment, trainee } = selectedSummary;
    const measurements = [
      ['Peitoral', assessment.chest], ['Cintura', assessment.waist], ['Abdômen', assessment.abdomen], ['Quadril', assessment.hip],
      ['Braço direito', assessment.rightArm], ['Braço esquerdo', assessment.leftArm], ['Coxa direita', assessment.rightThigh], ['Coxa esquerda', assessment.leftThigh]
    ];
    const photos = [['Frente', assessment.frontViewPhotoUrl], ['Costas', assessment.backViewPhotoUrl], ['Lado esquerdo', assessment.leftViewPhotoUrl], ['Lado direito', assessment.rightViewPhotoUrl]];
    return <div className="cf-app-wrapper"><div className="cf-container cf-history-page">
      <Header active="mais" />
      <button className="cf-history-back-button" type="button" onClick={() => setSelectedSummary(null)}><span>←</span> Voltar para o histórico</button>
      <div className="cf-history-heading"><div><span>AVALIAÇÃO FÍSICA</span><h1 className="cf-h1">Avaliação de {trainee ? `${trainee.firstName} ${trainee.lastName}` : 'aluno'}</h1><p className="cf-text-body">Registrada em {new Intl.DateTimeFormat('pt-BR').format(new Date(`${assessment.registeredAt}T12:00:00`))}.</p></div></div>
      <section className="cf-history-detail-grid"><div className="cf-history-detail-panel"><h2>Composição corporal</h2><div className="cf-history-detail-metrics">{[['Peso', assessment.weight, 'kg'], ['Altura', assessment.height, 'm'], ['IMC', assessment.imc, 'kg/m²'], ['Gordura corporal', assessment.bodyFat, '%'], ['Massa gorda', assessment.fatMass, '%'], ['Massa muscular', assessment.muscleMass, '%']].map(([label, value, unit]) => <div key={String(label)}><span>{label}</span><strong>{value ?? '—'} <small>{unit}</small></strong></div>)}</div></div>
      <div className="cf-history-detail-panel"><h2>Medidas corporais</h2><div className="cf-history-detail-metrics">{measurements.map(([label, value]) => <div key={String(label)}><span>{label}</span><strong>{value ?? '—'} <small>cm</small></strong></div>)}</div></div></section>
      <section className="cf-history-detail-panel"><h2>Fotos de evolução</h2><div className="cf-history-detail-photos">{photos.map(([label, url]) => <div key={String(label)}><span>{label}</span>{url ? <img src={String(url)} alt={`Foto ${label}`} /> : <p>Sem foto de evolução</p>}</div>)}</div></section>
      {assessment.notes && <section className="cf-history-detail-panel"><h2>Observações</h2><p className="cf-text-body">{assessment.notes}</p></section>}
    </div></div>;
  }

  return <div className="cf-app-wrapper"><div className="cf-container cf-history-page">
    <Header active="mais" />
    <div className="cf-history-heading"><div><span>AVALIAÇÃO FÍSICA</span><h1 className="cf-h1">Histórico de avaliações</h1><p className="cf-text-body">Acompanhe as medidas registradas para cada aluno.</p></div></div>
    <section className="cf-history-filter">
      <div className="cf-history-filter-title"><h2>Filtrar por aluno</h2><button type="button" className="cf-btn cf-btn--ghost" onClick={() => selectTrainee('')} disabled={!selectedTraineeId}>Limpar filtro</button></div>
      <div className="cf-history-search"><IconSearch /><input value={traineeSearch} onChange={(event: ChangeEvent<HTMLInputElement>) => setTraineeSearch(event.target.value)} placeholder="Pesquisar aluno para selecionar..." /></div>
      <div className="cf-history-trainee-options">
        {selectableTrainees.map(trainee => <button key={trainee.id} type="button" className={selectedTraineeId === trainee.id ? 'active' : ''} onClick={() => selectTrainee(trainee.id)}>{trainee.firstName} {trainee.lastName}</button>)}
      </div>
    </section>
    <section className="cf-history-results" aria-live="polite">
      <div className="cf-history-results-header"><h2>{selectedTraineeId ? 'Avaliações do aluno selecionado' : 'Avaliações mais recentes'}</h2><span>{selectedTraineeId ? 'Todas as avaliações deste aluno' : 'Exibindo até 8 avaliações por página'}</span></div>
      {isLoading ? <p className="cf-text-body">Carregando avaliações...</p> : summaries.length ? <div className="cf-history-grid">{summaries.map(({ assessment, trainee }) => <article className="cf-history-card" key={assessment.id} role="button" tabIndex={0} onClick={() => setSelectedSummary({ assessment, trainee })} onKeyDown={event => { if (event.key === 'Enter') setSelectedSummary({ assessment, trainee }); }}>
        <div className="cf-history-card-top"><IconActivity /><time>{new Intl.DateTimeFormat('pt-BR').format(new Date(`${assessment.registeredAt}T12:00:00`))}</time></div>
        <h3>{trainee ? `${trainee.firstName} ${trainee.lastName}` : 'Aluno não identificado'}</h3>
        <div className="cf-history-metrics"><span><strong>{assessment.weight ?? '—'}</strong> kg</span><span><strong>{assessment.bodyFat ?? '—'}</strong> % gordura</span><span><strong>{assessment.imc ?? '—'}</strong> IMC</span></div>
        {trainee && <button className="cf-btn cf-btn--ghost" type="button" onClick={event => { event.stopPropagation(); navigate(`/personal/alunos?traineeId=${trainee.id}`); }}>Ver aluno</button>}
      </article>)}</div> : <div className="cf-history-empty"><IconActivity /><h3>Nenhuma avaliação encontrada</h3><p className="cf-text-body">Selecione outro aluno ou registre a primeira avaliação física.</p></div>}
      {totalPages > 1 && <div className="cf-history-pagination"><button type="button" className="cf-btn cf-btn--ghost" disabled={page === 1} onClick={() => setPage(page - 1)}>Anterior</button><span>Página {page} de {totalPages}</span><button type="button" className="cf-btn cf-btn--ghost" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Próxima</button></div>}
    </section>
  </div></div>;
}
