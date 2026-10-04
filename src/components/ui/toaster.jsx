import { useEffect, useRef, useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useToast, TOAST_DURACAO, TOAST_DURACAO_ERRO } from "@/components/ui/use-toast";
import { Toast, ToastClose, ToastDescription, ToastTitle, ToastViewport } from "@/components/ui/toast";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <ToastViewport aria-label="Notificações">
      {toasts.map((t) => (
        <ItemToast key={t.id} {...t} onFechar={() => dismiss(t.id)} />
      ))}
    </ToastViewport>
  );
}

function ItemToast({ title, description, action, variant, open, duration, onFechar }) {
  const erro = variant === "destructive";
  const total = duration ?? (erro ? TOAST_DURACAO_ERRO : TOAST_DURACAO);
  const [pausado, setPausado] = useState(false);
  const restante = useRef(total);
  const inicio = useRef(0);
  const toque = useRef(null);
  const [arraste, setArraste] = useState(0);
  const fechar = useRef(onFechar);
  fechar.current = onFechar;

  // some sozinha; o mouse em cima pausa a contagem (dá tempo de ler)
  useEffect(() => {
    if (!open || pausado || total === Infinity) return;
    inicio.current = Date.now();
    const timer = setTimeout(() => fechar.current(), restante.current);
    return () => {
      clearTimeout(timer);
      restante.current -= Date.now() - inicio.current;
    };
  }, [open, pausado, total]);

  // arrastar para o lado (celular) também fecha
  const aoTocar = (e) => { toque.current = e.touches[0].clientX; setPausado(true); };
  const aoMover = (e) => { if (toque.current !== null) setArraste(e.touches[0].clientX - toque.current); };
  const aoSoltar = () => {
    if (Math.abs(arraste) > 80) onFechar();
    else setArraste(0);
    toque.current = null;
    setPausado(false);
  };

  const Icone = erro ? AlertCircle : CheckCircle2;

  return (
    <Toast
      variant={variant}
      open={open}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onTouchStart={aoTocar}
      onTouchMove={aoMover}
      onTouchEnd={aoSoltar}
      style={arraste ? { transform: `translateX(${arraste}px)`, opacity: 1 - Math.min(Math.abs(arraste) / 200, 0.7), transition: "none" } : undefined}
    >
      <Icone className={`w-5 h-5 mt-px shrink-0 ${erro ? "text-destructive" : "text-secondary"}`} />
      <div className="grid gap-0.5 min-w-0 flex-1">
        {title && <ToastTitle>{title}</ToastTitle>}
        {description && <ToastDescription>{description}</ToastDescription>}
        {action && <div className="mt-2">{action}</div>}
      </div>
      <ToastClose onClick={onFechar} />
      {/* barra do tempo restante */}
      {open && total !== Infinity && (
        <span
          aria-hidden
          className={`absolute left-0 bottom-0 h-0.5 origin-left ${erro ? "bg-destructive/50" : "bg-secondary/40"}`}
          style={{
            width: "100%",
            animation: `toast-tempo ${total}ms linear forwards`,
            animationPlayState: pausado ? "paused" : "running",
          }}
        />
      )}
    </Toast>
  );
}
