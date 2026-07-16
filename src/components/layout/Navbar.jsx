import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, LogOut, Search, User, Settings } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { todosConcluidos, calcularNivel } from "@/utils/progresso";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Logo = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6 shrink-0">
    <circle cx="16" cy="16" r="14.5" stroke="var(--primary)" strokeWidth="2" />
    <path d="M16 5 L19.5 16 L16 27 L12.5 16 Z" fill="var(--primary)" />
    <path d="M5 16 L16 12.5 L27 16 L16 19.5 Z" fill="var(--accent)" />
    <circle cx="16" cy="16" r="2.4" fill="var(--background)" />
  </svg>
);

export default function Navbar({ user }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const nivel = calcularNivel(user);
  const totalNiveis = 4;

  const links = [
    { to: "/", label: "Início" },
    { to: "/profissoes", label: "Profissões" },
    { to: "/famosos", label: "Famosos" },
    { to: "/comunidade", label: "Comunidade" },
  ];
  if (user && !user.teste_feito) links.push({ to: "/teste", label: "Teste" });
  if (user && user.teste_feito) links.push({ to: "/resultado", label: "Meu Resultado" });
  if (user) links.push({ to: "/feedback", label: "Feedback" });
  if (user?.papel === "dono") links.push({ to: "/feedbacks-recebidos", label: "Feedbacks Recebidos" });
  if (user) links.push({ to: "/configuracoes", label: "Configurações" });

  const isActive = (path) => location.pathname === path;

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/profissoes");
    setSearch("");
  };

  return (
    <nav
      className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border shadow-soft select-none"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-16 gap-4">
          {/* LEFT: menu + logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              className="p-2.5 rounded-[12px] border border-border bg-card text-foreground hover:bg-muted transition-colors"
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/" className="flex items-center gap-2 font-heading font-semibold text-xl tracking-tight text-foreground">
              <Logo />
              Norteens
            </Link>
          </div>

          {/* CENTER: search (desktop only) */}
          <div className="flex-1 hidden md:flex justify-center">
            <form onSubmit={handleSearch} className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar profissões..."
                className="w-full pl-9 pr-4 h-9 rounded-full bg-muted/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-card transition-colors"
              />
            </form>
          </div>

          {/* spacer for mobile when search is hidden */}
          <div className="flex-1 md:hidden" />

          {/* RIGHT */}
          <div className="flex items-center gap-2.5">
            {!user ? (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button size="sm" asChild className="hidden sm:inline-flex">
                  <Link to="/teste">Fazer teste</Link>
                </Button>
              </>
            ) : (
              <>
                {/* Progress indicator - desktop only */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60">
                  <span className="text-xs font-medium text-muted-foreground">Nível {nivel} de {totalNiveis}</span>
                  <div className="w-16 h-1.5 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${(nivel / totalNiveis) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Avatar dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded-full hover:ring-2 hover:ring-primary/30 transition-all" aria-label="Menu do usuário">
                      <UserAvatar user={user} size="md" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-foreground">
                          {user.nome || user.apelido || user.full_name || user.email}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/configuracoes" className="flex items-center gap-2 cursor-pointer">
                        <User className="w-4 h-4" /> Meu perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/configuracoes" className="flex items-center gap-2 cursor-pointer">
                        <Settings className="w-4 h-4" /> Configurações
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => base44.auth.logout("/")}
                      className="flex items-center gap-2 text-destructive cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Side drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-72 sm:max-w-xs flex flex-col p-0">
          <SheetHeader className="px-5 pt-5 pb-3 border-b border-border flex-row items-center justify-between space-y-0">
            <SheetTitle className="font-heading text-lg font-semibold">
              Menu
            </SheetTitle>
          </SheetHeader>

          {user && (
            <div className="px-5 py-4 border-b border-border flex items-center gap-3">
              <UserAvatar user={user} size="lg" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {user.nome || user.apelido || user.full_name || user.email}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 rounded-[12px] text-[15px] font-medium transition-colors ${
                  isActive(l.to)
                    ? "bg-primary/12 text-primary"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="px-3 py-3 border-t border-border space-y-1">
            {user ? (
              <button
                onClick={() => { base44.auth.logout("/"); setOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-[12px] text-sm font-medium text-muted-foreground hover:bg-muted transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sair
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-[12px] text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
              >
                Entrar
              </Link>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}