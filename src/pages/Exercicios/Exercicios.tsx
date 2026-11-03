import { ChangeEvent } from 'react';
import './Exercicios.css';
import { Header } from '../../layouts/Header';
import useExercicios, { getYoutubeEmbedUrl } from './hooks/useExercicios';
import { ActiveTab } from './types/exercicio.types';
import LoadFeedback from '../../components/LoadFeedback';

const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconPlus = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconStar = ({ filled }: { filled: boolean }) => <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IconChevronRight = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const IconClose = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconEdit = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconTrash = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const IconDumbbell = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 6.5l11 11"/><path d="M21 21l-1-1"/><path d="M3 3l1 1"/><path d="M18 22l4-4"/><path d="M2 6l4-4"/><path d="M3 10l7-7"/><path d="M14 21l7-7"/></svg>;
const IconImage = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
const IconVideo = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>;

export default function Exercicios() {
  const {
    loading, loadError, retry,
    searchQuery, setSearchQuery, activeTab, setActiveTab, selectedExercise, setSelectedExercise,
    isFormOpen, formData, setFormData, editingExercise, deleteConfirmTarget, counts,
    filteredExercises, formError, isSaving, isDeleting, openCreate, openEdit, closeForm, handlePhotoChange,
    openDelete, closeDelete, saveExercise, confirmDelete, muscleGroups, toggleMuscleGroup,
    photoPreviewUrl, videoPreviewUrl, videoEmbedUrl, toggleFavorite, isUpdatingFavorite
  } = useExercicios();

  const tabs: { value: ActiveTab; label: string; count: number }[] = [
    { value: 'all', label: 'Todos', count: counts.all },
    { value: 'favorites', label: 'Favoritos', count: counts.favorites },
    { value: 'system', label: 'Do sistema', count: counts.system },
    { value: 'personal', label: 'Meus exercícios', count: counts.personal }
  ];

  return (
    <div className="ex-page-wrapper">
      <div className="ex-container">
        <Header active="exercicios" />
        <LoadFeedback loading={loading} error={loadError} retry={retry} />
        {!isFormOpen && !deleteConfirmTarget && formError && <p className="cf-load-feedback is-error" role="alert">{formError}</p>}
        <div className="ex-header">
          <button className="cf-btn cf-btn--primary" onClick={openCreate}><IconPlus /> Novo exercício</button>
        </div>

        <div className="ex-toolbar">
          <div className="ex-search-box">
            <IconSearch />
            <input value={searchQuery} onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value)} placeholder="Buscar exercício ou agrupamento..." />
          </div>
          <nav className="ex-tabs-nav">
            {tabs.map(tab => <button key={tab.value} className={`ex-tab-btn ${activeTab === tab.value ? 'active' : ''}`} onClick={() => setActiveTab(tab.value)}>{tab.label} <span className="ex-tab-count">{tab.count}</span></button>)}
          </nav>
        </div>

        {filteredExercises.length ? (
          <div className="ex-grid">
            {filteredExercises.map(exercise => (
              <div key={exercise.id} className="ex-card" role="button" tabIndex={0} onClick={() => setSelectedExercise(exercise)} onKeyDown={event => event.key === 'Enter' && setSelectedExercise(exercise)}>
                <div className="ex-card-media">
                  {exercise.photoKey ? <img src={exercise.photoKey} alt={exercise.name} className="ex-card-img" /> : <div className="ex-card-media-fallback"><IconImage /><span>Foto não disponível</span></div>}
                  <div className="ex-card-overlay-top">
                    <div className="ex-badge-group">
                      <span className={`ex-origin-badge ${exercise.system ? 'system' : 'personal'}`}>{exercise.system ? 'Sistema' : 'Meu exercício'}</span>
                    </div>
                    {!exercise.system && (
                      <button className={`ex-fav-btn ${exercise.favorite ? 'is-favorite' : ''}`} onClick={event => { event.stopPropagation(); toggleFavorite(exercise); }} disabled={isUpdatingFavorite} title={exercise.favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'} aria-label={exercise.favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}><IconStar filled={Boolean(exercise.favorite)} /></button>
                    )}
                  </div>
                </div>
                <div className="ex-card-content">
                  <div className="ex-card-body">
                    <h3 className="ex-card-title">{exercise.name}</h3>
                    <span className="ex-card-muscle">{exercise.muscleGroups.map(group => group.name).join(', ') || 'Sem agrupamento muscular'}</span>
                  </div>
                  <div className="ex-card-footer"><span className="ex-card-action-text">Ver detalhes <IconChevronRight /></span></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="ex-empty-state">
            <div className="ex-empty-icon"><IconDumbbell /></div>
            <h3 className="cf-h3">Nenhum exercício encontrado</h3>
            <p className="cf-text-body">{searchQuery ? `Não encontramos resultados para "${searchQuery}".` : 'Não existem exercícios nesta categoria.'}</p>
            {!searchQuery && activeTab === 'personal' && <button className="cf-btn cf-btn--primary" onClick={openCreate}><IconPlus /> Criar exercício</button>}
          </div>
        )}
      </div>

      {selectedExercise && (
        <div className="ex-modal-overlay" onClick={() => setSelectedExercise(null)}>
          <div className="ex-modal" onClick={event => event.stopPropagation()}>
            <div className="ex-modal-header">
              <div><div className="ex-badge-group"><span className={`ex-origin-badge ${selectedExercise.system ? 'system' : 'personal'}`}>{selectedExercise.system ? 'Exercício do sistema' : 'Meu exercício'}</span></div><h2 className="cf-h2" style={{ fontSize: '1.35rem', marginTop: '0.5rem' }}>{selectedExercise.name}</h2></div>
              <button className="cf-btn-icon" onClick={() => setSelectedExercise(null)}><IconClose /></button>
            </div>
            <div className="ex-modal-body">
              {formError && <p className="cf-text-body" role="alert" style={{ color: 'var(--cf-danger, #EF4444)' }}>{formError}</p>}
              <div className="ex-detail-media-grid">
                {selectedExercise.photoKey ? <div className="ex-detail-photo-container"><img src={selectedExercise.photoKey} alt={selectedExercise.name} className="ex-detail-photo" /></div> : <MediaFallback icon={<IconImage />} title="Foto não disponível" />}
                <div className="ex-detail-video-container"><span className="ex-info-label">Vídeo demonstrativo</span>{selectedExercise.videoKey ? <VideoPlayer source={selectedExercise.videoKey} poster={selectedExercise.photoKey ?? undefined} /> : <MediaFallback icon={<IconVideo />} title="Vídeo não disponível" />}</div>
              </div>
              <div className="ex-info-block"><span className="ex-info-label">Agrupamentos musculares</span><span className="ex-info-value">{selectedExercise.muscleGroups.map(group => group.name).join(', ') || 'Não informado'}</span></div>
            </div>
            <div className="ex-modal-footer">
              {!selectedExercise.system && (
                <button className="cf-btn cf-btn--secondary" onClick={() => toggleFavorite(selectedExercise)} disabled={isUpdatingFavorite}><IconStar filled={Boolean(selectedExercise.favorite)} />{selectedExercise.favorite ? 'Favoritado' : 'Favoritar'}</button>
              )}
              {!selectedExercise.system && <><button className="cf-btn cf-btn--danger" onClick={() => openDelete(selectedExercise)}><IconTrash /> Excluir</button><button className="cf-btn cf-btn--primary" onClick={() => openEdit(selectedExercise)}><IconEdit /> Editar</button></>}
            </div>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="ex-modal-overlay" onClick={closeForm}>
          <div className="ex-modal" onClick={event => event.stopPropagation()}>
            <div className="ex-modal-header"><h2 className="cf-h2">{editingExercise ? 'Editar exercício' : 'Novo exercício'}</h2><button className="cf-btn-icon" onClick={closeForm}><IconClose /></button></div>
            <form onSubmit={saveExercise}>
              <div className="ex-modal-body">
                {formError && <p className="cf-text-body" role="alert" style={{ color: 'var(--cf-danger, #EF4444)' }}>{formError}</p>}
                <div className="ex-form-group"><label>Nome do exercício *</label><input type="text" required value={formData.name} onChange={(event: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: event.target.value })} placeholder="Ex: Remada curvada" /></div>
                <div className="ex-form-group">
                  <label>Agrupamentos musculares *</label>
                  <p className="ex-form-helper">Selecione todos os grupos trabalhados pelo exercício.</p>
                  <div className="ex-muscle-groups-selector">
                    {muscleGroups.map(group => {
                      const isSelected = formData.muscleGroupsId.includes(group.id);
                      return <button key={group.id} type="button" className={`ex-muscle-group-option ${isSelected ? 'is-selected' : ''}`} onClick={() => toggleMuscleGroup(group.id)} aria-pressed={isSelected}>{group.name}</button>;
                    })}
                  </div>
                </div>
                <div className="ex-form-row">
                  <div className="ex-form-group">
                    <label>Foto do exercício</label>
                    <label className="ex-photo-picker" htmlFor="exercise-photo">
                      <IconImage />
                      <span>{formData.photo instanceof File ? formData.photo.name : 'Selecionar foto'}</span>
                    </label>
                    <input
                      id="exercise-photo"
                      className="ex-photo-input"
                      type="file"
                      accept='image/*'
                      onChange={handlePhotoChange}
                    />
                    <span className="ex-form-helper">Formatos de imagem aceitos pelo navegador.</span>
                  </div>
                  <div className="ex-form-group"><label>URL do vídeo</label><input type="url" value={formData.videoUrl} onChange={(event: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, videoUrl: event.target.value })} placeholder="https://exemplo.com/video.mp4" /></div>
                </div>
                <div className="ex-photo-preview" aria-live="polite">
                  {photoPreviewUrl ? <img src={photoPreviewUrl} alt="Prévia da foto do exercício" /> : <div className="ex-photo-preview-empty"><IconImage /><span>A prévia da foto aparecerá aqui.</span></div>}
                </div>
                <div className="ex-form-group">
                  <label>Prévia do vídeo</label>
                  <div className="ex-video-preview" aria-live="polite">
                    {videoEmbedUrl ? (
                      <iframe src={videoEmbedUrl} title="Prévia do vídeo do YouTube" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    ) : videoPreviewUrl ? (
                      <video controls src={videoPreviewUrl} poster={photoPreviewUrl ?? undefined}>Seu navegador não suporta vídeo.</video>
                    ) : (
                      <div className="ex-video-preview-empty"><IconVideo /><span>Cole uma URL direta ou um link do YouTube para visualizar o vídeo.</span></div>
                    )}
                  </div>
                </div>
              </div>
              <div className="ex-modal-footer"><button type="button" className="cf-btn cf-btn--ghost" onClick={closeForm}>Cancelar</button><button type="submit" className="cf-btn cf-btn--primary" disabled={isSaving}>{isSaving ? 'Salvando...' : editingExercise ? 'Salvar alterações' : 'Criar exercício'}</button></div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmTarget && (
        <div className="ex-modal-overlay" onClick={closeDelete}>
          <div className="ex-modal" style={{ maxWidth: '440px' }} onClick={event => event.stopPropagation()}>
            <div className="ex-modal-header"><h2 className="cf-h2">Excluir exercício?</h2><button className="cf-btn-icon" onClick={closeDelete}><IconClose /></button></div>
            <div className="ex-modal-body"><p className="cf-text-body">Você está prestes a remover <strong>"{deleteConfirmTarget.name}"</strong>. Esta ação não poderá ser desfeita.</p>{formError && <p className="cf-text-body" role="alert" style={{ color: 'var(--cf-danger, #EF4444)' }}>{formError}</p>}</div>
            <div className="ex-modal-footer"><button className="cf-btn cf-btn--secondary" onClick={closeDelete}>Cancelar</button><button className="cf-btn cf-btn--danger" onClick={confirmDelete} disabled={isDeleting}>{isDeleting ? 'Excluindo...' : 'Excluir definitivamente'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

function MediaFallback({ icon, title }: { icon: React.ReactNode; title: string }) {
  return <div className="ex-media-fallback-card"><div className="ex-fallback-icon">{icon}</div><h4>{title}</h4></div>;
}

function VideoPlayer({ source, poster }: { source: string; poster?: string }) {
  const youtubeEmbedUrl = getYoutubeEmbedUrl(source);

  return <div className="ex-video-player-wrapper">
    {youtubeEmbedUrl ? <iframe src={youtubeEmbedUrl} title="Vídeo demonstrativo do YouTube" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <video controls src={source} poster={poster}>Seu navegador não suporta vídeo.</video>}
  </div>;
}
