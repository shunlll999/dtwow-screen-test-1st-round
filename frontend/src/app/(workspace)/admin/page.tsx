"use client";

import { RequireRole } from "@/components/auth/RequireRole";
import UserPageClient from "./pageClient";

const AdminPage = () => {
  return (
    <RequireRole role="ADMIN">
      <UserPageClient />
    </RequireRole>
  );
};
export default AdminPage;
