import React, { useState, useEffect } from "react";
import { norteens } from "@/api/norteensClient";
import { Link } from "react-router-dom";

export default function Famosos() {
  const [famosos, setFamosos] = useState([]);
  const [profissoes, setProfissoes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      norteens.listarFamosos(),
      norteens.listarProfissoes(),
    ]).then(([f, p]) => {
      setFamosos(f);
      const map = {};
      p.forEach((pr) => (map[pr.id] = pr));
      setProfissoes(map);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-accent mb-2">Famosos</h1>
      <p className="text-muted-foreground mb-8">Personalidades que inspiram em suas carreiras.</p>

      {famosos.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">Nenhum famoso cadastrado ainda.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {famosos.map((f) => {
            const prof = profissoes[f.profissao_id];
            return (
              <div key={f.id} className="p-6 bg-card rounded-2xl border border-border">
                <h3 className="font-heading text-lg font-semibold text-foreground">{f.nome}</h3>
                {prof && (
                  <Link to={`/profissoes/${prof.id}`} className="inline-block mt-1 text-sm text-primary hover:underline">
                    {prof.icone} {prof.nome}
                  </Link>
                )}
                <p className="text-sm text-muted-foreground mt-3 whitespace-pre-line">{f.bio}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}