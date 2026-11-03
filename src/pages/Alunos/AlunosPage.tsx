import { ChangeEvent, KeyboardEvent, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../layouts/Header';
import { formatRelativeTime } from '../../utils/formatLocaldateTime';
import { getActivityLevel } from '../../utils/getActivityLevel';
import getDaysOfWeek from '../../utils/getDaysOfWeek';
import { splitDateTime } from '../../utils/splitDateTime';
import './AlunosPage.css';
import useAlunos from './hooks/useAlunos';
import PlanoTreinoAluno from './components/PlanoTreinoAluno';
import useTrainingPlanService from '../../hooks/useTrainingPlanService';
import { TrainingPlanDetails } from '../../services/TrainingPlanService';
import LoadFeedback from '../../components/LoadFeedback';
import {
  EvolutionPhoto,
  EvolutionPhotoKey,
  PhysicalAssessmentFormData,
  VisiblePhotos
} from './types/aluno.types';

// Componentes estáticos base da UI
const Icons = {
  Search: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>),
  ArrowLeft: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>),
  ChevronLeft: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>),
  ChevronRight: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>),
  Calendar: () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>),
  Activity: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>),
  Clock: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>),
  Check: () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>),
  Plus: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>),
  Coffee: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>),
  Eye: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>),
  EyeOff: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>),
  FileText: () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2 2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>),
  Image: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>)
};

