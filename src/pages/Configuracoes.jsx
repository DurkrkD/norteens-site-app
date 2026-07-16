import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConfigPerfil from "@/components/config/ConfigPerfil";
import ConfigConta from "@/components/config/ConfigConta";
import ConfigAparencia from "@/components/config/ConfigAparencia";
import ConfigProfissoes from "@/components/config/ConfigProfissoes";
import ConfigPerguntas from "@/components/config/ConfigPerguntas";
import ConfigPaleta from "@/components/config/ConfigPaleta";
import ConfigUsuarios from "@/components/config/ConfigUsuarios";
import ConfigFamosos from "@/components/config/ConfigFamosos";
import ConfigFeedback from "@/components/config/ConfigFeedback";

export default function Configuracoes() {
  const { user } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  const isARP = user.papel === "arp" || user.papel === "dono";
  const isDono = user.papel === "dono";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-heading text-3xl font-bold text-accent mb-8">
        Configurações
      </h1>

      <Tabs defaultValue="perfil">
        <TabsList className="mb-6 flex-wrap h-auto gap-1">
          <TabsTrigger value="perfil">Meu Perfil</TabsTrigger>
          <TabsTrigger value="conta">Dados da Conta</TabsTrigger>
          <TabsTrigger value="aparencia">Aparência</TabsTrigger>
          {isARP && <TabsTrigger value="profissoes">Profissões</TabsTrigger>}
          {isDono && <TabsTrigger value="famosos">Famosos</TabsTrigger>}
          {isDono && <TabsTrigger value="perguntas">Perguntas</TabsTrigger>}
          {isDono && <TabsTrigger value="paleta">Paleta Global</TabsTrigger>}
          {isDono && <TabsTrigger value="usuarios">Usuários</TabsTrigger>}
          {isDono && <TabsTrigger value="feedback">Feedbacks</TabsTrigger>}
        </TabsList>

        <TabsContent value="perfil">
          <ConfigPerfil />
        </TabsContent>
        <TabsContent value="conta">
          <ConfigConta />
        </TabsContent>
        <TabsContent value="aparencia">
          <ConfigAparencia />
        </TabsContent>
        {isARP && (
          <TabsContent value="profissoes">
            <ConfigProfissoes user={user} />
          </TabsContent>
        )}
        {isDono && (
          <TabsContent value="famosos">
            <ConfigFamosos />
          </TabsContent>
        )}
        {isDono && (
          <TabsContent value="perguntas">
            <ConfigPerguntas />
          </TabsContent>
        )}
        {isDono && (
          <TabsContent value="paleta">
            <ConfigPaleta />
          </TabsContent>
        )}
        {isDono && (
          <TabsContent value="usuarios">
            <ConfigUsuarios />
          </TabsContent>
        )}
        {isDono && (
          <TabsContent value="feedback">
            <ConfigFeedback />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}