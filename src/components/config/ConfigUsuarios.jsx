import React, { useState, useEffect } from "react";
import { norteens } from "@/api/norteensClient";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export default function ConfigUsuarios() {
  const { toast } = useToast();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const u = await norteens.listarUsuarios();
      setUsuarios(u);
    } catch (err) {
      toast({ title: err.message || "Erro ao carregar usuários.", variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handlePapelChange = async (userId, papel) => {
    try {
      const atualizado = await norteens.mudarPapel(userId, papel);
      setUsuarios(usuarios.map((u) => (u.id === userId ? atualizado : u)));
      toast({ title: "Papel atualizado!" });
    } catch (err) {
      toast({ title: err.message || "Erro ao mudar papel.", variant: "destructive" });
    }
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
                <p className="font-medium text-foreground">{u.nome || u.email}</p>
                <p className="text-xs text-muted-foreground">{u.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <Select value={u.papel || "usuario"} onValueChange={(v) => handlePapelChange(u.id, v)}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usuario">Usuário</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}