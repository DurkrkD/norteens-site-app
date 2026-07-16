import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export default function ConfigUsuarios() {
  const { toast } = useToast();
  const [usuarios, setUsuarios] = useState([]);
  const [profissoes, setProfissoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.User.list(),
      base44.entities.Profissao.list(),
    ]).then(([u, p]) => {
      setUsuarios(u);
      setProfissoes(p);
      setLoading(false);
    });
  }, []);

  const handlePapelChange = async (userId, papel) => {
    await base44.entities.User.update(userId, { papel });
    setUsuarios(usuarios.map((u) => (u.id === userId ? { ...u, papel } : u)));
    toast({ title: "Papel atualizado!" });
  };

  const handleAtribuir = async (userId, profissaoId) => {
    await base44.entities.User.update(userId, { profissao_atribuida: profissaoId });
    setUsuarios(usuarios.map((u) => (u.id === userId ? { ...u, profissao_atribuida: profissaoId } : u)));
    toast({ title: "Profissão atribuída!" });
  };

  if (loading) return <div className="py-8 text-center text-muted-foreground">Carregando...</div>;

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold text-foreground mb-6">Usuários</h2>
      <div className="space-y-3">
        {usuarios.map((u) => (
          <div key={u.id} className="p-4 bg-card rounded-xl border border-border">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{u.full_name || u.email}</p>
                <p className="text-xs text-muted-foreground">{u.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <Select value={u.papel || "usuario"} onValueChange={(v) => handlePapelChange(u.id, v)}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usuario">Usuário</SelectItem>
                    <SelectItem value="arp">ARP</SelectItem>
                    <SelectItem value="dono">Dono</SelectItem>
                  </SelectContent>
                </Select>
                {(u.papel === "arp") && (
                  <Select value={u.profissao_atribuida || ""} onValueChange={(v) => handleAtribuir(u.id, v)}>
                    <SelectTrigger className="w-40"><SelectValue placeholder="Atribuir profissão" /></SelectTrigger>
                    <SelectContent>
                      {profissoes.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}