"use client";

import { RequireRole } from "@/components/auth/RequireRole";
import HistoryPageClient from "./pageClient";

const HistoryPage = () => {
  return (
    <RequireRole role="ADMIN">
      <HistoryPageClient />
    </RequireRole>
  );
};

export default HistoryPage;
