import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Mail, KeyRound } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";

export default function ConfigConta() {
  const { user } = useOutletContext();
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await base44.auth.deleteMe();
      toast({ title: "Conta excluída com sucesso." });
      base44.auth.logout("/");
    } catch {
      toast({ title: "Erro ao excluir conta.", variant: "destructive" });
      setDeleting(false);
    }
  };

  const handlePasswordReset = async () => {
    setSendingReset(true);
    try {
      await base44.auth.resetPasswordRequest(user.email);
      toast({
        title: "E-mail enviado!",
        description: "Verifique seu e-mail para alterar a senha.",
      });
    } catch {
      toast({
        title: "Erro ao enviar e-mail.",
        variant: "destructive",
      });
    }
    setSendingReset(false);
  };

  const displayName = user?.nome || user?.apelido || user?.full_name || "—";

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold text-foreground mb-6">
        Dados da Conta
      </h2>

      {/* Account info */}
      <div className="bg-card rounded-2xl border border-border p-5 mb-5">
        <h3 className="font-semibold text-foreground mb-4">
          Informações de acesso
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">E-mail</p>
              <p className="text-sm font-medium text-foreground">
                {user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <KeyRound className="w-4 h-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Senha</p>
              <p className="text-sm text-muted-foreground">••••••••</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto"
              onClick={handlePasswordReset}
              disabled={sendingReset}
            >
              {sendingReset ? "Enviando..." : "Alterar senha"}
            </Button>
          </div>
        </div>
      </div>

      {/* Personal data */}
      <div className="bg-card rounded-2xl border border-border p-5 mb-5">
        <h3 className="font-semibold text-foreground mb-4">Dados pessoais</h3>
        <div className="flex items-start gap-4">
          <UserAvatar user={user} size="lg" />
          <div className="space-y-2 flex-1">
            <div>
              <p className="text-xs text-muted-foreground">Nome</p>
              <p className="text-sm font-medium text-foreground">
                {displayName}
              </p>
            </div>
            {user?.apelido && (
              <div>
                <p className="text-xs text-muted-foreground">Apelido</p>
                <p className="text-sm font-medium text-foreground">
                  {user.apelido}
                </p>
              </div>
            )}
            {user?.bio && (
              <div>
                <p className="text-xs text-muted-foreground">Bio</p>
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {user.bio}
                </p>
              </div>
            )}
            <div className="flex gap-6">
              {user?.serie_idade && (
                <div>
                  <p className="text-xs text-muted-foreground">Série / Idade</p>
                  <p className="text-sm font-medium text-foreground">
                    {user.serie_idade}
                  </p>
                </div>
              )}
              {user?.cidade && (
                <div>
                  <p className="text-xs text-muted-foreground">Cidade</p>
                  <p className="text-sm font-medium text-foreground">
                    {user.cidade}
                  </p>
                </div>
              )}
            </div>
            {!user?.apelido &&
              !user?.bio &&
              !user?.serie_idade &&
              !user?.cidade && (
                <p className="text-xs text-muted-foreground italic">
                  Nenhum dado pessoal preenchido. Edite seu perfil para
                  adicionar.
                </p>
              )}
          </div>
        </div>
      </div>

      {/* Delete account */}
      <div className="p-5 bg-destructive/5 rounded-2xl border border-destructive/20">
        <h3 className="font-semibold text-foreground mb-2">Excluir Conta</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Esta ação é permanente e não pode ser desfeita. Todos os seus dados
          serão removidos.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={deleting}>
              <Trash2 className="w-4 h-4 mr-2" /> Excluir Conta
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação é permanente e não pode ser desfeita. Todos os seus
                dados serão removidos permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                {deleting ? "Excluindo..." : "Sim, excluir minha conta"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}