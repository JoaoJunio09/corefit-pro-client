import {
  ArrowUpRight,
  Check,
  Dumbbell,
  Eye,
  EyeOff,
  ArrowRight,
  LockKeyhole,
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { accountHome, useAuthContext } from "../../context/AuthContext";
import useLogin from "./hooks/useLogin";
import "./Login.css";

export default function LoginPage() {
  const { auth } = useAuthContext();
  const {
    form,
    handleOnChange,
    submit,
    loading,
    error,
    showPassword,
    togglePassword,
  } = useLogin();
  if (auth) return <Navigate to={accountHome(auth.roles)} replace />;

  return (
    <main className="cf-login">
      <section className="cf-login-story" aria-label="CorefitPro">
        <a href="/login" className="cf-login-brand">
          <span className="cf-brand-mark">
            <Dumbbell size={24} />
          </span>
          corefit<span>pro</span>
          <i />
        </a>
        <div className="cf-login-editorial">
          <span className="cf-login-overline">MOVIMENTO COM DIREÇÃO</span>
          <h1>
            O próximo nível
            <br />
            começa com
            <br />
            <em>constância.</em>
            <ArrowUpRight aria-hidden="true" />
          </h1>
          <p>
            Planeje com intenção. Treine com clareza.
            <br />
            Evolua um dia de cada vez.
          </p>
        </div>
        <div className="cf-login-preview" aria-hidden="true">
          <div className="cf-preview-top">
            <span>SUA SEMANA, EM MOVIMENTO</span>
            <span>03 / 04</span>
          </div>
          <div className="cf-preview-days">
            {["S", "T", "Q", "Q", "S", "S", "D"].map((day, index) => (
              <div
                key={index}
                className={index < 3 ? "is-done" : index === 4 ? "is-next" : ""}
              >
                <span>{day}</span>
                {index < 3 ? <Check size={17} /> : <i />}
              </div>
            ))}
          </div>
          <div className="cf-preview-bottom">
            <span>
              <i /> Cada treino conta.
            </span>
            <Dumbbell size={18} />
          </div>
        </div>
        <footer className="cf-login-story-footer">
          <span>FEITO PARA EVOLUIR.</span>
          <span>PERSONAL + ALUNO</span>
        </footer>
      </section>
      <section className="cf-login-entry">
        <div className="cf-login-entry-top">
          <span>SEU ESPAÇO DE EVOLUÇÃO</span>
          <LockKeyhole size={17} />
        </div>
        <div className="cf-login-form-wrap">
          <span className="cf-login-kicker">BOM TER VOCÊ AQUI</span>
          <h2>
            Vamos ao
            <br />
            próximo passo.
          </h2>
          <p>Entre na sua conta e continue de onde parou.</p>
          <form className="cf-login-form" onSubmit={submit}>
            <label htmlFor="username">
              Seu usuário
              <input
                id="username"
                name="username"
                autoComplete="username"
                value={form.username}
                onChange={handleOnChange}
                placeholder="Como você se conecta"
                required
                disabled={loading}
                autoCapitalize="none"
                spellCheck={false}
              />
            </label>
            <label htmlFor="password">
              Sua senha
              <div className="cf-login-password">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleOnChange}
                  placeholder="Digite sua senha"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={showPassword}
                  onClick={togglePassword}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </label>
            {error && (
              <p className="cf-login-error" role="alert">
                {error}
              </p>
            )}
            <button
              className="cf-login-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Entrando…" : "Entrar no meu espaço"}
              <ArrowRight size={20} />
            </button>
          </form>
          <div className="cf-login-note">
            <span>UM ACESSO. SEU PERFIL.</span>
            <p>
              Aluno ou personal: use suas credenciais. Seu espaço é identificado
              automaticamente.
            </p>
          </div>
        </div>
        <footer className="cf-login-entry-footer">
          CorefitPro <span>Planejamento que vira evolução.</span>
        </footer>
      </section>
    </main>
  );
}
