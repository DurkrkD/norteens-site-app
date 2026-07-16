import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ConfigFeedback from "@/components/config/ConfigFeedback";

export default function FeedbacksRecebidos() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>
      <h1 className="font-heading text-3xl font-bold text-accent mb-2">Feedbacks Recebidos</h1>
      <p className="text-muted-foreground mb-8">
        Todos os feedbacks enviados pelos usuários da plataforma.
      </p>
      <ConfigFeedback />
    </div>
  );
}