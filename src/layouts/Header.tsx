import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, Moon, Sun, LogOut } from 'lucide-react';
import { useThemeContext } from '../context/ThemeContext';
import { useAuthContext } from '../context/AuthContext';
import './Header.css';

export type HeaderActiveRoute = 'dashboard' | 'alunos' | 'treinamentos' | 'exercicios' | 'mais';
const LINKS: { path: string; label: string; key: HeaderActiveRoute }[] = [
  { path: '/personal/dashboard', label: 'Dashboard', key: 'dashboard' },
  { path: '/personal/alunos', label: 'Alunos', key: 'alunos' },
  { path: '/personal/treinos', label: 'Treinamentos', key: 'treinamentos' },
  { path: '/personal/exercicios', label: 'Exercícios', key: 'exercicios' },
  { path: '/personal/mais', label: 'Mais', key: 'mais' }
];

export function Header({ active }: { active?: HeaderActiveRoute }) {
  const { theme, setTheme } = useThemeContext();
  const { fullName, username, logout } = useAuthContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const name = fullName || username || 'Minha conta';
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  const links = LINKS.map(link => <Link key={link.key} to={link.path} aria-current={active === link.key ? 'page' : undefined}
    className={`corefit-header__nav-item ${active === link.key ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>{link.label}</Link>);
  return <header className="corefit-header">
    <div className="corefit-header__inner">
      <Link to="/personal/dashboard" className="corefit-header__brand">CoreFit<span style={{ fontWeight: 400 }}>Pro</span><div className="corefit-header__brand-dot" /></Link>
      <nav className="corefit-header__nav" aria-label="Menu principal">{links}</nav>
      <div className="corefit-header__actions">
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="cf-btn-icon" aria-label="Alternar tema">{theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}</button>
        <Link to="/personal/configuracoes" className="corefit-header__profile" aria-label="Minha conta">
          <div className="cf-avatar">{initials}</div><div className="corefit-header__profile-info"><span className="corefit-header__profile-name">{name}</span><span className="corefit-header__profile-role">PERSONAL TRAINER</span></div>
        </Link>
        <button className="cf-btn-icon" onClick={logout} aria-label="Sair da conta" title="Sair"><LogOut size={18} /></button>
        <button className="corefit-header__mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Abrir menu" aria-expanded={mobileOpen} aria-controls="mobile-nav">{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
    </div>
    <nav id="mobile-nav" aria-label="Menu móvel" className={`corefit-header__mobile-nav ${mobileOpen ? 'is-open' : ''}`}>{links}</nav>
  </header>;
}
