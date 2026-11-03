import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// Importando todas as páginas do sistema
import { AuthProvider } from "./context/AuthContext";
import { PersonalTrainerProvider } from "./context/PersonalTrainerContext";
import { ThemeProvider } from "./context/ThemeContext";
import AlunosPage from "./pages/Alunos/AlunosPage";
import HistoricoAvaliacoesPage from "./pages/AvaliacoesFisicas/HistoricoAvaliacoesPage";
import Configuracoes from "./pages/Configuracoes/Configuracoes";
import Dashboard from "./pages/Dashboard/Dashboard";
import Exercicios from "./pages/Exercicios/Exercicios";
import LoginPage from "./pages/Login/Login";
import MaisPage from "./pages/Mais/MaisPage";
import Treinamentos from "./pages/Treinamentos/Treinamentos";
import ProtectedRoute from './components/ProtectedRoute';
import AlunoPortal from './pages/AlunoPortal/AlunoPortal';

// Estilos globais

import "./styles/dark.css";
import "./styles/globals.css";
import "./styles/light.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PersonalTrainerProvider>
          <ThemeProvider>
            <Routes>  
              {/* 0. Página inicial de Login (ambiente de testes) */}
              <Route path="/login" element={<LoginPage />} />

              {/* 1. Redireciona a raiz "/" para a Dashboard principal */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* 2. Área do Personal Trainer com o Layout e Sidebar Fixa */}
              <Route element={<ProtectedRoute area="aluno" />}>
                <Route path="/aluno" element={<AlunoPortal />} />
                <Route path="/aluno/treinos/:itemId" element={<AlunoPortal />} />
              </Route>
              <Route path="/personal" element={<ProtectedRoute area="personal" />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="alunos" element={<AlunosPage />} />
                <Route path="avaliacoes-fisicas" element={<HistoricoAvaliacoesPage />} />
                <Route path="mais" element={<MaisPage />} />
                <Route path="treinos" element={<Treinamentos />} />
                <Route path="exercicios" element={<Exercicios />} />
                <Route path="configuracoes" element={<Configuracoes />} />
              </Route>

              {/* 3. Fallback para qualquer rota inexistente */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </ThemeProvider>
        </PersonalTrainerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
