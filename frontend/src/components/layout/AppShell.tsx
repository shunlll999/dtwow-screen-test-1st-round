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

  const navButtonClass = (active: boolean) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
      active ? "bg-primary/10 font-medium" : "text-foreground hover:bg-muted"
    }`;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile top bar */}
      <header className="md:hidden border-b border-border bg-card">
        <div className="flex items-center gap-3 px-4 pt-4">
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          <button
            type="button"
            onClick={signOut}
            className="ml-auto flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
          >
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 pt-2">
          {nav.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => router.push(item.href)}
              className={`${navButtonClass(pathname === item.href)} shrink-0 whitespace-nowrap`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card md:flex md:flex-col">
        <h1 className="px-6 pt-8 text-2xl font-bold text-foreground">{title}</h1>

        <nav className="mt-6 flex flex-col gap-1 px-3">
          {nav.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => router.push(item.href)}
              className={navButtonClass(pathname === item.href)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="px-3 pb-8">
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
          >
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col">{children}</main>
    </div>
  );
};

export default AppShell;
