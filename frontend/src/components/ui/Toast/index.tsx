import type { ReactNode } from "react";
import { CheckIcon, CrossIcon, InfoIcon } from "@/components/icons";
import { useToastList, type ToastKind } from "@/lib/toast-context";

interface ToastStyle {
  background: string;
  color: string;
  iconBg: string;
  icon: ReactNode;
}

const STYLES: Record<ToastKind, ToastStyle> = {
  success: {
    background: "#dcefe4",
    color: "#1f2937",
    iconBg: "var(--color-success)",
    icon: <CheckIcon />,
  },
  error: {
    background: "#f8dede",
    color: "#1f2937",
    iconBg: "var(--color-danger)",
    icon: <CrossIcon />,
  },
  info: {
    background: "#dcebf5",
    color: "#1f2937",
    iconBg: "var(--color-primary)",
    icon: <InfoIcon />,
  },
};

export const ToastViewport = () => {
  const { toasts, dismiss } = useToastList();
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[9999] flex flex-col items-end gap-2">
      {toasts.map((toast) => {
        const style = STYLES[toast.kind];
        return (
          <div
            key={toast.id}
            role="status"
            className="toast-enter pointer-events-auto flex w-auto max-w-[360px] items-center gap-3 rounded-[10px] px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
            style={{ background: style.background, color: style.color }}
          >
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white [&>svg]:h-3.5 [&>svg]:w-3.5"
              style={{ background: style.iconBg }}
            >
              {style.icon}
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-5">{toast.title}</p>
              {toast.description ? (
                <p className="mt-0.5 text-xs leading-4 opacity-70">{toast.description}</p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
              className="shrink-0 cursor-pointer text-current opacity-50 transition-opacity hover:opacity-100 [&>svg]:h-3.5 [&>svg]:w-3.5"
            >
              <CrossIcon />
            </button>
          </div>
        );
      })}
    </div>
  );
};
