import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { norteens } from "@/api/norteensClient";
import ReactMarkdown from "react-markdown";
import { Compass, ArrowRight } from "lucide-react";
import { marcarMarco } from "@/utils/progresso";

export default function Resultado() {
  const { user, setUser } = useOutletContext();
  const navigate = useNavigate();
  const [profissoes, setProfissoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (!user.teste_feito) { navigate("/teste"); return; }
    base44.entities.Profissao.list().then((data) => {
      setProfissoes(data);
      setLoading(false);
    });
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.teste_feito && !user.marco_resultado) {
      marcarMarco(user, setUser, "marco_resultado");
    }
  }, [user, setUser]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const escolhida = profissoes.find((p) => p.id === user.profissao_escolhida);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Compass className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-heading text-3xl font-bold text-accent">Seu Perfil Comportamental</h1>
        <p className="text-muted-foreground mt-2">
          {user.full_name ? `${user.full_name}, ` : ""}aqui está o resultado do seu teste.
        </p>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 mb-8">
        <div className="prose prose-sm max-w-none text-foreground">
          <ReactMarkdown>{user.perfil_resultado}</ReactMarkdown>
        </div>
      </div>

      {escolhida ? (
        <div className="bg-secondary/10 rounded-2xl border border-secondary/20 p-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">Sua profissão escolhida</p>
          <Link to={`/profissoes/${escolhida.id}`} className="font-heading text-xl font-semibold text-secondary hover:underline">
            {escolhida.icone} {escolhida.nome}
          </Link>
        </div>
      ) : (
        <div className="bg-primary/5 rounded-2xl border border-primary/20 p-6 text-center">
          <p className="text-foreground mb-3">Você ainda não escolheu sua profissão.</p>
          <Link to="/profissoes" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
            Explorar profissões <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}