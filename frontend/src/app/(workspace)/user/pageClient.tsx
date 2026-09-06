"use client";

import { useCallback, useMemo, useState } from "react";
import { ConcertCard } from "@/components/concerts";
import { ApiError } from "@/lib/api";
import { concertsApi, reservationsApi } from "@/lib/endpoints";
import { useResource } from "@/hooks/useResource";
import type { Concert } from "@/lib/types";

const loadHome = async () => {
  const [concerts, history] = await Promise.all([
    concertsApi.list(),
    reservationsApi.myHistory(),
  ]);
  return { concerts, history };
};

const UserPageClient = () => {
  const { data, error, loading, reload } = useResource(loadHome);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const concerts = data?.concerts ?? [];

  const reservedIds = useMemo(() => {
    const seen = new Set<string>();
    const reserved = new Set<string>();
    for (const entry of data?.history ?? []) {
      if (!entry.concertId || seen.has(entry.concertId)) continue;
      seen.add(entry.concertId);
      if (entry.action === "RESERVE") reserved.add(entry.concertId);
    }
    return reserved;
  }, [data?.history]);

  const runAction = useCallback(
    async (concert: Concert, action: () => Promise<unknown>, fallback: string) => {
      setActionError(null);
      setPendingId(concert.id);
      try {
        await action();
        reload();
      } catch (cause) {
        setActionError(cause instanceof ApiError ? cause.message : fallback);
      } finally {
        setPendingId(null);
      }
    },
    [reload],
  );

  const handleReserve = useCallback(
    (concert: Concert) =>
      runAction(
        concert,
        () => reservationsApi.reserve(concert.id),
        "Failed to reserve this concert.",
      ),
    [runAction],
  );

  const handleCancel = useCallback(
    (concert: Concert) =>
      runAction(
        concert,
        () => reservationsApi.cancel(concert.id),
        "Failed to cancel this reservation.",
      ),
    [runAction],
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:px-8">
      {actionError ? (
        <p className="rounded-[8px] bg-danger/10 px-4 py-3 text-sm text-danger">
          {actionError}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-[8px] bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      ) : loading ? (
        <p className="text-sm text-muted-foreground">Loading concerts…</p>
      ) : concerts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No concerts available yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {concerts.map((concert) => (
            <li key={concert.id}>
              <ConcertCard
                concert={concert}
                reserved={reservedIds.has(concert.id)}
                pending={pendingId === concert.id}
                onReserve={handleReserve}
                onCancel={handleCancel}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserPageClient;
