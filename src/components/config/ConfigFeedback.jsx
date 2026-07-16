import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import moment from "moment";

export default function ConfigFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [data, userData] = await Promise.all([
        base44.entities.Feedback.list("-created_date", 100),
        base44.entities.User.list(),
      ]);
      setFeedbacks(data);
      setUsers(userData);
      setLoading(false);
    };
    load();
  }, []);

  const getUserName = (id) => {
    const u = users.find((u) => u.id === id);
    return u ? u.full_name || u.email : "Usuário";
  };

  if (loading) {
    return (
      <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
    );
  }

  if (feedbacks.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        Nenhum feedback recebido ainda.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {feedbacks.map((fb) => (
        <div
          key={fb.id}
          className="bg-card rounded-2xl border border-border p-5 shadow-soft"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm text-foreground">
              {getUserName(fb.autor)}
            </span>
            <span className="text-xs text-muted-foreground">
              {fb.created_date
                ? moment(fb.created_date).format("DD/MM/YYYY HH:mm")
                : ""}
            </span>
          </div>
          <p className="text-sm text-foreground whitespace-pre-wrap">
            {fb.texto}
          </p>
        </div>
      ))}
    </div>
  );
}