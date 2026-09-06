'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

export type ToastKind = 'success' | 'error' | 'info';
export interface Toast {
  id: number;
  kind: ToastKind;
  title: string;
  description?: string;
}

interface ToastApi {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastApiContext = createContext<ToastApi | null>(null);
const ToastListContext = createContext<{ toasts: Toast[]; dismiss: (id: number) => void } | null>(null);

const AUTO_DISMISS_MS = 4500;

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

    const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

    const push = useCallback(
    (kind: ToastKind, title: string, description?: string) => {
      const id = nextId.current++;
      setToasts((current) => [...current, { id, kind, title, description }]);
      window.setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    },
    [dismiss],
  );

  const list = useMemo(() => ({ toasts, dismiss }), [toasts, dismiss]);

  const api = useMemo<ToastApi>(
    () => ({
      success: (title, description) => push('success', title, description),
      error: (title, description) => push('error', title, description),
      info: (title, description) => push('info', title, description),
    }),
    [push],
  );

  return (
    <ToastApiContext.Provider value={api}>
      <ToastListContext.Provider value={list}>
        {children}
      </ToastListContext.Provider>
    </ToastApiContext.Provider>
  );
};

export function useToast(): ToastApi {
  const ctx = useContext(ToastApiContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

export function useToastList() {
  const ctx = useContext(ToastListContext);
  if (!ctx) throw new Error('useToastList must be used within <ToastProvider>');
  return ctx;
}
