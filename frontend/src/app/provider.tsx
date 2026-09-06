"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "./(auth)/AuthProvider";
import { ToastProvider } from "@/lib/toast-context";
import { ToastViewport } from "@/components/ui";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>{children}</AuthProvider>
      <ToastViewport />
    </ToastProvider>
  );
}
