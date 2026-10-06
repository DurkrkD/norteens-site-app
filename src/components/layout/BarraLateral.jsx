import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import {
  Search, Route, LayoutDashboard, Sun, Moon, PanelLeftClose, PanelLeftOpen,
  Settings, MessageSquareHeart, LogOut, LogIn, UserPlus,
} from "lucide-react";
import { norteens } from "@/api/norteensClient";
import { MARCOS, calcularNivel } from "@/utils/progresso";
import { isEquipe } from "@/utils/papeis";
import { LogoMark } from "@/components/Logo";
import { PapelBadge } from "@/components/layout/Navbar";
import { destinosPrincipais, estaAtivo } from "@/components/layout/navegacao";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const LARGURA_BARRA = { fechada: 72, aberta: 248 };

const sair = () => {
  norteens.logout();
  window.location.href = "/";
};

// Barra lateral fixa no estilo do Opera GX: trilho escuro de ícones, indicador aceso no item atual,
// dicas ao passar o mouse, pode ser expandida (mostra os nomes) e abre "painéis rápidos" por cima da página.
export default function BarraLateral({ user, expandida, onAlternar, painel, onPainel }) {
  const { pathname } = useLocation();
  const { resolvedTheme, setTheme } = useTheme();
  const equipe = isEquipe(user);
  const nivel = calcularNivel(user);
  const escuro = resolvedTheme === "dark";
  const atalho = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘K" : "Ctrl K";

  const alternarPainel = (nome) => onPainel(painel === nome ? null : nome);

  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <aside
        aria-label="Navegação principal"
        className="hidden md:flex fixed inset-y-0 left-0 z-40 flex-col bg-[#0f2e26] text-[#f8f0e6] border-r border-white/[0.06] transition-[width] duration-300 ease-out overflow-hidden select-none"
        style={{ width: expandida ? LARGURA_BARRA.aberta : LARGURA_BARRA.fechada }}
      >
        {/* marca */}
        <Link to="/" className="flex items-center h-[72px] shrink-0 px-[20px] gap-3" aria-label="Norteens — início">
          <LogoMark inverted className="w-8 h-8" />
          <span className={`font-heading font-semibold text-lg tracking-tight whitespace-nowrap transition-opacity duration-200 ${expandida ? "opacity-100" : "opacity-0"}`}>
            Norteens
          </span>
        </Link>

        {/* busca */}
        <div className="px-3 pb-3">
          <Dica rotulo={`Buscar (${atalho})`} ativa={!expandida}>
            <button
              onClick={() => alternarPainel("busca")}
              aria-label="Buscar profissões e famosos"
              aria-expanded={painel === "busca"}
              className={`flex items-center w-full h-11 rounded-xl border transition-colors ${
                painel === "busca"
                  ? "bg-white/[0.12] border-white/20 text-white"
                  : "bg-white/[0.05] border-white/[0.08] text-[#f8f0e6]/60 hover:text-white hover:bg-white/[0.09]"
              }`}
            >
              <span className="w-12 flex justify-center shrink-0"><Search className="w-[18px] h-[18px]" /></span>
              <span className={`flex-1 text-left text-sm whitespace-nowrap transition-opacity duration-200 ${expandida ? "opacity-100" : "opacity-0"}`}>Buscar...</span>
              <kbd className={`mr-2.5 px-1.5 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-[#f8f0e6]/60 whitespace-nowrap transition-opacity duration-200 ${expandida ? "opacity-100" : "opacity-0"}`}>
                {atalho}
              </kbd>
            </button>
          </Dica>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-1 space-y-1 [scrollbar-width:none]">
          {destinosPrincipais(user).map((d) => (
            <Item key={d.to} {...d} ativo={estaAtivo(pathname, d)} expandida={expandida} selo={d.novo ? "Novo" : undefined} />
          ))}

          <Divisoria expandida={expandida} titulo={equipe ? "Equipe" : "Atalhos"} />

          {equipe ? (
            <Item to="/painel" label="Painel da equipe" icon={LayoutDashboard} ativo={pathname.startsWith("/painel")} expandida={expandida} />
          ) : (
            <Item
              label="Minha jornada"
              icon={Route}
              onClick={() => alternarPainel("jornada")}
              ativo={painel === "jornada"}
              expandida={expandida}
              selo={user && nivel < MARCOS.length ? `${nivel}/${MARCOS.length}` : undefined}
            />
          )}
        </nav>

        {/* rodapé da barra: tema, recolher e conta */}
        <div className="shrink-0 border-t border-white/[0.07] py-3 space-y-1">
          <Item
            label={escuro ? "Tema claro" : "Tema escuro"}
            icon={escuro ? Sun : Moon}
            onClick={() => setTheme(escuro ? "light" : "dark")}
            expandida={expandida}
          />
          {user && (
            <Item to="/configuracoes" label="Configurações" icon={Settings} ativo={pathname.startsWith("/configuracoes")} expandida={expandida} />
          )}
          <Item
            label={expandida ? "Recolher barra" : "Expandir barra"}
            icon={expandida ? PanelLeftClose : PanelLeftOpen}
            onClick={onAlternar}
            expandida={expandida}
          />

          <div className="px-3 pt-2">
            {user ? (
              <Conta user={user} expandida={expandida} equipe={equipe} />
            ) : expandida ? (
              <div className="grid gap-2">
                <Link to="/register" className="flex items-center justify-center gap-2 h-10 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors whitespace-nowrap">
                  <UserPlus className="w-4 h-4" /> Criar conta
                </Link>
                <Link to="/login" className="flex items-center justify-center gap-2 h-10 rounded-xl bg-white/[0.07] text-sm font-semibold hover:bg-white/[0.12] transition-colors whitespace-nowrap">
                  <LogIn className="w-4 h-4" /> Entrar
                </Link>
              </div>
            ) : (
              <div className="grid gap-2">
                <Dica rotulo="Criar conta">
                  <Link to="/register" aria-label="Criar conta" className="flex items-center justify-center h-11 rounded-xl bg-accent text-white hover:bg-accent/90 transition-colors">
                    <UserPlus className="w-[18px] h-[18px]" />
                  </Link>
                </Dica>
                <Dica rotulo="Entrar">
                  <Link to="/login" aria-label="Entrar" className="flex items-center justify-center h-11 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] transition-colors">
                    <LogIn className="w-[18px] h-[18px]" />
                  </Link>
                </Dica>
              </div>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}

// dica ao lado do ícone (só faz sentido com a barra recolhida, quando o nome não aparece)
function Dica({ rotulo, ativa = true, children }) {
  if (!ativa) return children;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={14} className="bg-[#0b221c] text-[#f8f0e6] border border-white/10 font-medium shadow-elevated">
        {rotulo}
      </TooltipContent>
    </Tooltip>
  );
}

function Item({ to, label, icon: Icone, ativo = false, expandida, onClick, selo }) {
  const classe = `relative flex items-center h-11 mx-3 rounded-xl text-left transition-colors ${
    ativo ? "bg-white/[0.11] text-white" : "text-[#f8f0e6]/60 hover:text-white hover:bg-white/[0.06]"
  }`;
  const conteudo = (
    <>
      <span className="relative w-12 flex justify-center shrink-0">
        <Icone className="w-5 h-5" strokeWidth={ativo ? 2.2 : 1.9} />
        {/* com a barra recolhida, o selo vira um pontinho no ícone */}
        {selo && !expandida && <span className="absolute -top-1 right-2.5 w-2 h-2 rounded-full bg-highlight ring-2 ring-[#0f2e26]" />}
      </span>
      <span className={`flex-1 text-sm font-medium whitespace-nowrap transition-opacity duration-200 ${expandida ? "opacity-100" : "opacity-0"}`}>
        {label}
      </span>
      {selo && expandida && (
        <span className="mr-3 px-1.5 py-0.5 rounded-md bg-highlight/20 text-highlight text-[11px] font-semibold tabular-nums">{selo}</span>
      )}
    </>
  );

  return (
    <div className="relative">
      {/* indicador aceso na borda, como no Opera GX (acompanha a cor de destaque do usuário) */}
      <span
        aria-hidden
        className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full bg-accent transition-all duration-300 ${
          ativo ? "h-6 opacity-100 shadow-[0_0_14px_2px_hsl(var(--accent)/0.65)]" : "h-2 opacity-0"
        }`}
      />
      <Dica rotulo={label} ativa={!expandida}>
        {to ? (
          <Link to={to} aria-label={label} aria-current={ativo ? "page" : undefined} className={classe}>
            {conteudo}
          </Link>
        ) : (
          <button type="button" onClick={onClick} aria-label={label} aria-pressed={ativo || undefined} className={`${classe} w-[calc(100%-1.5rem)]`}>
            {conteudo}
          </button>
        )}
      </Dica>
    </div>
  );
}

function Divisoria({ expandida, titulo }) {
  return (
    <div className="px-3 pt-4 pb-2 h-9 flex items-center">
      {expandida ? (
        <p className="px-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#f8f0e6]/40 whitespace-nowrap">{titulo}</p>
      ) : (
        <span className="block mx-auto w-6 h-px bg-white/15" />
      )}
    </div>
  );
}

function Conta({ user, expandida, equipe }) {
  const nome = user.nome || user.apelido || user.email;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Menu da conta"
          className="flex items-center w-full h-12 rounded-xl hover:bg-white/[0.06] transition-colors text-left"
        >
          <span className="w-12 flex justify-center shrink-0">
            {/* o avatar padrão usa a cor primária (verde-escuro), que some sobre a barra: aqui vai em destaque */}
            {user.foto_url ? (
              <img src={user.foto_url} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-white/15" />
            ) : (
              <span className="w-9 h-9 rounded-full bg-accent text-white text-sm font-semibold flex items-center justify-center ring-2 ring-white/15">
                {nome.charAt(0).toUpperCase()}
              </span>
            )}
          </span>
          <span className={`min-w-0 flex-1 pr-2 transition-opacity duration-200 ${expandida ? "opacity-100" : "opacity-0"}`}>
            <span className="block text-sm font-semibold truncate">{nome}</span>
            <span className="block text-xs text-[#f8f0e6]/50 truncate">{user.email}</span>
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" sideOffset={14} className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground truncate">{nome}</p>
            {equipe && <PapelBadge papel={user.papel} />}
          </div>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {equipe && (
          <DropdownMenuItem asChild>
            <Link to="/painel" className="cursor-pointer"><LayoutDashboard className="w-4 h-4" /> Painel da equipe</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link to="/configuracoes" className="cursor-pointer"><Settings className="w-4 h-4" /> Configurações</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/feedback" className="cursor-pointer"><MessageSquareHeart className="w-4 h-4" /> Deixar feedback</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={sair} className="text-destructive focus:text-destructive cursor-pointer">
          <LogOut className="w-4 h-4" /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
