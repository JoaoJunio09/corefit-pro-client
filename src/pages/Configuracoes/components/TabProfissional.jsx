import React from 'react';
import { Save } from 'lucide-react';

export default function TabProfissional() {
  return (
    <div className="config-section-card">
      <h3 className="config-section-title">Configurações Profissionais</h3>
      <p className="config-section-desc">Defina padrões da sua consultoria que alimentam automaticamente o sistema e a agenda.</p>

      <div className="config-form-grid">
        <div className="form-group">
          <label>Nome Comercial / Marca</label>
          <input type="text" defaultValue="Rodrigo Silva Coaching" className="form-control" />
        </div>

        <div className="form-group">
          <label>Local de Atendimento Principal</label>
          <input type="text" defaultValue="Academia Central & Online" className="form-control" />
        </div>

        <div className="form-group">
          <label>Duração Padrão dos Treinos / Consultas (min)</label>
          <select className="form-control" defaultValue="60">
            <option value="30">30 minutos</option>
            <option value="45">45 minutos</option>
            <option value="60">60 minutos</option>
            <option value="90">90 minutos</option>
          </select>
        </div>

        <div className="form-group">
          <label>Intervalo entre Atendimentos (min)</label>
          <select className="form-control" defaultValue="10">
            <option value="0">Sem intervalo</option>
            <option value="5">5 minutos</option>
            <option value="10">10 minutos</option>
            <option value="15">15 minutos</option>
          </select>
        </div>

        <div className="form-group form-group-full">
          <label>Especialidades (separadas por vírgula)</label>
          <input type="text" defaultValue="Hipertrofia, Emagrecimento, Biomecânica, Treinamento Funcional" className="form-control" />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
        <button className="btn-primary">
          <Save size={16} /> Salvar Parâmetros
        </button>
      </div>
    </div>
  );
}