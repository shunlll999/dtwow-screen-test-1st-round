import type { Metadata } from "next";
import { Providers } from "../provider";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Workspace",
  description: "Workspace - You need to access your account.",
};

export default function WorkspaceProvider({ children }: LayoutProps<"/">) {
  return (
    <Providers>
      <AppShell>{children}</AppShell>
    </Providers>
  );
}
