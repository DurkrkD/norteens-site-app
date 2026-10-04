import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { ThemeProvider } from "next-themes";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import ScrollToTop from "./components/ScrollToTop";

// Auth pages
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

// App pages
import AppLayout from "@/components/layout/AppLayout";
import Home from "@/pages/Home";
import Profissoes from "@/pages/Profissoes";
import ProfissaoDetalhe from "@/pages/ProfissaoDetalhe";
import Famosos from "@/pages/Famosos";
import Teste from "@/pages/Teste";
import Resultado from "@/pages/Resultado";
import Comunidade from "@/pages/Comunidade";
import Configuracoes from "@/pages/Configuracoes";
import Feedback from "@/pages/Feedback";
import Painel from "@/pages/Painel";

// A animação de troca de página fica dentro do AppLayout (só no conteúdo): se envolvesse o layout
// inteiro, a barra lateral fixa piscaria e recarregaria o usuário a cada clique.
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Public + authenticated routes share the layout */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/profissoes" element={<Profissoes />} />
        <Route path="/profissoes/:id" element={<ProfissaoDetalhe />} />
        <Route path="/famosos" element={<Famosos />} />
        <Route path="/comunidade" element={<Comunidade />} />
        <Route path="/teste" element={<Teste />} />
        <Route path="/resultado" element={<Resultado />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/painel" element={<Painel />} />
        <Route path="/painel/:secao" element={<Painel />} />
        {/* endereço antigo da lista de feedbacks */}
        <Route path="/feedbacks-recebidos" element={<Navigate to="/painel/feedbacks" replace />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

const AuthenticatedApp = () => {
  const { isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return <AppRoutes />;
};

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <ScrollToTop />
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;