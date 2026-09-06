'use client';

import { TrashIcon, UserIcon } from "@/components/icons";
import type { Concert } from "@/lib/types";

interface ConcertCardProps {
  concert: Concert;
  onDelete?: (concert: Concert) => void;
  deleting?: boolean;
}

export const ConcertCard = ({ concert, onDelete, deleting = false }: ConcertCardProps) => {
  return (
    <article className="rounded-[10px] border border-border bg-card p-5 sm:p-6">
      <h3 className="text-xl font-bold text-primary sm:text-2xl">{concert.name}</h3>
      <hr className="my-4 border-border" />

      <p className="text-sm leading-relaxed text-foreground sm:text-base">
        {concert.description}
      </p>

      <div className="mt-6 flex items-center justify-between gap-4">
        <span className="flex items-center gap-2 text-sm text-foreground sm:text-base [&_svg]:h-5 [&_svg]:w-5">
          <UserIcon />
          <span className="tabular-nums">{concert.totalSeats}</span>
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
        ) : null}
      </div>
    </article>
  );
};
