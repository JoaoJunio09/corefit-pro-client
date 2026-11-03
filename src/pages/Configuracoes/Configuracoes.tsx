import { Save, ShieldCheck, UserRound, Palette, LogOut } from "lucide-react";
import { Header } from "../../layouts/Header";
import { useThemeContext } from "../../context/ThemeContext";
import useConfiguracoes from "./hooks/useConfiguracoes";
import "./Configuracoes.css";

export default function Configuracoes() {
  const page = useConfiguracoes();
  const { theme, setTheme } = useThemeContext();
  return (
    <div className="cf-app-wrapper">
      <div className="cf-container cf-settings">
        <Header active="mais" />
        <div className="cf-settings-heading">
          <span>DO SEU JEITO</span>
          <h1>Minha conta</h1>
          <p>Seus dados, sua segurança e suas preferências de visualização.</p>
        </div>
        <nav className="cf-settings-tabs" aria-label="Seções da conta">
          {[
            ["perfil", "Dados da conta", UserRound],
            ["seguranca", "Segurança", ShieldCheck],
            ["aparencia", "Aparência", Palette],
          ].map(([key, label, Icon]) => (
            <button
              key={key as string}
              className={page.tab === key ? "active" : ""}
              onClick={() => page.setTab(key as string)}
              type="button"
            >
              {typeof Icon !== "string" && <Icon size={17} />}
              {label as string}
            </button>
          ))}
        </nav>
        <section className="cf-settings-panel">
          {page.loading ? (
            <p role="status">Carregando sua conta…</p>
          ) : (
            <>
              {page.message && (
                <p className="cf-settings-message" role="status">
                  {page.message}
                </p>
              )}
              {page.error && (
                <p className="cf-settings-error" role="alert">
                  {page.error}
                  <button onClick={page.retry} type="button">
                    Atualizar dados
                  </button>
                </p>
              )}
              {page.tab === "aparencia" ? (
                <>
                  <h2>Um espaço com a sua cara</h2>
                  <p>O tema escolhido será mantido neste dispositivo.</p>
                  <div className="cf-settings-theme">
                    {(["dark", "light"] as const).map((value) => (
                      <button
                        key={value}
                        onClick={() => setTheme(value)}
                        className={theme === value ? "active" : ""}
                        aria-pressed={theme === value}
                      >
                        <span className={`cf-theme-swatch ${value}`} />
                        {value === "dark" ? "Escuro" : "Claro"}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <form onSubmit={page.submit}>
                  <h2>
                    {page.tab === "perfil"
                      ? "Dados da sua conta"
                      : "Altere sua senha"}
                  </h2>
                  <p>
                    {page.tab === "perfil"
                      ? "Mantenha seus dados de acesso e contato atualizados."
                      : "Use pelo menos 6 caracteres e escolha uma senha diferente do seu usuário."}
                  </p>
                  <fieldset disabled={page.saving} className="cf-settings-grid">
                    {page.tab === "perfil" ? (
                      <>
                        <label>
                          Usuário
                          <input
                            value={page.profile.username}
                            readOnly
                            autoComplete="username"
                          />
                          <small>
                            O usuário de acesso não pode ser alterado aqui.
                          </small>
                        </label>
                        <label>
                          Nome de exibição
                          <input
                            value={page.profile.fullName ?? ""}
                            maxLength={255}
                            required
                            onChange={(event) =>
                              page.setProfile({
                                ...page.profile,
                                fullName: event.target.value,
                              })
                            }
                            autoComplete="name"
                          />
                        </label>
                        <label>
                          E-mail
                          <input
                            type="email"
                            value={page.profile.email ?? ""}
                            maxLength={255}
                            required
                            onChange={(event) =>
                              page.setProfile({
                                ...page.profile,
                                email: event.target.value,
                              })
                            }
                            autoComplete="email"
                          />
                        </label>
                        <label>
                          E-mail de recuperação
                          <input
                            type="email"
                            value={page.profile.recoveryEmail ?? ""}
                            maxLength={255}
                            onChange={(event) =>
                              page.setProfile({
                                ...page.profile,
                                recoveryEmail: event.target.value,
                              })
                            }
                          />
                        </label>
                      </>
                    ) : (
                      <>
                        <label>
                          Senha atual
                          <input
                            type="password"
                            autoComplete="current-password"
                            value={page.passwords.current}
                            required
                            onChange={(event) =>
                              page.setPasswords({
                                ...page.passwords,
                                current: event.target.value,
                              })
                            }
                          />
                        </label>
                        <label>
                          Nova senha
                          <input
                            type="password"
                            autoComplete="new-password"
                            minLength={6}
                            maxLength={128}
                            value={page.passwords.next}
                            required
                            onChange={(event) =>
                              page.setPasswords({
                                ...page.passwords,
                                next: event.target.value,
                              })
                            }
                          />
                        </label>
                        <label>
                          Confirme a nova senha
                          <input
                            type="password"
                            autoComplete="new-password"
                            minLength={6}
                            maxLength={128}
                            value={page.passwords.confirm}
                            required
                            onChange={(event) =>
                              page.setPasswords({
                                ...page.passwords,
                                confirm: event.target.value,
                              })
                            }
                          />
                        </label>
                      </>
                    )}
                  </fieldset>
                  <button
                    type="submit"
                    className="cf-btn cf-btn--primary"
                    disabled={page.saving}
                  >
                    <Save size={16} />
                    {page.saving ? "Salvando…" : "Salvar alterações"}
                  </button>
                </form>
              )}
            </>
          )}
        </section>
        <button className="cf-settings-logout" onClick={page.logout}>
          <LogOut size={17} />
          Sair da conta
        </button>
      </div>
    </div>
  );
}
