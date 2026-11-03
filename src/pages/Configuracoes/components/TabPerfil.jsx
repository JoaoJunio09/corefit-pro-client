import React from 'react';
import { Save, Upload } from 'lucide-react';

export default function TabPerfil() {
  return (
    <div className="config-section-card">
      <h3 className="config-section-title">Informações Pessoais</h3>
      <p className="config-section-desc">Atualize seus dados cadastrais e como você aparece para os alunos.</p>

      <div className="config-avatar-upload">
        <div className="avatar-preview-lg">RS</div>
        <div>
          <button className="btn-action-view" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Upload size={14} /> Alterar foto
          </button>
          <span style={{ fontSize: '11px', color: 'var(--text-sub)' }}>PNG, JPG até 5MB.</span>
        </div>
      </div>

      <div className="config-form-grid">
        <div className="form-group">
          <label>Nome Completo</label>
          <input type="text" defaultValue="Rodrigo Silva" className="form-control" />
        </div>

        <div className="form-group">
          <label>E-mail</label>
          <input type="email" defaultValue="rodrigo.trainer@email.com" className="form-control" />
        </div>

        <div className="form-group">
          <label>Telefone / WhatsApp</label>
          <input type="text" defaultValue="(11) 98888-7777" className="form-control" />
        </div>

        <div className="form-group">
          <label>CREF</label>
          <input type="text" defaultValue="123456-G/SP" className="form-control" />
        </div>

        <div className="form-group form-group-full">
          <label>Bio / Apresentação</label>
          <textarea rows="3" defaultValue="Especialista em biomecânica e hipertrofia com mais de 8 anos de experiência em consultoria presencial e online." className="form-control"></textarea>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
        <button className="btn-primary">
          <Save size={16} /> Salvar Alterações
        </button>
      </div>
    </div>
  );
}