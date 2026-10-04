import * as React from "react";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// pilha de notificações: no topo no celular (a barra de abas fica embaixo), no canto inferior direito no computador.
// pointer-events-none no contêiner para ele nunca bloquear cliques na página; cada notificação reativa os seus.
const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "pointer-events-none fixed inset-x-0 top-0 z-[100] flex flex-col gap-2 p-4 sm:inset-x-auto sm:top-auto sm:bottom-0 sm:right-0 sm:w-[400px] sm:flex-col-reverse",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = "ToastViewport";

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-2xl border p-4 pr-11 shadow-elevated transition-all duration-300 ease-out data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-4 sm:data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:pointer-events-none data-[state=closed]:opacity-0 data-[state=closed]:translate-x-6",
  {
    variants: {
      variant: {
        default: "border-border bg-card text-foreground",
        destructive: "destructive border-destructive/30 bg-card text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

const Toast = React.forwardRef(({ className, variant, open = true, ...props }, ref) => (
  <li
    ref={ref}
    role={variant === "destructive" ? "alert" : "status"}
    aria-live={variant === "destructive" ? "assertive" : "polite"}
    data-state={open ? "open" : "closed"}
    className={cn(toastVariants({ variant }), className)}
    {...props}
  />
));
Toast.displayName = "Toast";

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label="Fechar notificação"
    className={cn(
      "absolute right-2.5 top-2.5 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" />
  </button>
));
ToastClose.displayName = "ToastClose";

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm font-semibold leading-snug", className)} {...props} />
));
ToastTitle.displayName = "ToastTitle";

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm text-muted-foreground leading-snug", className)} {...props} />
));
ToastDescription.displayName = "ToastDescription";

export { ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose };
