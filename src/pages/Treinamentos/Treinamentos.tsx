import { ChangeEvent } from 'react';
import { Header } from '../../layouts/Header';
import './Treinamentos.css';
import useTreinamentos from './hooks/useTreinamentos';
import LoadFeedback from '../../components/LoadFeedback';

// Ícones minimalistas com strokeWidth refinado (1.5 - 2.0)
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconPlus = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const IconArrowLeft = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
const IconUsers = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconEdit = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconTrash = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;
const IconDumbbell = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 6.5l11 11"/><path d="M21 21l-1-1"/><path d="M3 3l1 1"/><path d="M18 22l4-4"/><path d="M2 6l4-4"/><path d="M3 10l7-7"/><path d="M14 21l7-7"/></svg>;
const IconChevronRight = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;

export default function Treinamentos() {
  const {
    loading, loadError, retry,
    view, setView, searchQuery, setSearchQuery, currentTraining,
    deleteConfirmId, setDeleteConfirmId, formData, setFormData,
    exerciseConfig, setExerciseConfig, exerciseSearch, setExerciseSearch,
    selectedExerciseDef, setSelectedExerciseDef, selectedMuscleGroupIds,
    filteredTrainings, exerciseSearchResults, muscleGroups, trainingToDelete,
    formError, isSaving, isDeleting, openCreate, openEdit, openDetails,
    closeForm, toggleMuscleGroup, selectExercise, addExercise, removeExercise,
    saveTraining, requestDelete, confirmDelete
  } = useTreinamentos();

  // ==========================================
  // RENDER: BIBLIOTECA
  // ==========================================
  const renderLibrary = () => (
    <>
    <div>
      <div className='ex-toolbar'>
        <button className="cf-btn cf-btn--primary" onClick={openCreate}>
          <IconPlus /> Novo treinamento
        </button>
      </div>
      <div className="tr-toolbar">
        <div className="tr-search-box">
          <IconSearch />
          <input
            type="text"
            placeholder="Buscar modelos..."
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </div>

      {filteredTrainings.length === 0 ? (
        <div className="tr-empty-state">
          <IconDumbbell />
          <h3 className="cf-h3">Nenhum treinamento encontrado</h3>
          <p className="cf-text-body" style={{ maxWidth: '400px' }}>
            {searchQuery ? "Sua busca não retornou resultados. Tente outros termos." : "Crie seu primeiro modelo de treino para começar a organizá-los e utilizá-los com seus alunos."}
          </p>
        </div>
      ) : (
        <div className="tr-grid">
          {filteredTrainings.map(training => (
            <div className="tr-card" key={training.id}>
              <div className="tr-card-header">
                <h3 className="cf-h3">{training.title}</h3>
                <p className="cf-text-body tr-clamp-2">{training.description}</p>
              </div>

              <div className="tr-card-meta">
                <span className="tr-badge" title="Quantidade de exercícios">
                  <IconDumbbell /> {training.numberOfExercises} ex.
                </span>
                <span className="tr-badge" title="Alunos utilizando este modelo">
                  <IconUsers /> {training.numberOfTrainees} alunos
                </span>
              </div>

              <div className="tr-card-actions">
                <div className="tr-card-actions-left">
                  <button className="cf-btn-icon" onClick={() => openEdit(training)} title="Editar"><IconEdit /></button>
                  <button className="cf-btn-icon tr-btn-delete" onClick={() => requestDelete(training.id)} title="Excluir"><IconTrash /></button>
                </div>
                <button className="cf-btn cf-btn--ghost" onClick={() => openDetails(training)}>
                  Visualizar <IconChevronRight />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  // ==========================================
  // RENDER: DETALHES
  // ==========================================
  const renderDetails = () => {
    if (!currentTraining) return null;

    return (
      <>
        <div className="tr-header" style={{ flexDirection: 'row', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <button className="cf-btn-icon" onClick={() => setView('list')}><IconArrowLeft /></button>
          <div>
            <h1 className="cf-h1">{currentTraining.title}</h1>
            <p className="cf-text-body" style={{ marginTop: '0.25rem' }}>{currentTraining.description}</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem' }}>
            <button className="cf-btn cf-btn--secondary" onClick={() => openEdit(currentTraining)}>
              <IconEdit /> Editar
            </button>
            <button className="cf-btn cf-btn--danger" onClick={() => requestDelete(currentTraining.id)}>
              <IconTrash /> Excluir
            </button>
          </div>
        </div>

        <div className="tr-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <span className="tr-badge"><IconDumbbell /> {currentTraining.numberOfExercises} exercícios</span>
            <span className="tr-badge"><IconUsers /> Utilizado por {currentTraining.numberOfTrainees} alunos</span>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h2 className="cf-h2" style={{ marginBottom: '1rem' }}>Série de Exercícios</h2>
          <div className="tr-added-exercises">
            {currentTraining.exercises.map((ex, idx) => (
              <div className="tr-exercise-row" key={idx}>
                <div className="tr-ex-number">{String(idx + 1).padStart(2, '0')}</div>
                <div className="tr-ex-info">
                  <span className="tr-ex-name">{ex.exercise.name}</span>
                  <span className="tr-ex-reps">{ex.series} séries × {ex.repetitions} repetições</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  // ==========================================
  // RENDER: FORMULÁRIO (CRIAR/EDITAR)
  // ==========================================
  const renderForm = () => (
    <>
      <div className="tr-header" style={{ flexDirection: 'row', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button className="cf-btn-icon" onClick={closeForm}><IconArrowLeft /></button>
        <h1 className="cf-h1">{formData.id ? 'Editar Treinamento' : 'Novo Treinamento'}</h1>
      </div>

      <div className="tr-panel">
        <h2 className="cf-h2" style={{ marginBottom: '0.5rem' }}>Informações Básicas</h2>
        {formError && <p className="cf-text-body" role="alert" style={{ color: 'var(--cf-danger, #EF4444)' }}>{formError}</p>}
        <div className="tr-form-row">
          <div className="tr-form-group">
            <label>Nome do modelo</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Costas — Foco em Dorsal"
            />
          </div>
        </div>
        <div className="tr-form-row">
          <div className="tr-form-group">
            <label>Descrição e objetivo</label>
            <textarea
              value={formData.description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ex: Treino voltado para hipertrofia das costas..."
            ></textarea>
          </div>
        </div>
      </div>

      <div className="tr-panel">
        <h2 className="cf-h2" style={{ marginBottom: '0.5rem' }}>Agrupamentos Musculares</h2>
        <p className="cf-text-body" style={{ marginBottom: '1rem' }}>
          Selecione um ou mais agrupamentos musculares trabalhados por este treinamento.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {muscleGroups.map(group => {
            const isSelected = selectedMuscleGroupIds.includes(group.id);
            return (
              <button
                key={group.id}
                type="button"
                className="tr-badge"
                onClick={() => toggleMuscleGroup(group.id)}
                style={{
                  cursor: 'pointer',
                  border: isSelected ? '1px solid var(--cf-primary, #6366F1)' : '1px solid transparent',
                  backgroundColor: isSelected ? 'var(--cf-primary, #6366F1)' : undefined,
                  color: isSelected ? '#fff' : undefined,
                }}
              >
                {group.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="tr-panel tr-exercise-builder">
        <h2 className="cf-h2" style={{ marginBottom: '0.5rem' }}>Montagem da Série</h2>

        <div className="tr-form-group" style={{ position: 'relative' }}>
          <label>Adicionar exercício</label>
          <div className="tr-search-box" style={{ maxWidth: '100%' }}>
            <IconSearch />
            <input
              type="text"
              value={exerciseSearch}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setExerciseSearch(e.target.value)}
              placeholder="Pesquisar exercício no catálogo..."
            />
          </div>

          {exerciseSearch && (
            <div className="tr-search-dropdown">
              {exerciseSearchResults.length > 0 ? (
                exerciseSearchResults.map(ex => (
                  <div className="tr-dropdown-item" key={ex.id} onClick={() => selectExercise(ex)}>
                    <div className="tr-dropdown-info">
                      <span className="tr-ex-name">{ex.name}</span>
                      {/* <span className="tr-ex-group">{ex.muscleGroup}</span> */}
                    </div>
                    <span className="tr-dropdown-action">Selecionar +</span>
                  </div>
                ))
              ) : (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--cf-text-muted)' }}>
                  Nenhum exercício encontrado para "{exerciseSearch}".
                </div>
              )}
            </div>
          )}
        </div>

        {selectedExerciseDef && (
          <div className="tr-exercise-config">
            <div className="tr-config-header">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span className="tr-ex-name" style={{ fontSize: '1.1rem' }}>{selectedExerciseDef.name}</span>
                {/* <span className="tr-ex-group" style={{ fontSize: '0.75rem', color: 'var(--cf-text-muted)' }}>{selectedExerciseDef.muscleGroup}</span> */}
              </div>
              <button className="tr-btn-clear" onClick={() => setSelectedExerciseDef(null)}>Cancelar</button>
            </div>
            <div className="tr-form-row" style={{ alignItems: 'flex-end' }}>
              <div className="tr-form-group">
                <label>Séries</label>
                <input
                  type="number" min={1}
                  value={exerciseConfig.series}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setExerciseConfig({ ...exerciseConfig, series: e.target.value })}
                  placeholder="Ex: 4"
                />
              </div>
              <div className="tr-form-group">
                <label>Repetições</label>
                <input
                  type="number" min={1}
                  value={exerciseConfig.repetitions}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setExerciseConfig({ ...exerciseConfig, repetitions: e.target.value })}
                  placeholder="Ex: 12"
                />
              </div>
              <button className="cf-btn cf-btn--primary" onClick={addExercise} style={{ height: '44px', minWidth: '120px' }}>
                Adicionar
              </button>
            </div>
          </div>
        )}

        {formData.exercises.length > 0 && (
          <div className="tr-added-exercises" style={{ marginTop: '1.5rem' }}>
            <h3 className="cf-h3" style={{ marginBottom: '0.5rem', color: 'var(--cf-text-secondary)' }}>Exercícios Adicionados</h3>
            {formData.exercises.map((ex, idx) => (
              <div className="tr-exercise-row" key={idx}>
                <div className="tr-ex-number">{String(idx + 1).padStart(2, '0')}</div>
                <div className="tr-ex-info">
                  <span className="tr-ex-name">{ex.exerciseName}</span>
                  <span className="tr-ex-reps">{ex.series} séries × {ex.repetitions} repetições</span>
                </div>
                <button className="cf-btn-icon tr-btn-delete" onClick={() => removeExercise(idx)} title="Remover">
                  <IconTrash />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <button className="cf-btn cf-btn--ghost" onClick={closeForm}>Cancelar</button>
        <button className="cf-btn cf-btn--primary" onClick={saveTraining} disabled={isSaving}>
          {isSaving ? 'Salvando...' : 'Salvar Treinamento'}
        </button>
      </div>
    </>
  );

  return (
    <div className="tr-page-wrapper">
      <div className="tr-container">
        <Header active="treinamentos" />
        <LoadFeedback loading={loading} error={loadError} retry={retry} />

        {view === 'list' && renderLibrary()}
        {view === 'details' && renderDetails()}
        {view === 'form' && renderForm()}
      </div>

      {deleteConfirmId && (
        <div className="tr-modal-overlay">
          <div className="tr-modal">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h2 className="cf-h2" style={{ color: 'var(--cf-danger, #EF4444)' }}>Excluir modelo?</h2>
              <p className="cf-text-body">
                Este treinamento está sendo utilizado por <strong style={{ color: 'var(--cf-text-primary)' }}>{trainingToDelete?.numberOfTrainees || 0} alunos</strong>.
              </p>
            </div>
            <p className="cf-text-muted" style={{ lineHeight: 1.5 }}>
              Tem certeza de que deseja excluir este modelo da sua biblioteca? Esta ação não poderá ser desfeita.
            </p>
            {formError && <p className="cf-text-body" role="alert" style={{ color: 'var(--cf-danger, #EF4444)' }}>{formError}</p>}
            <div className="tr-modal-actions">
              <button className="cf-btn cf-btn--secondary" onClick={() => setDeleteConfirmId(null)}>Cancelar</button>
              <button className="cf-btn cf-btn--danger" onClick={confirmDelete} disabled={isDeleting}>
                {isDeleting ? 'Excluindo...' : 'Excluir permanentemente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
