import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Cabeçalho padrão das páginas internas: sobretítulo, título, descrição e ações à direita.
export function PageHeader({ eyebrow, title, description, actions, back }) {
  return (
    <header className="mb-8 sm:mb-10">
      {back && (
        <Link
          to={back.to}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-5"
        >
          <ArrowLeft className="w-4 h-4" /> {back.label}
        </Link>
      )}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent mb-2">{eyebrow}</p>
          )}
          <h1 className="text-3xl sm:text-4xl font-semibold text-foreground leading-tight">{title}</h1>
          {description && <p className="mt-2.5 text-muted-foreground leading-relaxed">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </header>
  );
}

export function PageLoading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center" role="status" aria-label="Carregando">
      <div className="w-8 h-8 border-[3px] border-primary/15 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

// Estado vazio: ícone num círculo, título, explicação e (opcional) uma ação.
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center text-center py-14 px-6 rounded-2xl border border-dashed border-border bg-card/60">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Icon className="w-5 h-5 text-muted-foreground" strokeWidth={1.8} />
        </div>
      )}
      <p className="font-heading font-semibold text-foreground">{title}</p>
      {description && <p className="mt-1.5 text-sm text-muted-foreground max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// Largura padrão das páginas
export function PageContainer({ size = "lg", className = "", children, ...rest }) {
  const largura = { sm: "max-w-2xl", md: "max-w-4xl", lg: "max-w-6xl" }[size];
  return (
    <div className={`${largura} mx-auto px-4 sm:px-6 py-10 sm:py-14 ${className}`} {...rest}>
      {children}
    </div>
  );
}
