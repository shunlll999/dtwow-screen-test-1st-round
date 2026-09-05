import type { Metadata } from "next";
import { Providers } from "../provider";

export const metadata: Metadata = {
  title: "Workspace",
  description: "Workspace - You need to access your account.",
};

export default function WorkspaceLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-full flex flex-col">
      Workspace Layout
      <Providers>{children}</Providers>
    </div>
  );
}
