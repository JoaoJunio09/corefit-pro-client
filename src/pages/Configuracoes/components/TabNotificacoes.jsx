import React from 'react';

export default function TabNotificacoes() {
  return (
    <div className="config-section-card">
      <h3 className="config-section-title">Notificações do Sistema</h3>
      <p className="config-section-desc">Escolha quais avisos você deseja receber no aplicativo ou por e-mail.</p>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="notification-option-row">
          <div className="notification-info">
            <h4>Novo Agendamento</h4>
            <p>Receber alerta quando um aluno marcar um horário na agenda.</p>
          </div>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>
        </div>

        <div className="notification-option-row">
          <div className="notification-info">
            <h4>Cancelamento de Atendimento</h4>
            <p>Aviso imediato se um compromisso for cancelado.</p>
          </div>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>
        </div>

        <div className="notification-option-row">
          <div className="notification-info">
            <h4>Avaliação Pendente</h4>
            <p>Lembrete quando a ficha de evolução de um aluno estiver vencendo.</p>
          </div>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>
        </div>

        <div className="notification-option-row">
          <div className="notification-info">
            <h4>Atualização de Treino pelo Aluno</h4>
            <p>Notificar quando o aluno concluir ciclos na plataforma.</p>
          </div>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
}