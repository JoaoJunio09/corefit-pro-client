import {
  Eye,
  EyeOff,
  KeyRound,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import LoadFeedback from "../../../components/LoadFeedback";
import useAlunoAccountSettings from "../hooks/useAlunoAccountSettings";
import "./AlunoAccountSettings.css";

export default function AlunoAccountSettings({
  traineeId,
}: {
  traineeId: string;
}) {
  const settings = useAlunoAccountSettings(traineeId);
  return (
    <div className="cf-student-account-settings">
      <div className="cf-account-intro">
        <span>GERENCIAMENTO DO ALUNO</span>
        <h3>Configurações da conta</h3>
        <p>
          Atualize os dados de cadastro e ajude o aluno a manter o acesso ao
          sistema.
        </p>
      </div>
      <LoadFeedback
        loading={settings.loading}
        error={settings.loadError}
        retry={settings.retry}
      />
      {settings.loaded && (
        <>
          <form className="cf-trainee-panel" onSubmit={settings.saveProfile}>
            <div className="cf-account-section-heading">
              <span className="cf-account-icon">
                <UserRound size={21} />
              </span>
              <div>
                <h4>Dados pessoais e de acesso</h4>
                <p>
                  As alterações de nome também aparecem nos detalhes e nas
                  listagens do aluno.
                </p>
              </div>
            </div>
            {settings.profileMessage && (
              <p className="cf-account-success" role="status">
                {settings.profileMessage}
              </p>
            )}
            {settings.profileError && (
              <p className="cf-trainee-form-error" role="alert">
                {settings.profileError}
              </p>
            )}
            <fieldset
              className="cf-account-fields"
              disabled={settings.busy || Boolean(settings.loadError)}
            >
              <div className="cf-trainee-form-grid">
                <div className="cf-trainee-form-group">
                  <label htmlFor="account-student-first-name">Nome *</label>
                  <input
                    id="account-student-first-name"
                    value={settings.form.firstName}
                    onChange={(event) =>
                      settings.setForm({
                        ...settings.form,
                        firstName: event.target.value,
                      })
                    }
                    autoComplete="given-name"
                    maxLength={80}
                    required
                  />
                </div>
                <div className="cf-trainee-form-group">
                  <label htmlFor="account-student-last-name">Sobrenome *</label>
                  <input
                    id="account-student-last-name"
                    value={settings.form.lastName}
                    onChange={(event) =>
                      settings.setForm({
                        ...settings.form,
                        lastName: event.target.value,
                      })
                    }
                    autoComplete="family-name"
                    maxLength={80}
                    required
                  />
                </div>
                <div className="cf-trainee-form-group">
                  <label htmlFor="account-student-username">
                    Usuário de acesso *
                  </label>
                  <input
                    id="account-student-username"
                    value={settings.form.username}
                    onChange={(event) =>
                      settings.setForm({
                        ...settings.form,
                        username: event.target.value,
                      })
                    }
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    maxLength={50}
                    required
                  />
                  <small>
                    Ao alterar, informe o novo usuário ao aluno para o próximo
                    login.
                  </small>
                </div>
                <div className="cf-trainee-form-group">
                  <label htmlFor="account-student-email">E-mail *</label>
                  <input
                    id="account-student-email"
                    type="email"
                    value={settings.form.email}
                    onChange={(event) =>
                      settings.setForm({
                        ...settings.form,
                        email: event.target.value,
                      })
                    }
                    autoComplete="email"
                    maxLength={150}
                    required
                  />
                </div>
                <div className="cf-trainee-form-group cf-trainee-form-group--full">
                  <label htmlFor="account-student-recovery-email">
                    E-mail de recuperação
                  </label>
                  <input
                    id="account-student-recovery-email"
                    type="email"
                    value={settings.form.recoveryEmail}
                    onChange={(event) =>
                      settings.setForm({
                        ...settings.form,
                        recoveryEmail: event.target.value,
                      })
                    }
                    maxLength={150}
                    placeholder="Se não informado, será usado o e-mail principal"
                  />
                </div>
              </div>
              <label className="cf-account-access">
                <span>
                  <ShieldCheck size={21} />
                  <span>
                    <strong>Acesso ao sistema</strong>
                    <small>
                      {settings.form.enabled
                        ? "O aluno está habilitado para entrar no CorefitPro."
                        : "O aluno não poderá entrar enquanto o acesso estiver desabilitado."}
                    </small>
                  </span>
                </span>
                <span className="cf-account-access-control">
                  <input
                    type="checkbox"
                    checked={settings.form.enabled}
                    onChange={(event) =>
                      settings.setForm({
                        ...settings.form,
                        enabled: event.target.checked,
                      })
                    }
                  />
                  <span>Habilitado</span>
                </span>
              </label>
              <div className="cf-trainee-form-actions">
                <button
                  className="cf-btn cf-btn--ghost"
                  type="button"
                  onClick={settings.discard}
                >
                  Descartar alterações
                </button>
                <button className="cf-btn cf-btn--primary" type="submit">
                  <Save size={17} />
                  {settings.savingProfile
                    ? "Salvando…"
                    : "Salvar dados do aluno"}
                </button>
              </div>
            </fieldset>
          </form>

          <form className="cf-trainee-panel" onSubmit={settings.resetPassword}>
            <div className="cf-account-section-heading">
              <span className="cf-account-icon">
                <KeyRound size={21} />
              </span>
              <div>
                <h4>Redefinir senha</h4>
                <p>
                  Use esta opção quando o aluno solicitar ajuda para recuperar o
                  acesso.
                </p>
              </div>
            </div>
            <div className="cf-account-password-notice">
              <ShieldCheck size={19} />
              <p>
                A senha atual não é exibida. A nova senha substituirá a anterior
                e será salva de forma protegida. Alterar os dados acima não muda
                a senha.
              </p>
            </div>
            {settings.passwordMessage && (
              <p className="cf-account-success" role="status">
                {settings.passwordMessage}
              </p>
            )}
            {settings.passwordError && (
              <p className="cf-trainee-form-error" role="alert">
                {settings.passwordError}
              </p>
            )}
            <fieldset
              className="cf-account-fields"
              disabled={settings.busy || Boolean(settings.loadError)}
            >
              <div className="cf-trainee-form-grid">
                <div className="cf-trainee-form-group">
                  <label htmlFor="account-student-password">Nova senha *</label>
                  <div className="cf-account-password-field">
                    <input
                      id="account-student-password"
                      type={settings.showPasswords ? "text" : "password"}
                      value={settings.passwords.next}
                      onChange={(event) =>
                        settings.setPasswords({
                          ...settings.passwords,
                          next: event.target.value,
                        })
                      }
                      autoComplete="new-password"
                      minLength={6}
                      maxLength={128}
                      required
                      placeholder="No mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={settings.togglePasswords}
                      aria-label={
                        settings.showPasswords
                          ? "Ocultar senhas"
                          : "Mostrar senhas"
                      }
                      aria-pressed={settings.showPasswords}
                    >
                      {settings.showPasswords ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="cf-trainee-form-group">
                  <label htmlFor="account-student-confirm-password">
                    Confirmar nova senha *
                  </label>
                  <input
                    id="account-student-confirm-password"
                    type={settings.showPasswords ? "text" : "password"}
                    value={settings.passwords.confirm}
                    onChange={(event) =>
                      settings.setPasswords({
                        ...settings.passwords,
                        confirm: event.target.value,
                      })
                    }
                    autoComplete="new-password"
                    minLength={6}
                    maxLength={128}
                    required
                    placeholder="Repita a nova senha"
                  />
                </div>
              </div>
              <div className="cf-trainee-form-actions">
                <button className="cf-btn cf-btn--primary" type="submit">
                  <KeyRound size={17} />
                  {settings.resettingPassword
                    ? "Redefinindo…"
                    : "Redefinir senha do aluno"}
                </button>
              </div>
            </fieldset>
          </form>
        </>
      )}
    </div>
  );
}
