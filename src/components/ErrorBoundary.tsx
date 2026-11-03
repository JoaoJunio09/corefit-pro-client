import { Component, type ReactNode } from "react";

export default class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <main className="cf-access-state" role="alert">
          <h1>Não foi possível abrir esta tela</h1>
          <p>Recarregue o aplicativo para tentar novamente.</p>
          <button onClick={() => window.location.reload()}>
            Recarregar aplicativo
          </button>
          <a href="/login">Voltar ao início</a>
        </main>
      );
    return this.props.children;
  }
}
