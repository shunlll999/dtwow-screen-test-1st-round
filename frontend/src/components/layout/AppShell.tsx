"use client";

import { dashboardPathFor, useAuth } from "@/app/(auth)/AuthProvider";
import { Role } from "@/lib/types";
import { usePathname, useRouter } from "next/navigation";
import { HistoryIcon, HomeIcon, LogoutIcon, SwitchIcon } from "../icons";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const SHELL_CONFIG: Record<Role, { title: string; nav: NavItem[] }> = {
  ADMIN: {
    title: "Admin",
    nav: [
      { label: "Home", href: "/admin", icon: <HomeIcon /> },
      { label: "History", href: "/admin/history", icon: <HistoryIcon /> },
      { label: "Switch to user", href: dashboardPathFor("LOGIN"), icon: <SwitchIcon /> },
    ],
  },
  USER: {
    title: "User",
    nav: [
      { label: "Home", href: "/user", icon: <HomeIcon /> },
      { label: "Switch to Admin", href: dashboardPathFor("LOGIN"), icon: <SwitchIcon /> },
    ],
  },
};

const roleFromPathname = (pathname: string): Role =>
  pathname.startsWith("/admin") ? "ADMIN" : "USER";

const AppShell = ({
  role,
  children,
}: {
  role?: Role;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useAuth();

  const activeRole = role ?? roleFromPathname(pathname);
  const { title, nav } = SHELL_CONFIG[activeRole];

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col">
        <h1 className="px-6 pt-8 text-2xl font-bold text-foreground">{title}</h1>

        <nav className="mt-6 flex flex-col gap-1 px-3">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <button
                key={item.href}
                type="button"
                onClick={() => router.push(item.href)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-primary/10 font-medium"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex-1" />

        <div className="px-3 pb-8">
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
          >
            {<LogoutIcon />}
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col">{children}</main>
    </div>
  );
};

export default AppShell;
