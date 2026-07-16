import React, { useState, useEffect, useRef, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { MessageCircle, X, Send } from "lucide-react";
import MessageBubble from "./MessageBubble";

const AGENT_NAME = "No";
const GREETING =
  "Oi! Eu sou a Nô 🌿 Estou aqui pra te ajudar a navegar pela Norteens. Pode me perguntar sobre o teste, as profissões, a comunidade... o que precisar!";

export default function NoChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [conversation, setConversation] = useState(null);
  const scrollRef = useRef(null);

  const initConversation = useCallback(async () => {
    try {
      const existing = await base44.agents.listConversations({ agent_name: AGENT_NAME });
      if (existing && existing.length > 0) {
        const conv = existing[0];
        setConversation(conv);
        setMessages(conv.messages || [{ role: "assistant", content: GREETING }]);
        return;
      }
    } catch {
      // ignore and create new
    }
    const conv = await base44.agents.createConversation({
      agent_name: AGENT_NAME,
      metadata: { name: "Conversa com a Nô" },
    });
    setConversation(conv);
    setMessages([{ role: "assistant", content: GREETING }]);
  }, []);

  useEffect(() => {
    if (open && !conversation) {
      initConversation();
    }
  }, [open, conversation, initConversation]);

  useEffect(() => {
    if (!conversation) return;
    const unsubscribe = base44.agents.subscribeToConversation(conversation.id, (data) => {
      setMessages(data.messages || []);
      setSending(false);
    });
    return () => unsubscribe();
  }, [conversation]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !conversation || sending) return;
    setInput("");
    setSending(true);
    try {
      await base44.agents.addMessage(conversation, { role: "user", content: text });
    } catch {
      setSending(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 right-4 md:bottom-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-soft-lg flex items-center justify-center hover:bg-primary/90 transition-all active:scale-95"
          aria-label="Conversar com a Nô"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center md:items-end md:justify-end md:inset-auto md:bottom-6 md:right-4 md:w-96 md:h-[32rem]"
        >
          <div
            className="absolute inset-0 bg-black/20 md:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full md:w-96 h-[70vh] md:h-full bg-card rounded-t-[24px] md:rounded-[24px] shadow-soft-lg border border-border flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-primary-foreground/15 flex items-center justify-center">
                  <span className="font-heading font-semibold text-sm">N</span>
                </div>
                <div>
                  <p className="font-heading font-semibold text-sm">Nô</p>
                  <p className="text-[11px] opacity-80">Sua guia na Norteens</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-primary-foreground/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-background">
              {messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} />
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mr-2">
                    <span className="text-xs font-heading font-semibold text-primary-foreground">N</span>
                  </div>
                  <div className="bg-card border border-border rounded-[18px] rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-border bg-card" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Escreva sua dúvida..."
                  className="flex-1 h-10 px-3 rounded-full border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:bg-primary/90 transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}