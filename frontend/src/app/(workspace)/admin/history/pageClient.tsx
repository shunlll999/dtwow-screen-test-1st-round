"use client";

import { reservationsApi } from "@/lib/endpoints";
import { useResource } from "@/hooks/useResource";
import type { HistoryEntry } from "@/lib/types";

const pad = (n: number) => String(n).padStart(2, "0");

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const actionLabel = (action: HistoryEntry["action"]) =>
  action === "RESERVE" ? "Reserve" : "Cancel";

const usernameOf = (entry: HistoryEntry) => entry.user?.email || "Unknown user";

const COLUMNS = ["Date time", "Username", "Concert name", "Action"];

// จอเล็ก: แต่ละ cell เรียงเป็นบรรทัด แยกเป็นการ์ด
// จอ sm ขึ้นไป: กลับไปเป็น cell ของตารางที่มีเส้นขอบตามปกติ
const cellClass =
  "flex items-center justify-between gap-4 border-b border-border px-4 py-2.5 text-right " +
  "before:font-medium before:text-muted-foreground before:content-[attr(data-label)] last:border-b-0 " +
  "sm:table-cell sm:border sm:py-3 sm:text-left sm:before:hidden";

const HistoryPageClient = () => {
  const { data, error, loading } = useResource(reservationsApi.allHistory);
  const entries = data ?? [];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {error ? (
        <p className="rounded-[8px] bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      ) : loading ? (
        <p className="text-sm text-muted-foreground">Loading history…</p>
      ) : (
        <table className="w-full border-collapse text-sm sm:text-base">
          <thead className="hidden sm:table-header-group">
            <tr>
              {COLUMNS.map((label) => (
                <th
                  key={label}
                  className="border border-border bg-card px-4 py-3 text-left font-bold text-primary"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="block sm:table-row-group">
            {entries.length === 0 ? (
              <tr className="block sm:table-row">
                <td
                  colSpan={COLUMNS.length}
                  className="block rounded-[8px] border border-border px-4 py-6 text-center text-muted-foreground sm:table-cell sm:rounded-none"
                >
                  No history yet.
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr
                  key={entry.id}
                  className="mb-4 block overflow-hidden rounded-[8px] border border-border bg-card last:mb-0 sm:mb-0 sm:table-row sm:rounded-none sm:border-0"
                >
                  <td
                    data-label="Date time"
                    className={`${cellClass} tabular-nums`}
                  >
                    {formatDateTime(entry.createdAt)}
                  </td>
                  <td data-label="Username" className={cellClass}>
                    {usernameOf(entry)}
                  </td>
                  <td data-label="Concert name" className={cellClass}>
                    {entry.concertName}
                  </td>
                  <td data-label="Action" className={cellClass}>
                    {actionLabel(entry.action)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HistoryPageClient;