export default function AlunosPage() {
  const navigate = useNavigate();
  const trainingPlanService = useTrainingPlanService();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [trainingPlanMode, setTrainingPlanMode] = useState<'create' | 'edit' | 'new' | null>(null);

  const {
    loading, loadError, retry,
    trainees,
    traineSelected,
    setTraineeSelectedId,
    traineeSelectedId,
    isCreateOpen,
    formData,
    setFormData,
    formError,
    photoPreviewUrl,
    isSaving,
    isPhysicalAssessmentOpen,
    editingPhysicalAssessment,
    physicalAssessmentForm,
    physicalAssessmentError,
    physicalAssessmentPhotoPreviews,
    calculatedImc,
    isSavingPhysicalAssessment,
    openCreate,
    closeCreate,
    handlePhotoChange,
    saveTrainee,
    openPhysicalAssessment,
    openEditPhysicalAssessment,
    closePhysicalAssessment,
    updatePhysicalAssessmentField,
    handlePhysicalAssessmentPhotoChange,
    savePhysicalAssessment
  } = useAlunos();


  const activeTrainingPlanQuery = useQuery<TrainingPlanDetails | null>(
    ['training-plan', traineeSelectedId],
    async () => {
      if (!traineeSelectedId) return null;

      try {
        return await trainingPlanService.getByTrainee(traineeSelectedId);
      } catch (error: any) {
        if (error.response?.status === 404) return null;
        throw error;
      }
    },
    { enabled: Boolean(traineeSelectedId) }
  );
  const activeTrainingPlan = activeTrainingPlanQuery.data ?? null;


  const lastPhysicalAssessment = useMemo(() => traineSelected?.physicalAssessments.reduce((latest, assessment) =>
    !latest || assessment.registeredAt > latest.registeredAt ? assessment : latest,
    undefined as typeof traineSelected.physicalAssessments[number] | undefined), [traineSelected]);

  const avatarDefault = '/avatar-placeholder.svg';

  const avatar = traineSelected?.trainee.avatarUrl
    ? traineSelected?.trainee.avatarUrl
    : avatarDefault;

  const displayPercentage = Math.trunc(traineSelected?.trainee.weeklyProgressPercentage ?? 0);

  const [visiblePhotos, setVisiblePhotos] = useState<VisiblePhotos>({
    front: true,
    left: true,
    right: true,
    back: true
  });

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);

  const filteredAlunos = useMemo(() => {
    return trainees.filter((aluno) => {
      const matchesSearch =
        `${aluno.firstName} ${aluno.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (aluno.objective ?? '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [trainees, searchTerm]);

  const evolutionPhotos: EvolutionPhoto[] = useMemo(() => {
    if (!traineSelected || !lastPhysicalAssessment) return [];
    return [
      { key: 'front', label: 'Frente', image: lastPhysicalAssessment?.frontViewPhotoUrl },
      { key: 'left', label: 'Lado esquerdo', image: lastPhysicalAssessment?.leftViewPhotoUrl },
      { key: 'right', label: 'Lado direito', image: lastPhysicalAssessment?.rightViewPhotoUrl },
      { key: 'back', label: 'Costas', image: lastPhysicalAssessment?.backViewPhotoUrl },
    ];
  }, [traineSelected, lastPhysicalAssessment]);

  const togglePhotoVisibility = (positionKey: EvolutionPhotoKey) => {
    setVisiblePhotos((prev) => ({
      ...prev,
      [positionKey]: !prev[positionKey]
    }));
  };

  const handleNextPhoto = () => {
    if (evolutionPhotos.length === 0) return;
    setCurrentPhotoIndex((prev) => (prev + 1) % evolutionPhotos.length);
  };

  const handlePrevPhoto = () => {
    if (evolutionPhotos.length === 0) return;
    setCurrentPhotoIndex((prev) => (prev - 1 + evolutionPhotos.length) % evolutionPhotos.length);
  };

  const handleSelectPhoto = (index: number) => {
    setCurrentPhotoIndex(index);
  };

  useEffect(() => {
    if (!traineSelected || !lastPhysicalAssessment || evolutionPhotos.length === 0) return;

    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % evolutionPhotos.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [traineSelected, lastPhysicalAssessment, evolutionPhotos.length, currentPhotoIndex]);

  return (
    <div className="cf-app-wrapper">
      <div className={`cf-container cf-alunos-page${isCreateOpen || isPhysicalAssessmentOpen || trainingPlanMode ? ' cf-alunos-page--creating' : ''}`}>
        <Header active="alunos" />
        <LoadFeedback loading={loading} error={loadError} retry={retry} />

        {trainingPlanMode && traineSelected ? (
          <PlanoTreinoAluno
            traineeId={traineSelected.trainee.id}
            traineeName={`${traineSelected.trainee.firstName} ${traineSelected.trainee.lastName}`}
            createNew={trainingPlanMode === 'new'}
            onBack={() => setTrainingPlanMode(null)}
            onSaved={() => setTrainingPlanMode(null)}
          />
        ) : isPhysicalAssessmentOpen && traineSelected ? (
          <form className="cf-physical-assessment-view" onSubmit={savePhysicalAssessment}>
            <div className="cf-trainee-create-header">
              <button className="cf-btn-back" type="button" onClick={closePhysicalAssessment}>
                <Icons.ArrowLeft /> Voltar para o aluno
              </button>
              <div className="cf-trainee-create-title">
                <span className="cf-trainee-create-eyebrow">Avaliação física</span>
                <h1 className="cf-h1">{editingPhysicalAssessment ? 'Editar avaliação física' : lastPhysicalAssessment ? 'Nova avaliação física' : 'Iniciar avaliação física'}</h1>
                  <p className="cf-text-body">Registre as medidas atuais de {traineSelected.trainee.firstName} {traineSelected.trainee.lastName}.</p>
              </div>
            </div>

            <section className="cf-trainee-panel" aria-labelledby="assessment-composition-title">
              <div className="cf-trainee-panel-heading">
                <div>
                  <span className="cf-trainee-panel-eyebrow">Medidas atuais</span>
                  <h2 id="assessment-composition-title">Composição corporal</h2>
                  <p>O IMC é calculado automaticamente a partir do peso e da altura.</p>
                </div>
              </div>
              {physicalAssessmentError && <p className="cf-trainee-form-error" role="alert">{physicalAssessmentError}</p>}
              <div className="cf-assessment-form-grid">
                <div className="cf-trainee-form-group">
                  <label htmlFor="assessment-date">Data da avaliação *</label>
                  <input id="assessment-date" type="date" value={physicalAssessmentForm.registeredAt} onChange={event => updatePhysicalAssessmentField('registeredAt', event.target.value)} required />
                </div>
                <div className="cf-trainee-form-group">
                  <label htmlFor="assessment-age">Idade</label>
                  <div className="cf-assessment-input-unit cf-assessment-input-unit--readonly"><input id="assessment-age" value={physicalAssessmentForm.age || '—'} readOnly /><span>anos</span></div>
                </div>
                <div className="cf-trainee-form-group">
                  <label htmlFor="assessment-weight">Peso *</label>
                  <div className="cf-assessment-input-unit"><input id="assessment-weight" type="number" min="0" step="0.1" value={physicalAssessmentForm.weight} onChange={event => updatePhysicalAssessmentField('weight', event.target.value)} placeholder="Ex.: 72,5" required /><span>kg</span></div>
                </div>
                <div className="cf-trainee-form-group">
                  <label htmlFor="assessment-height">Altura *</label>
                  <div className="cf-assessment-input-unit"><input id="assessment-height" type="number" min="0" step="0.01" value={physicalAssessmentForm.height} onChange={event => updatePhysicalAssessmentField('height', event.target.value)} placeholder="Ex.: 1,75" required /><span>m</span></div>
                </div>
                <div className="cf-trainee-form-group">
                  <label htmlFor="assessment-imc">IMC calculado</label>
                  <div className="cf-assessment-input-unit cf-assessment-input-unit--readonly"><input id="assessment-imc" value={calculatedImc ?? '—'} readOnly /><span>kg/m²</span></div>
                </div>
                <div className="cf-trainee-form-group">
                  <label htmlFor="assessment-body-fat">Gordura corporal</label>
                  <div className="cf-assessment-input-unit"><input id="assessment-body-fat" type="number" min="0" step="0.1" value={physicalAssessmentForm.bodyFat} onChange={event => updatePhysicalAssessmentField('bodyFat', event.target.value)} placeholder="Ex.: 18,5" /><span>%</span></div>
                </div>
                <div className="cf-trainee-form-group">
                  <label htmlFor="assessment-fat-mass">Massa gorda</label>
                  <div className="cf-assessment-input-unit"><input id="assessment-fat-mass" type="number" min="0" step="0.1" value={physicalAssessmentForm.fatMass} onChange={event => updatePhysicalAssessmentField('fatMass', event.target.value)} placeholder="Ex.: 13,4" /><span>%</span></div>
                </div>
                <div className="cf-trainee-form-group">
                  <label htmlFor="assessment-muscle-mass">Massa muscular</label>
                  <div className="cf-assessment-input-unit"><input id="assessment-muscle-mass" type="number" min="0" step="0.1" value={physicalAssessmentForm.muscleMass} onChange={event => updatePhysicalAssessmentField('muscleMass', event.target.value)} placeholder="Ex.: 42,0" /><span>%</span></div>
                </div>
              </div>
            </section>

            <section className="cf-trainee-panel" aria-labelledby="assessment-measurements-title">
              <div className="cf-trainee-panel-heading">
                <div>
                  <span className="cf-trainee-panel-eyebrow">Perimetria</span>
                  <h2 id="assessment-measurements-title">Medidas corporais</h2>
                  <p>Preencha as circunferências medidas em centímetros.</p>
                </div>
              </div>
              <div className="cf-assessment-form-grid">
                <div className="cf-trainee-form-group"><label htmlFor="assessment-chest">Peitoral</label><div className="cf-assessment-input-unit"><input id="assessment-chest" type="number" min="0" step="0.1" value={physicalAssessmentForm.chest} onChange={event => updatePhysicalAssessmentField('chest', event.target.value)} /><span>cm</span></div></div>
                <div className="cf-trainee-form-group"><label htmlFor="assessment-waist">Cintura</label><div className="cf-assessment-input-unit"><input id="assessment-waist" type="number" min="0" step="0.1" value={physicalAssessmentForm.waist} onChange={event => updatePhysicalAssessmentField('waist', event.target.value)} /><span>cm</span></div></div>
                <div className="cf-trainee-form-group"><label htmlFor="assessment-abdomen">Abdômen</label><div className="cf-assessment-input-unit"><input id="assessment-abdomen" type="number" min="0" step="0.1" value={physicalAssessmentForm.abdomen} onChange={event => updatePhysicalAssessmentField('abdomen', event.target.value)} /><span>cm</span></div></div>
                <div className="cf-trainee-form-group"><label htmlFor="assessment-hip">Quadril</label><div className="cf-assessment-input-unit"><input id="assessment-hip" type="number" min="0" step="0.1" value={physicalAssessmentForm.hip} onChange={event => updatePhysicalAssessmentField('hip', event.target.value)} /><span>cm</span></div></div>
                <div className="cf-trainee-form-group"><label htmlFor="assessment-right-arm">Braço direito</label><div className="cf-assessment-input-unit"><input id="assessment-right-arm" type="number" min="0" step="0.1" value={physicalAssessmentForm.rightArm} onChange={event => updatePhysicalAssessmentField('rightArm', event.target.value)} /><span>cm</span></div></div>
                <div className="cf-trainee-form-group"><label htmlFor="assessment-left-arm">Braço esquerdo</label><div className="cf-assessment-input-unit"><input id="assessment-left-arm" type="number" min="0" step="0.1" value={physicalAssessmentForm.leftArm} onChange={event => updatePhysicalAssessmentField('leftArm', event.target.value)} /><span>cm</span></div></div>
                <div className="cf-trainee-form-group"><label htmlFor="assessment-right-thigh">Coxa direita</label><div className="cf-assessment-input-unit"><input id="assessment-right-thigh" type="number" min="0" step="0.1" value={physicalAssessmentForm.rightThigh} onChange={event => updatePhysicalAssessmentField('rightThigh', event.target.value)} /><span>cm</span></div></div>
                <div className="cf-trainee-form-group"><label htmlFor="assessment-left-thigh">Coxa esquerda</label><div className="cf-assessment-input-unit"><input id="assessment-left-thigh" type="number" min="0" step="0.1" value={physicalAssessmentForm.leftThigh} onChange={event => updatePhysicalAssessmentField('leftThigh', event.target.value)} /><span>cm</span></div></div>
              </div>
            </section>

            <section className="cf-trainee-panel" aria-labelledby="assessment-context-title">
              <div className="cf-trainee-panel-heading"><div><span className="cf-trainee-panel-eyebrow">Contexto</span><h2 id="assessment-context-title">Informações complementares</h2></div></div>
              <div className="cf-assessment-form-grid">
                <div className="cf-trainee-form-group"><label htmlFor="assessment-activity">Nível de atividade</label><select id="assessment-activity" value={physicalAssessmentForm.activityLevel} onChange={event => updatePhysicalAssessmentField('activityLevel', event.target.value as PhysicalAssessmentFormData['activityLevel'])}><option value="">Não informado</option><option value="SEDENTARY">Sedentário</option><option value="LIGHT">Leve</option><option value="MODERATE">Moderado</option><option value="ACTIVE">Ativo</option><option value="VERY_ACTIVE">Muito ativo</option></select></div>
                <div className="cf-trainee-form-group cf-trainee-form-group--full"><label htmlFor="assessment-notes">Observações</label><textarea id="assessment-notes" rows={4} value={physicalAssessmentForm.notes} onChange={event => updatePhysicalAssessmentField('notes', event.target.value)} placeholder="Registre observações relevantes para o acompanhamento do aluno." /></div>
              </div>
            </section>

            <section className="cf-trainee-panel" aria-labelledby="assessment-photos-title">
              <div className="cf-trainee-panel-heading">
                <div>
                  <span className="cf-trainee-panel-eyebrow">Evolução visual</span>
                  <h2 id="assessment-photos-title">Fotos da avaliação</h2>
                  <p>Selecione as fotos de frente, costas e laterais. Elas serão vinculadas ao registro quando o envio de imagens estiver disponível.</p>
                </div>
              </div>
              <div className="cf-assessment-photo-grid">
                <div className="cf-assessment-photo-field">
                  <span className="cf-assessment-photo-label">Frente</span>
                  <label className="cf-assessment-photo-picker" htmlFor="assessment-photo-front">
                    {physicalAssessmentPhotoPreviews.front ? <img src={physicalAssessmentPhotoPreviews.front} alt="Prévia frontal" /> : <span className="cf-assessment-photo-placeholder"><Icons.Image /> Adicionar foto</span>}
                  </label>
                  <input id="assessment-photo-front" className="cf-trainee-photo-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={event => handlePhysicalAssessmentPhotoChange('front', event)} />
                  <span className="cf-assessment-photo-file-name">{physicalAssessmentForm.photos.front?.name ?? 'Nenhuma foto selecionada'}</span>
                </div>
                <div className="cf-assessment-photo-field">
                  <span className="cf-assessment-photo-label">Costas</span>
                  <label className="cf-assessment-photo-picker" htmlFor="assessment-photo-back">
                    {physicalAssessmentPhotoPreviews.back ? <img src={physicalAssessmentPhotoPreviews.back} alt="Prévia das costas" /> : <span className="cf-assessment-photo-placeholder"><Icons.Image /> Adicionar foto</span>}
                  </label>
                  <input id="assessment-photo-back" className="cf-trainee-photo-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={event => handlePhysicalAssessmentPhotoChange('back', event)} />
                  <span className="cf-assessment-photo-file-name">{physicalAssessmentForm.photos.back?.name ?? 'Nenhuma foto selecionada'}</span>
                </div>
                <div className="cf-assessment-photo-field">
                  <span className="cf-assessment-photo-label">Lado esquerdo</span>
                  <label className="cf-assessment-photo-picker" htmlFor="assessment-photo-left">
                    {physicalAssessmentPhotoPreviews.left ? <img src={physicalAssessmentPhotoPreviews.left} alt="Prévia lateral esquerda" /> : <span className="cf-assessment-photo-placeholder"><Icons.Image /> Adicionar foto</span>}
                  </label>
                  <input id="assessment-photo-left" className="cf-trainee-photo-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={event => handlePhysicalAssessmentPhotoChange('left', event)} />
                  <span className="cf-assessment-photo-file-name">{physicalAssessmentForm.photos.left?.name ?? 'Nenhuma foto selecionada'}</span>
                </div>
                <div className="cf-assessment-photo-field">
                  <span className="cf-assessment-photo-label">Lado direito</span>
                  <label className="cf-assessment-photo-picker" htmlFor="assessment-photo-right">
                    {physicalAssessmentPhotoPreviews.right ? <img src={physicalAssessmentPhotoPreviews.right} alt="Prévia lateral direita" /> : <span className="cf-assessment-photo-placeholder"><Icons.Image /> Adicionar foto</span>}
                  </label>
                  <input id="assessment-photo-right" className="cf-trainee-photo-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={event => handlePhysicalAssessmentPhotoChange('right', event)} />
                  <span className="cf-assessment-photo-file-name">{physicalAssessmentForm.photos.right?.name ?? 'Nenhuma foto selecionada'}</span>
                </div>
              </div>
            </section>

            <div className="cf-trainee-form-actions"><button className="cf-btn cf-btn--ghost" type="button" onClick={closePhysicalAssessment}>Cancelar</button><button className="cf-btn cf-btn--primary" type="submit" disabled={isSavingPhysicalAssessment}>{isSavingPhysicalAssessment ? 'Salvando...' : editingPhysicalAssessment ? 'Salvar alterações' : 'Salvar avaliação'}</button></div>
          </form>
        ) : isCreateOpen ? (
          <form className="cf-trainee-create-view" onSubmit={saveTrainee}>
            <div className="cf-trainee-create-header">
              <button
                className="cf-btn-back"
                type="button"
                onClick={closeCreate}
                aria-label="Voltar para a lista de alunos"
              >
                <Icons.ArrowLeft /> Voltar para lista de alunos
              </button>

              <div className="cf-trainee-create-title">
                <span className="cf-trainee-create-eyebrow">Cadastro de aluno</span>
                <h1 className="cf-h1">Novo aluno</h1>
                <p className="cf-text-body">Cadastre as informações iniciais para vincular o aluno ao seu acompanhamento.</p>
              </div>
            </div>

            <section className="cf-trainee-panel" aria-labelledby="trainee-basic-data-title">
              <div className="cf-trainee-panel-heading">
                <div>
                  <span className="cf-trainee-panel-eyebrow">Informações básicas</span>
                  <h2 id="trainee-basic-data-title">Dados do aluno</h2>
                  <p>A avaliação física e os dados de evolução serão preenchidos em outra etapa.</p>
                </div>
              </div>

              {formError && <p className="cf-trainee-form-error" role="alert">{formError}</p>}

              <div className="cf-trainee-form-grid">
                <div className="cf-trainee-form-group">
                  <label htmlFor="trainee-first-name">Primeiro nome *</label>
                  <input id="trainee-first-name" autoComplete="given-name" value={formData.firstName} onChange={(event: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, firstName: event.target.value })} placeholder="Ex.: Ana" required />
                </div>
                <div className="cf-trainee-form-group">
                  <label htmlFor="trainee-last-name">Sobrenome *</label>
                  <input id="trainee-last-name" autoComplete="family-name" value={formData.lastName} onChange={(event: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, lastName: event.target.value })} placeholder="Ex.: Silva" required />
                </div>
              </div>
            </section>

            <section className="cf-trainee-panel" aria-labelledby="trainee-access-title">
              <div className="cf-trainee-panel-heading">
                <div>
                  <span className="cf-trainee-panel-eyebrow">Acesso à plataforma</span>
                  <h2 id="trainee-access-title">Usuário do aluno</h2>
                  <p>Defina as credenciais que o aluno usará para acessar a plataforma.</p>
                </div>
              </div>

              <div className="cf-trainee-form-grid">
                <div className="cf-trainee-form-group">
                  <label htmlFor="trainee-username">Nome de usuário *</label>
                  <input id="trainee-username" autoComplete="username" value={formData.username} onChange={(event: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, username: event.target.value })} placeholder="Ex.: ana.silva" required />
                </div>
                <div className="cf-trainee-form-group">
                  <label htmlFor="trainee-email">E-mail *</label>
                  <input id="trainee-email" type="email" autoComplete="email" value={formData.email} onChange={(event: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: event.target.value })} placeholder="ana@email.com" required />
                </div>
                <div className="cf-trainee-form-group">
                  <label htmlFor="trainee-password">Senha *</label>
                  <input id="trainee-password" type="password" autoComplete="new-password" value={formData.password} onChange={(event: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: event.target.value })} placeholder="Defina uma senha" required />
                </div>
                <div className="cf-trainee-form-group">
                  <label htmlFor="trainee-confirm-password">Confirmar senha *</label>
                  <input id="trainee-confirm-password" type="password" autoComplete="new-password" value={formData.confirmPassword} onChange={(event: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, confirmPassword: event.target.value })} placeholder="Repita a senha" required />
                </div>
                <div className="cf-trainee-form-group cf-trainee-form-group--full">
                  <label htmlFor="trainee-recovery-email">E-mail de recuperação</label>
                  <input id="trainee-recovery-email" type="email" autoComplete="email" value={formData.recoveryEmail} onChange={(event: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, recoveryEmail: event.target.value })} placeholder="Opcional: outro e-mail para recuperação" />
                  <span>Use apenas quando o aluno tiver outro endereço para recuperação da conta.</span>
                </div>
              </div>
            </section>

            <section className="cf-trainee-panel" aria-labelledby="trainee-photo-title">
              <div className="cf-trainee-panel-heading">
                <div>
                  <span className="cf-trainee-panel-eyebrow">Perfil do aluno</span>
                  <h2 id="trainee-photo-title">Foto do aluno</h2>
                  <p>Adicione uma foto para facilitar a identificação do aluno na sua lista.</p>
                </div>
              </div>

              <div className="cf-trainee-media-layout">
                <div className="cf-trainee-form-group">
                  <label htmlFor="trainee-photo">Adicionar foto</label>
                  <label className="cf-trainee-photo-picker" htmlFor="trainee-photo"><Icons.Image /><span>{formData.photo?.name ?? 'Selecionar foto'}</span></label>
                  <input id="trainee-photo" className="cf-trainee-photo-input" type="file" accept="image/*" onChange={handlePhotoChange} />
                  <span>Formatos de imagem comuns são aceitos.</span>
                </div>
                <div className="cf-trainee-photo-preview">
                  {photoPreviewUrl ? <img src={photoPreviewUrl} alt="Prévia da foto do aluno" /> : <div><Icons.Image /><span>A prévia da foto aparecerá aqui.</span></div>}
                </div>
              </div>
            </section>

            <div className="cf-trainee-form-actions">
              <button className="cf-btn cf-btn--ghost" type="button" onClick={closeCreate}>Cancelar</button>
              <button className="cf-btn cf-btn--primary" type="submit" disabled={isSaving}>{isSaving ? 'Cadastrando...' : 'Cadastrar aluno'}</button>
            </div>
          </form>
        ) : traineSelected ? (
          <div className="cf-aluno-detail-view">
            <button
              className="cf-btn-back"
              onClick={() => {
                setTraineeSelectedId(null);
                setCurrentPhotoIndex(0);
              }}
              aria-label="Voltar para a lista de alunos"
            >
              <Icons.ArrowLeft /> Voltar para lista de alunos
            </button>

            <div className="cf-aluno-detail-hero">
              <img src={avatar} alt={traineSelected.trainee.firstName} className="cf-detail-avatar" />
             
              <div className="cf-detail-main-info">
                <h2>{traineSelected.trainee.firstName} {traineSelected.trainee.lastName}</h2>
                  {traineSelected.trainee.age && traineSelected.trainee.weight && (
                    <div className="cf-detail-tags">
                      {/* <span className={`cf-status-badge ${selectedAluno.status.toLowerCase()}`}> */}
                      <span className={`cf-status-badge ativo`}>
                        Ativo
                      </span>
                      <span className="cf-tag">{traineSelected.trainee.age} anos</span>
                      {lastPhysicalAssessment?.height && <span className="cf-tag">{lastPhysicalAssessment.height} m</span>}
                      {lastPhysicalAssessment?.weight && <span className="cf-tag">{lastPhysicalAssessment.weight} kg</span>}
                    </div>
                  )}
              </div>
            </div>

            <section className="cf-plan-context-strip" aria-label="Contexto do Plano e Metas">
              <div className="cf-context-block">
                <span className="cf-context-label">Objetivo</span>
                <span className="cf-context-objective">{activeTrainingPlan?.objective ?? 'Objetivo não informado'}</span>
              </div>

              <div className="cf-context-block">
                <span className="cf-context-label">Plano Atual</span>
                <span className="cf-context-value">{activeTrainingPlan?.description ?? 'Nenhum plano de treino ativo'}</span>
                <span className="cf-context-desc">{activeTrainingPlan?.goal ? `Meta: ${activeTrainingPlan.goal}` : 'Defina uma meta para este plano.'}</span>
              </div>

              <div className="cf-context-block">
                <span className="cf-context-label">Meta da Semana</span>
                <div className="cf-goal-progress-box">
                  <div className="cf-goal-progress-top">
                    <span className="cf-goal-count">
                      {traineSelected.completedTrainings ?? traineSelected.completedTrainings} de {traineSelected.totalTrainings ?? traineSelected.totalTrainings} treinos
                    </span>
                    <span className="cf-goal-pct">{displayPercentage}% concluído</span>
                  </div>
                  <div className="cf-progress-bar">
                    <div className="cf-progress-fill" style={{ width: `${displayPercentage}%` }}></div>
                  </div>
                </div>
              </div>
            </section>

            <section className="cf-eval-panel-full" aria-label="Avaliação Física do Aluno">
              <div className="cf-eval-panel-header">
                <h3>
                  <Icons.Activity /> Avaliação Física
                </h3>
                <div className="cf-eval-actions">
                  {lastPhysicalAssessment && lastPhysicalAssessment.registeredAt && (
                    <span className="cf-eval-date-tag">
                      Última avaliação: <strong>{formatRelativeTime(lastPhysicalAssessment.registeredAt ?? '')}</strong>
                    </span>
                  )}
                  {lastPhysicalAssessment && <button className="cf-btn-action cf-btn-action--secondary" type="button" onClick={() => navigate(`/personal/avaliacoes-fisicas?traineeId=${traineSelected.trainee.id}`)}>Ver histórico</button>}
                  {lastPhysicalAssessment && <button className="cf-btn-action cf-btn-action--secondary" type="button" onClick={() => openEditPhysicalAssessment(lastPhysicalAssessment)}>Editar avaliação</button>}
                  <button className="cf-btn-action" type="button" onClick={() => openPhysicalAssessment(traineSelected.trainee.age)}>
                    {lastPhysicalAssessment ? 'Nova Avaliação Física' : 'Iniciar Avaliação Física'}
                  </button>
                </div>
              </div>

              {lastPhysicalAssessment ? (
                <div className="cf-eval-layout">
                  <div className="cf-eval-data-col">
                    <div className="cf-eval-section">
                      <h4 className="cf-eval-section-title">Composição Corporal</h4>
                      <div className="cf-eval-grid">
                        {lastPhysicalAssessment.weight && (
                          <div className="cf-eval-item">
                            <span className="cf-eval-lbl">Peso</span>
                            <span className="cf-eval-val">{lastPhysicalAssessment.weight} <small>kg</small></span>
                          </div>
                        )}
                        {lastPhysicalAssessment.height && (
                          <div className="cf-eval-item">
                            <span className="cf-eval-lbl">Altura</span>
                            <span className="cf-eval-val">{lastPhysicalAssessment.height} <small>m</small></span>
                          </div>
                        )}
                        {lastPhysicalAssessment.imc && (
                          <div className="cf-eval-item">
                            <span className="cf-eval-lbl">IMC</span>
                            <span className="cf-eval-val">{lastPhysicalAssessment.imc} <small>kg/m²</small></span>
                          </div>
                        )}
                        {lastPhysicalAssessment.bodyFat && (
                          <div className="cf-eval-item">
                            <span className="cf-eval-lbl">Gordura Corp.</span>
                            <span className="cf-eval-val">{lastPhysicalAssessment.bodyFat} <small>%</small></span>
                          </div>
                        )}
                        {lastPhysicalAssessment.weight && lastPhysicalAssessment.fatMass && (
                          <div className="cf-eval-item">
                            <span className="cf-eval-lbl">Massa Gorda</span>
                            <span className="cf-eval-val">
                              {((lastPhysicalAssessment.weight * lastPhysicalAssessment.fatMass) / 100).toFixed(1)} <small>kg</small>
                            </span>
                          </div>
                        )}
                        {lastPhysicalAssessment.muscleMass ? (
                          <div className="cf-eval-item">
                            <span className="cf-eval-lbl">Massa Muscular</span>
                            <span className="cf-eval-val">{lastPhysicalAssessment.muscleMass} <small>%</small></span>
                          </div>
                        ) : (
                          lastPhysicalAssessment.weight && lastPhysicalAssessment.muscleMass && (
                            <div className="cf-eval-item">
                              <span className="cf-eval-lbl">Massa Magra</span>
                              <span className="cf-eval-val">
                                {((lastPhysicalAssessment.weight * (100 - lastPhysicalAssessment.muscleMass)) / 100).toFixed(1)} <small>kg</small>
                              </span>
                            </div>
                          )
                        )}
                        {traineSelected.trainee.age && (
                          <div className="cf-eval-item">
                            <span className="cf-eval-lbl">Idade</span>
                            <span className="cf-eval-val">{traineSelected.trainee.age} <small>anos</small></span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* {lastPhysicalAssessment && Object.keys(selectedAluno.measurements).length > 0 && ( */}
                    {lastPhysicalAssessment && (
                      <div className="cf-eval-section">
                        <h4 className="cf-eval-section-title">Medidas Corporais</h4>
                        <div className="cf-eval-grid">
                          {lastPhysicalAssessment.chest && (
                            <div className="cf-eval-item">
                              <span className="cf-eval-lbl">Peitoral</span>
                              <span className="cf-eval-val">{lastPhysicalAssessment.chest} <small>cm</small></span>
                            </div>
                          )}
                          {lastPhysicalAssessment.waist && (
                            <div className="cf-eval-item">
                              <span className="cf-eval-lbl">Cintura</span>
                              <span className="cf-eval-val">{lastPhysicalAssessment.waist} <small>cm</small></span>
                            </div>
                          )}
                          {lastPhysicalAssessment.abdomen && (
                            <div className="cf-eval-item">
                              <span className="cf-eval-lbl">Abdômen</span>
                              <span className="cf-eval-val">{lastPhysicalAssessment.abdomen} <small>cm</small></span>
                            </div>
                          )}
                          {lastPhysicalAssessment.hip && (
                            <div className="cf-eval-item">
                              <span className="cf-eval-lbl">Quadril</span>
                              <span className="cf-eval-val">{lastPhysicalAssessment.hip} <small>cm</small></span>
                            </div>
                          )}
                          {lastPhysicalAssessment.rightArm && (
                            <div className="cf-eval-item">
                              <span className="cf-eval-lbl">Braço D.</span>
                              <span className="cf-eval-val">{lastPhysicalAssessment.rightArm} <small>cm</small></span>
                            </div>
                          )}
                          {lastPhysicalAssessment.leftArm && (
                            <div className="cf-eval-item">
                              <span className="cf-eval-lbl">Braço E.</span>
                              <span className="cf-eval-val">{lastPhysicalAssessment.leftArm} <small>cm</small></span>
                            </div>
                          )}
                          {lastPhysicalAssessment.rightThigh && (
                            <div className="cf-eval-item">
                              <span className="cf-eval-lbl">Coxa D.</span>
                              <span className="cf-eval-val">{lastPhysicalAssessment.rightThigh} <small>cm</small></span>
                            </div>
                          )}
                          {lastPhysicalAssessment.leftThigh && (
                            <div className="cf-eval-item">
                              <span className="cf-eval-lbl">Coxa E.</span>
                              <span className="cf-eval-val">{lastPhysicalAssessment.leftThigh} <small>cm</small></span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {lastPhysicalAssessment && (
                      <div className="cf-eval-extra-info">
                        {lastPhysicalAssessment.activityLevel && (
                          <div className="cf-extra-item">
                            <span className="cf-extra-val">{getActivityLevel(lastPhysicalAssessment.activityLevel)}</span>
                            <span className="cf-extra-label">Nível de Atividade</span>
                          </div>
                        )}
                        {lastPhysicalAssessment.notes && (
                          <div className="cf-extra-item" style={{ gridColumn: '1 / -1' }}>
                            <span className="cf-extra-label">Observações da Avaliação</span>
                            <span className="cf-extra-val">{lastPhysicalAssessment.notes}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="cf-eval-photos-col">
                    <div className="cf-photos-header">
                      <h4>Fotos de evolução</h4>
                    </div>

                    {evolutionPhotos.length > 0 && (() => {
                      const currentPhoto = evolutionPhotos[currentPhotoIndex] || evolutionPhotos[0];
                      const isVisible = visiblePhotos[currentPhoto.key];

                      return (
                        <div className="cf-carousel-container">
                          <div className="cf-carousel-stage">
                            <button
                              type="button"
                              className={`cf-photo-toggle-btn ${!isVisible ? 'is-hidden' : ''}`}
                              onClick={() => togglePhotoVisibility(currentPhoto.key)}
                              aria-label={isVisible ? 'Ocultar foto' : 'Mostrar foto'}
                              title={isVisible ? 'Ocultar foto' : 'Mostrar foto'}
                            >
                              {isVisible ? <Icons.EyeOff /> : <Icons.Eye />}
                            </button>

                            <button
                              type="button"
                              className="cf-carousel-nav-btn prev"
                              onClick={handlePrevPhoto}
                              aria-label="Foto anterior"
                            >
                              <Icons.ChevronLeft />
                            </button>

                            <button
                              type="button"
                              className="cf-carousel-nav-btn next"
                              onClick={handleNextPhoto}
                              aria-label="Próxima foto"
                            >
                              <Icons.ChevronRight />
                            </button>

                            <div key={currentPhoto.key} className="cf-carousel-slide">
                              {isVisible && currentPhoto.image ? (
                                <img
                                  src={currentPhoto.image}
                                  alt={`Foto de evolução - ${currentPhoto.label}`}
                                  className="cf-carousel-img"
                                />
                              ) : (
                                <div className="cf-carousel-placeholder">
                                  <Icons.EyeOff />
                                  <p>{isVisible ? 'Sem foto de evolução' : 'Foto oculta'}</p>
                                  {isVisible ? <><span>Adicione uma foto para acompanhar a evolução.</span><button type="button" className="cf-btn cf-btn--ghost" onClick={() => openEditPhysicalAssessment(lastPhysicalAssessment)}>Adicionar foto</button></> : <span>Clique no ícone de olho para visualizar</span>}
                                </div>
                              )}
                            </div>

                            <div className="cf-carousel-badge">
                              {currentPhoto.label}
                            </div>
                          </div>

                          <div className="cf-carousel-controls">
                            <div className="cf-carousel-pills">
                              {evolutionPhotos.map((photo, idx) => (
                                <button
                                  key={photo.key}
                                  type="button"
                                  className={`cf-carousel-pill-btn ${idx === currentPhotoIndex ? 'active' : ''}`}
                                  onClick={() => handleSelectPhoto(idx)}
                                  aria-label={`Ir para foto ${photo.label}`}
                                >
                                  {photo.label}
                                </button>
                              ))}
                            </div>

                            <div className="cf-carousel-dots">
                              {evolutionPhotos.map((photo, idx) => (
                                <button
                                  key={photo.key}
                                  type="button"
                                  className={`cf-carousel-dot ${idx === currentPhotoIndex ? 'active' : ''}`}
                                  onClick={() => handleSelectPhoto(idx)}
                                  aria-label={`Ver foto ${idx + 1} de ${evolutionPhotos.length}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ) : (
                <div className="cf-no-eval-container">
                  <div className="cf-no-eval-icon">
                    <Icons.FileText />
                  </div>
                  <div style={{ maxWidth: '400px' }}>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: 'var(--cf-text-primary)' }}>
                      Avaliação física ainda não realizada
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--cf-text-muted)' }}>
                      Realize a primeira avaliação física deste aluno para registrar métricas corporais, dobras e fotos comparativas.
                    </p>
                  </div>
                </div>
              )}
            </section>

            <section className="cf-calendar-panel" aria-label="Planejamento Semanal de Treinos">
              <div className="cf-calendar-header-wrapper">
                <div className="cf-calendar-top-row">
                  <div className="cf-calendar-title-group">
                    <h3><Icons.Calendar /> Planejamento Semanal</h3>
                    <p className="cf-calendar-subtitle">
                      Acompanhe os treinos programados e o progresso do aluno na semana atual.
                    </p>
                  </div>

                  <div className="cf-calendar-progress-badge">
                    <span>
                      <strong>{traineSelected.completedTrainings}</strong> de <strong>{traineSelected.totalTrainings}</strong> treinos concluídos
                    </span>
                    <div className="cf-calendar-progress-mini-bar" title={`${displayPercentage}% concluído`}>
                      <div
                        className="cf-calendar-progress-mini-fill"
                        style={{ width: `${displayPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="cf-training-plan-actions">
                  {activeTrainingPlan ? (
                    <>
                      <button className="cf-btn cf-btn--ghost" type="button" onClick={() => setTrainingPlanMode('edit')}>Editar plano de treino</button>
                      <button className="cf-btn cf-btn--primary" type="button" onClick={() => setTrainingPlanMode('new')}>Criar novo plano de treino</button>
                    </>
                  ) : (
                    <button className="cf-btn cf-btn--primary" type="button" onClick={() => setTrainingPlanMode('create')}><Icons.Plus /> Adicionar plano de treino</button>
                  )}
                </div>

                <div className="cf-calendar-legend">
                  <span className="cf-legend-item">
                    <span className="cf-legend-dot concluido"></span> Concluído
                  </span>
                  <span className="cf-legend-item">
                    <span className="cf-legend-dot pendente"></span> Pendente
                  </span>
                  <span className="cf-legend-item">
                    <span className="cf-legend-dot descanso"></span> Descanso
                  </span>
                  <span className="cf-legend-item">
                    <span className="cf-legend-dot hoje"></span> Dia Atual
                  </span>
                </div>
              </div>

              <div className="cf-calendar-grid">
                {traineSelected.trainings.map((item, idx) => {
                  const isConcluido = item.status === 'COMPLETED';
                  const isPendente = item.status === 'PENDING';
                  const isDescanso = item.status === 'REST';

                  let cardStatusClass = 'status-sem-treino';
                  if (isConcluido) cardStatusClass = 'status-concluido';
                  else if (isPendente) cardStatusClass = 'status-pendente';
                  else if (isDescanso) cardStatusClass = 'status-descanso';

                  const day = getDaysOfWeek(item.day);
                  const { date } = splitDateTime(item.dateTime);
                  const { time } = splitDateTime(item.dateTime);

                  return (
                    <div
                      key={idx}
                      className={`cf-day-card ${cardStatusClass} ${item.isToday ? 'is-today' : ''}`}
                    >
                      <div className="cf-day-header">
                        <div className="cf-day-date-box">
                          <span className="cf-day-name">{day}</span>
                          <span className="cf-day-date">{date}</span>
                        </div>
                        {item.isToday && <span className="cf-today-badge">HOJE</span>}
                      </div>

                      <div className="cf-day-body">
                        {isConcluido && (
                          <>
                            <div>
                              <span className="cf-workout-badge concluido">
                                <Icons.Check /> Concluído
                              </span>
                              <div className="cf-workout-title">{item.title}</div>
                              <div className="cf-workout-focus">{item.focus}</div>
                            </div>
                            {time && (
                              <div className="cf-workout-time">
                                <Icons.Clock /> {time}
                              </div>
                            )}
                          </>
                        )}

                        {isPendente && (
                          <>
                            <div>
                              <span className="cf-workout-badge pendente">
                                <Icons.Clock /> Pendente
                              </span>
                              <div className="cf-workout-title">{item.title}</div>
                              <div className="cf-workout-focus">{item.focus}</div>
                            </div>
                            {time && (
                              <div className="cf-workout-time">
                                <Icons.Clock /> {time}
                              </div>
                            )}
                          </>
                        )}

                        {isDescanso && (
                          <div className="cf-rest-day-body">
                            <Icons.Coffee />
                            <span>Descanso</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--cf-text-muted)' }}>
                              {item.focus || 'Recuperação'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        ) : (
          <div>
            <div className="cf-alunos-actions">
              <button className="cf-btn cf-btn--primary" onClick={openCreate}>
                <Icons.Plus /> Novo Aluno
              </button>
            </div>
            <div className="cf-toolbar">
              <div className="cf-search-box">
                <Icons.Search />
                <input
                  type="text"
                  className="cf-search-input"
                  placeholder="Buscar por aluno ou objetivo..."
                  value={searchTerm}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="cf-alunos-grid">
              {filteredAlunos.map((trainee) => {
                const displayPercentage = Math.trunc(trainee.weeklyProgressPercentage ?? 0);

                return (
                  <div
                    key={trainee.id}
                    className="cf-aluno-card"
                    onClick={() => setTraineeSelectedId(trainee.id)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setTraineeSelectedId(trainee.id);
                      }
                    }}
                  >
                    <div>
                      <div className="cf-card-header">
                        <img src={trainee.avatarUrl ?? avatarDefault} alt={trainee.firstName} className="cf-avatar" />
                        <div className="cf-aluno-info">
                          <h3>{trainee.firstName} {trainee.lastName}</h3>
                          <p>{trainee.objective}</p>
                        </div>
                        {/* <span className={`cf-status-badge ${aluno.status.toLowerCase()}`}> */}
                        <span className={`cf-status-badge ativo`}>
                          {/* {aluno.status} */}
                          Ativo
                        </span>
                      </div>

                      {trainee.age && trainee.weight ? (
                        <div className="cf-card-details">
                          <div className="cf-detail-item">
                            <span className="label">Idade</span>
                            <span className="val">{trainee.age} anos</span>
                          </div>
                          <div className="cf-detail-item">
                            <span className="label">Peso</span>
                            <span className="val">{trainee.weight} kg</span>
                          </div>
                        </div>
                      ) : (
                        <div className="cf-detail-item">
                          <span className="label">Não possui avaliação física</span>
                        </div>
                      )}
                    </div>

                    <div className="cf-progress-container">
                      <div className="cf-progress-header">
                        <span>Progresso Semanal</span>
                        <strong>{displayPercentage}%</strong>
                      </div>
                      <div className="cf-progress-bar">
                        <div className="cf-progress-fill" style={{ width: `${displayPercentage}%` }}></div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
