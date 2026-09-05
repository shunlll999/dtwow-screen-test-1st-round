'use client'
import { RequireRole } from "@/components/auth/RequireRole";
import UserPageClient from "./pageClient";

const UserPage = () => {
  return (
    <RequireRole role="USER">
      <UserPageClient />
    </RequireRole>
  );
};

export default UserPage;
