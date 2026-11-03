import { Link } from 'react-router-dom';
import { Header } from '../../layouts/Header';
import './MaisPage.css';

const IconActivity = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h4l3-9 4 18 3-9h4"/></svg>;

export default function MaisPage() {
  return <div className="cf-app-wrapper"><div className="cf-container cf-more-page">
    <Header active="mais" />
    <div className="cf-more-heading"><span>RECURSOS EXTRAS</span><h1 className="cf-h1">Mais opções</h1><p className="cf-text-body">Acesse ferramentas complementares para o acompanhamento dos seus alunos.</p></div>
    <section className="cf-more-grid">
      <Link className="cf-more-card" to="/personal/avaliacoes-fisicas"><div className="cf-more-icon"><IconActivity /></div><div><h2>Histórico de avaliações físicas</h2><p>Consulte e acompanhe todas as avaliações registradas.</p></div><span>→</span></Link>
      <Link className="cf-more-card" to="/personal/configuracoes"><div className="cf-more-icon">⚙</div><div><h2>Minha conta e preferências</h2><p>Atualize seus dados, altere a senha e escolha o tema do aplicativo.</p></div><span>→</span></Link>
    </section>
  </div></div>;
}
