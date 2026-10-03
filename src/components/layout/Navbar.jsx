import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, LogOut, Settings, LayoutDashboard, MessageSquareHeart } from "lucide-react";
import { norteens } from "@/api/norteensClient";
import { MARCOS, calcularNivel } from "@/utils/progresso";
import { PAPEIS, isEquipe } from "@/utils/papeis";
import UserAvatar from "@/components/UserAvatar";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sair = () => {
  norteens.logout();
  window.location.href = "/";
};

export default function Navbar({ user }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const nivel = calcularNivel(user);
  const equipe = isEquipe(user);
  const nome = user?.nome || user?.apelido || user?.email;

  const links = [
    { to: "/", label: "Início" },
    { to: "/profissoes", label: "Profissões" },
    { to: "/famosos", label: "Famosos" },
    { to: "/comunidade", label: "Comunidade" },
  ];
  if (user) {
    links.push(user.teste_feito ? { to: "/resultado", label: "Meu resultado" } : { to: "/teste", label: "Teste" });
  }

  const linkDesktop = ({ isActive }) =>
    `relative px-3 py-2 text-sm font-medium rounded-full transition-colors ${
      isActive ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <nav
      className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border/80 select-none"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-16 gap-6">
          <Logo />

          {/* links (desktop) */}
          <div className="hidden lg:flex items-center gap-1 flex-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === "/"} className={linkDesktop}>
                {l.label}
              </NavLink>
            ))}
          </div>
          <div className="flex-1 lg:hidden" />

          <div className="flex items-center gap-2">
            {!user ? (
              <>
                <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Criar conta</Link>
                </Button>
              </>
            ) : (
              <>
                {equipe && (
                  <Button variant="outline" size="sm" asChild className="hidden md:inline-flex">
                    <Link to="/painel">
                      <LayoutDashboard /> Painel
                    </Link>
                  </Button>
                )}

                {!equipe && (
                  <Link
                    to="/"
                    title="Sua jornada de exploração"
                    className="hidden md:flex items-center gap-2.5 h-8 px-3 rounded-full border border-border bg-card hover:bg-muted transition-colors"
                  >
                    <span className="text-xs font-medium text-muted-foreground">
                      Jornada {nivel}/{MARCOS.length}
                    </span>
                    <span className="w-14 h-1.5 rounded-full bg-muted overflow-hidden">
                      <span
                        className="block h-full rounded-full bg-accent transition-all"
                        style={{ width: `${(nivel / MARCOS.length) * 100}%` }}
                      />
                    </span>
                  </Link>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="rounded-full ring-offset-2 ring-offset-background hover:ring-2 hover:ring-border focus-visible:ring-2 focus-visible:ring-ring transition-all"
                      aria-label="Menu da conta"
                    >
                      <UserAvatar user={user} size="md" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-60">
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
                        <Link to="/painel" className="cursor-pointer">
                          <LayoutDashboard className="w-4 h-4" /> Painel da equipe
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link to="/configuracoes" className="cursor-pointer">
                        <Settings className="w-4 h-4" /> Configurações
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/feedback" className="cursor-pointer">
                        <MessageSquareHeart className="w-4 h-4" /> Deixar feedback
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={sair} className="text-destructive focus:text-destructive cursor-pointer">
                      <LogOut className="w-4 h-4" /> Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            <button
              onClick={() => setOpen(true)}
              className="lg:hidden p-2 -mr-2 rounded-full text-foreground hover:bg-muted transition-colors"
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* menu lateral (celular e tablet) */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-72 sm:max-w-xs flex flex-col p-0">
          <SheetHeader className="px-5 h-16 border-b border-border flex-row items-center space-y-0">
            <SheetTitle className="text-base">Menu</SheetTitle>
          </SheetHeader>

          {user && (
            <div className="px-5 py-4 border-b border-border flex items-center gap-3">
              <UserAvatar user={user} size="lg" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{nome}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                {equipe && <div className="mt-1.5"><PapelBadge papel={user.papel} /></div>}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
            {[
              ...links,
              ...(equipe ? [{ to: "/painel", label: "Painel da equipe" }] : []),
              ...(user
                ? [
                    { to: "/feedback", label: "Deixar feedback" },
                    { to: "/configuracoes", label: "Configurações" },
                  ]
                : []),
            ].map((l) => {
              const ativo = l.to === "/" ? location.pathname === "/" : location.pathname.startsWith(l.to);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-[15px] font-medium transition-colors ${
                    ativo ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          <div className="px-3 py-3 border-t border-border">
            {user ? (
              <button
                onClick={sair}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sair
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" asChild onClick={() => setOpen(false)}>
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button asChild onClick={() => setOpen(false)}>
                  <Link to="/register">Criar conta</Link>
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}

export function PapelBadge({ papel, escuro = false }) {
  const estilo = escuro
    ? papel === "admin" ? "bg-accent text-white" : "bg-highlight text-[#0f2e26]"
    : papel === "admin" ? "bg-accent/15 text-accent" : "bg-secondary/15 text-secondary";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${estilo}`}>
      {PAPEIS[papel]?.label || papel}
    </span>
  );
}
