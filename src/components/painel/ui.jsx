import React from "react";

// Peças visuais compartilhadas pelas seções do painel da equipe.

export function SecaoHeader({ titulo, descricao, acoes }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{titulo}</h1>
        {descricao && <p className="mt-1 text-sm text-muted-foreground max-w-xl">{descricao}</p>}
      </div>
      {acoes && <div className="flex items-center gap-2 shrink-0">{acoes}</div>}
    </div>
  );
}

export function StatCard({ icon: Icon, label, valor, detalhe, cor = "bg-muted text-foreground" }) {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-muted-foreground truncate">{label}</p>
        {Icon && (
          <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${cor}`}>
            <Icon className="w-4 h-4" />
          </span>
        )}
      </div>
      <p className="mt-3 font-heading text-3xl font-semibold text-foreground">{valor}</p>
      {detalhe && <p className="mt-1 text-xs text-muted-foreground">{detalhe}</p>}
    </div>
  );
}

// Cartão "tabela": cabeçalho opcional + linhas separadas por borda
export function Lista({ cabecalho, children }) {
  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden">
      {cabecalho && (
        <div className="hidden md:grid px-5 py-3 bg-muted/50 border-b border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {cabecalho}
        </div>
      )}
      <ul className="divide-y divide-border">{children}</ul>
    </div>
  );
}

export function BotaoIcone({ label, onClick, perigo = false, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`p-2 rounded-lg text-muted-foreground transition-colors ${
        perigo ? "hover:bg-destructive/10 hover:text-destructive" : "hover:bg-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

// Bloco de formulário com título (usado nos diálogos de cadastro)
export function GrupoForm({ titulo, children }) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{titulo}</legend>
      {children}
    </fieldset>
  );
}

export function Campo({ label, dica, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
      {dica && <span className="block text-xs text-muted-foreground">{dica}</span>}
    </label>
  );
}
