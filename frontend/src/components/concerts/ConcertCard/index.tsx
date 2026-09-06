'use client';

import { TrashIcon, UserIcon } from "@/components/icons";
import type { Concert } from "@/lib/types";

interface ConcertCardProps {
  concert: Concert;
  /** Admin view */
  onDelete?: (concert: Concert) => void;
  deleting?: boolean;
  /** User view */
  onReserve?: (concert: Concert) => void;
  onCancel?: (concert: Concert) => void;
  reserved?: boolean;
  pending?: boolean;
}

export const ConcertCard = ({
  concert,
  onDelete,
  deleting = false,
  onReserve,
  onCancel,
  reserved = false,
  pending = false,
}: ConcertCardProps) => {
  const soldOut = concert.reservedSeats >= concert.totalSeats;

  return (
    <article className="rounded-[10px] border border-border bg-card p-5 sm:p-6">
      <h3 className="text-xl font-bold text-primary-submit sm:text-2xl">{concert.name}</h3>
      <hr className="my-4 border-border" />

      <p className="text-sm leading-relaxed text-foreground sm:text-base">
        {concert.description}
      </p>

      <div className="mt-6 flex items-center justify-between gap-4">
        <span className="flex items-center gap-2 text-sm text-foreground sm:text-base [&_svg]:h-5 [&_svg]:w-5">
          <UserIcon />
          <span className="tabular-nums">{concert.totalSeats.toLocaleString()}</span>
        </span>

        {onDelete ? (
          <button
            type="button"
            disabled={deleting}
            onClick={() => onDelete(concert)}
            className="flex cursor-pointer items-center gap-2 rounded-[6px] bg-danger px-4 py-2 text-sm font-medium text-danger-foreground active:scale-98 disabled:opacity-60 sm:text-base [&_svg]:h-4 [&_svg]:w-4"
          >
            <TrashIcon />
            {deleting ? "Deleting…" : "Delete"}
          </button>
        ) : reserved && onCancel ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => onCancel(concert)}
            className="cursor-pointer rounded-[6px] bg-danger px-6 py-2 text-sm font-medium text-danger-foreground active:scale-98 disabled:opacity-60 sm:text-base"
          >
            {pending ? "Cancelling…" : "Cancel"}
          </button>
        ) : onReserve ? (
          <button
            type="button"
            disabled={pending || soldOut}
            onClick={() => onReserve(concert)}
            className="cursor-pointer rounded-[6px] bg-primary-submit px-6 py-2 text-sm font-medium text-primary-foreground active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed sm:text-base"
          >
            {soldOut ? "Sold out" : pending ? "Reserving…" : "Reserve"}
          </button>
        ) : null}
      </div>
    </article>
  );
};
