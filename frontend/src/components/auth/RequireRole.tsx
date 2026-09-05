import { dashboardPathFor, useAuth } from "@/app/(auth)/AuthProvider";
import { Role } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageSpinner } from "../ui";

export const RequireRole = ({ role, children }: { role: Role; children: React.ReactNode }) => {
  const router = useRouter();
  const { status, user } = useAuth();

   useEffect(() => {
    if (status === 'anonymous') router.replace('/login');
    else if (status === 'authenticated' && user && user.role !== role) {
      router.replace(dashboardPathFor(user.role));
    }
  }, [status, user, role, router]);

  if (status !== 'authenticated' || !user || user.role !== role) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PageSpinner label="Checking your session…" />
      </div>
    );
  }
  return <>{children}</>;
}
