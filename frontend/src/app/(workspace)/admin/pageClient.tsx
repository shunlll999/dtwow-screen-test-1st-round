"use client";

import { StatCard } from "@/components/ui";
import { RibbonIcon, UserIcon, XCircleIcon } from "@/components/icons";
import { concertsApi } from "@/lib/endpoints";
import { useResource } from "@/hooks/useResource";

const loadDashboard = async () => {
  const [concerts, stats] = await Promise.all([
    concertsApi.list(),
    concertsApi.stats(),
  ]);
  return { concerts, stats };
};

const AdminPageClient = () => {
  const { data, error, loading } = useResource(loadDashboard);
  const stats = data?.stats ?? null;
  const concerts = data?.concerts ?? [];

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

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-primary sm:text-xl">Concerts</h2>

        {error ? (
          <p className="rounded-[8px] bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        ) : loading ? (
          <p className="text-sm text-muted-foreground">Loading concerts…</p>
        ) : concerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No concerts yet.</p>
        ) : (
          <>
            {/* Mobile: stacked cards */}
            <ul className="flex flex-col gap-3 md:hidden">
              {concerts.map((concert) => {
                const available = concert.totalSeats - concert.reservedSeats;
                return (
                  <li
                    key={concert.id}
                    className="rounded-[10px] border border-border bg-card p-4"
                  >
                    <p className="font-medium text-foreground">{concert.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {concert.description}
                    </p>
                    <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
                      <div className="rounded-[8px] bg-muted px-2 py-2">
                        <dt className="text-xs text-muted-foreground">Reserved</dt>
                        <dd className="font-semibold tabular-nums">
                          {concert.reservedSeats}
                        </dd>
                      </div>
                      <div className="rounded-[8px] bg-muted px-2 py-2">
                        <dt className="text-xs text-muted-foreground">Total</dt>
                        <dd className="font-semibold tabular-nums">
                          {concert.totalSeats}
                        </dd>
                      </div>
                      <div className="rounded-[8px] bg-muted px-2 py-2">
                        <dt className="text-xs text-muted-foreground">Available</dt>
                        <dd className="font-semibold tabular-nums">{available}</dd>
                      </div>
                    </dl>
                  </li>
                );
              })}
            </ul>

            {/* Desktop: table */}
            <div className="hidden overflow-x-auto rounded-[10px] border border-border bg-card md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-3 font-medium text-right">Reserved</th>
                    <th className="px-4 py-3 font-medium text-right">Total seats</th>
                    <th className="px-4 py-3 font-medium text-right">Available</th>
                  </tr>
                </thead>
                <tbody>
                  {concerts.map((concert) => {
                    const available =
                      concert.totalSeats - concert.reservedSeats;
                    return (
                      <tr
                        key={concert.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="px-4 py-3 font-medium text-foreground">
                          {concert.name}
                        </td>
                        <td className="max-w-xs px-4 py-3 text-muted-foreground">
                          {concert.description}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {concert.reservedSeats}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {concert.totalSeats}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {available}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default AdminPageClient;
