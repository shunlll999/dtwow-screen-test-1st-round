"use client";

import { useCallback, useState } from "react";
import { ConfirmModal, StatCard, Tabs, type TabItem } from "@/components/ui";
import { RibbonIcon, UserIcon, XCircleIcon } from "@/components/icons";
import { ConcertCard, ConcertCreateForm } from "@/components/concerts";
import { ApiError } from "@/lib/api";
import { concertsApi } from "@/lib/endpoints";
import { useResource } from "@/hooks/useResource";
import type { Concert, CreateConcertInput } from "@/lib/types";

const loadDashboard = async () => {
  const [concerts, stats] = await Promise.all([
    concertsApi.list(),
    concertsApi.stats(),
  ]);
  return { concerts, stats };
};

const TABS: TabItem[] = [
  { key: "overview", label: "Overview" },
  { key: "create", label: "Create" },
];

const AdminPageClient = () => {
  const { data, error, loading, reload } = useResource(loadDashboard);
  const [tab, setTab] = useState<string>("overview");
  const [pendingDelete, setPendingDelete] = useState<Concert | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const stats = data?.stats ?? null;
  const concerts = data?.concerts ?? [];

  const handleCreate = useCallback(
    async (input: CreateConcertInput) => {
      await concertsApi.create(input);
      reload();
      setTab("overview");
    },
    [reload],
  );

  const requestDelete = useCallback((concert: Concert) => {
    setActionError(null);
    setPendingDelete(concert);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!pendingDelete) return;
    setActionError(null);
    setDeleting(true);
    try {
      await concertsApi.remove(pendingDelete.id);
      setPendingDelete(null);
      reload();
    } catch (cause) {
      setActionError(
        cause instanceof ApiError ? cause.message : "Failed to delete concert.",
      );
    } finally {
      setDeleting(false);
    }
  }, [pendingDelete, reload]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:px-8">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 lg:gap-6">
        <StatCard
          color="primary"
          icon={<UserIcon />}
          label="Total of seats"
          value={stats?.totalSeats ?? 0}
        />
        <StatCard
          color="success"
          icon={<RibbonIcon />}
          label="Reserve"
          value={stats?.reserved ?? 0}
        />
        <StatCard
          color="danger"
          icon={<XCircleIcon />}
          label="Cancel"
          value={stats?.cancelled ?? 0}
        />
      </div>

      <Tabs items={TABS} active={tab} onChange={setTab} />

      {tab === "overview" ? (
        <section className="flex flex-col gap-4">
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
            <p className="text-sm text-muted-foreground">No concerts yet.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {concerts.map((concert) => (
                <li key={concert.id}>
                  <ConcertCard
                    concert={concert}
                    onDelete={requestDelete}
                    deleting={deleting && pendingDelete?.id === concert.id}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <section>
          <ConcertCreateForm onCreate={handleCreate} />
        </section>
      )}

      <ConfirmModal
        open={pendingDelete !== null}
        title="Are you sure to delete?"
        message={pendingDelete ? `“${pendingDelete.name}”` : null}
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};

export default AdminPageClient;
