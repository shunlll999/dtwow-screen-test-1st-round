'use client';

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** true = กำลังทำงาน (ปุ่ม confirm disabled + กันปิด) */
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({
  open,
  title,
  message,
  confirmLabel = "Yes, Delete",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  // ปิดด้วยปุ่ม Esc + ล็อก scroll ของ body ตอนเปิด
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) onCancel();
    };
    document.addEventListener("keydown", onKeyDown);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [open, loading, onCancel]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      onClick={() => {
        if (!loading) onCancel();
      }}
    >
      <div
        className="w-full max-w-sm rounded-[12px] bg-card px-6 py-8 text-center shadow-[0px_10px_40px_rgba(0,0,0,0.18)] sm:px-8"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-danger text-danger-foreground">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="m15 9-6 6M9 9l6 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </span>

        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        {message ? (
          <p className="mt-1 text-lg font-bold text-foreground">{message}</p>
        ) : null}

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="min-w-[110px] cursor-pointer rounded-[6px] border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground active:scale-98 disabled:opacity-60 sm:text-base"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="min-w-[110px] cursor-pointer rounded-[6px] bg-danger px-5 py-2.5 text-sm font-medium text-danger-foreground active:scale-98 disabled:opacity-60 sm:text-base"
          >
            {loading ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
