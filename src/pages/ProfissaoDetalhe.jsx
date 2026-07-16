import React, { useState, useEffect } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, DollarSign, MapPin, Wrench, GraduationCap, Brain, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function ProfissaoDetalhe() {
  const { id } = useParams();
  const { user, setUser } = useOutletContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profissao, setProfissao] = useState(null);
  const [famosos, setFamosos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [choosing, setChoosing] = useState(false);

  useEffect(() => {
    Promise.all([
      base44.entities.Profissao.get(id),
      base44.entities.Famoso.filter({ profissao: id }),
    ]).then(([p, f]) => {
      setProfissao(p);
      setFamosos(f);
      setLoading(false);
    });
  }, [id]);

  const handleEscolher = async () => {
    if (!user || user.profissao_escolhida) return;
    setChoosing(true);
    await base44.auth.updateMe({ profissao_escolhida: id });
    setUser({ ...user, profissao_escolhida: id });
    toast({ title: "Profissão escolhida!", description: `Você escolheu ${profissao.nome}.` });
    setChoosing(false);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!profissao) {
    return <div className="text-center py-20 text-muted-foreground">Profissão não encontrada.</div>;
  }

  const sections = [
    { icon: GraduationCap, title: "Formação", content: profissao.formacao },
    { icon: Brain, title: "Competências Comportamentais", content: profissao.comportamentais },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <div className="flex items-start gap-4 mb-8">
        <span className="text-5xl">{profissao.icone || "💼"}</span>
        <div>
          <h1 className="font-heading text-3xl font-bold text-accent">{profissao.nome}</h1>
          {profissao.salario && (
            <div className="flex items-center gap-2 mt-2 text-secondary font-medium">
              <DollarSign className="w-4 h-4" /> {profissao.salario}
            </div>
          )}
        </div>
      </div>

      {profissao.descricao && (
        <p className="text-foreground leading-relaxed mb-8 whitespace-pre-line">{profissao.descricao}</p>
      )}

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {sections.map((s) => s.content && (
          <div key={s.title} className="p-5 bg-card rounded-2xl border border-border">
            <div className="flex items-center gap-2 mb-3">
              <s.icon className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-semibold text-foreground">{s.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{s.content}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        {profissao.tecnicas?.length > 0 && (
          <div className="p-5 bg-card rounded-2xl border border-border">
            <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" /> Técnicas
            </h3>
            <div className="flex flex-wrap gap-2">
              {profissao.tecnicas.map((t) => (
                <span key={t} className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">{t}</span>
              ))}
            </div>
          </div>
        )}
        {profissao.regioes?.length > 0 && (
          <div className="p-5 bg-card rounded-2xl border border-border">
            <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-secondary" /> Regiões
            </h3>
            <div className="flex flex-wrap gap-2">
              {profissao.regioes.map((r) => (
                <span key={r} className="px-3 py-1 text-xs font-medium bg-secondary/10 text-secondary rounded-full">{r}</span>
              ))}
            </div>
          </div>
        )}
        {profissao.ferramentas?.length > 0 && (
          <div className="p-5 bg-card rounded-2xl border border-border">
            <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-accent" /> Ferramentas
            </h3>
            <div className="flex flex-wrap gap-2">
              {profissao.ferramentas.map((f) => (
                <span key={f} className="px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full">{f}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {famosos.length > 0 && (
        <div className="mb-8">
          <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Famosos nesta profissão</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {famosos.map((f) => (
              <div key={f.id} className="p-4 bg-card rounded-xl border border-border">
                <h4 className="font-semibold text-foreground">{f.nome}</h4>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{f.bio}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {user && !user.profissao_escolhida && (
        <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20 text-center">
          <p className="text-foreground mb-4">Essa profissão combina com você?</p>
          <Button onClick={handleEscolher} disabled={choosing} className="bg-primary hover:bg-primary/90">
            {choosing ? "Escolhendo..." : "Escolher esta profissão"}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">Atenção: essa escolha é definitiva.</p>
        </div>
      )}
    </div>
  );
}