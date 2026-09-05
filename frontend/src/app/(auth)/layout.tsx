import type { Metadata } from "next";
import { Providers } from "../provider";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication - You need to access your account.",
};

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <Providers>
      <div className="min-h-screen flex">
        <div className="hidden lg:flex w-1/2 flex-col justify-between bg-primary text-primary-foreground p-12 xl:p-16">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-full bg-primary-foreground" />
            <span className="text-xl font-bold tracking-wide">BRAND</span>
          </div>
          <div className="flex flex-col gap-4 max-w-md">
            <p className="text-3xl xl:text-4xl font-bold leading-tight">
              &ldquo;Powering the tools that power the team.&rdquo;
            </p>
            <p className="text-sm text-primary-foreground/80">
              Lorem ipsum dolor sit amet consectetur. Elit purus nam gravida
              porttitor nibh urna sit ornare a. Proin dolor morbi id ornare
              aenean non
            </p>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center lg:justify-center gap-8 px-6 py-12 sm:px-10">
          <div className="flex lg:hidden items-center gap-3 mb-16">
            <span className="h-10 w-10 rounded-full bg-primary" />
            <span className="text-xl font-bold tracking-wide text-primary">BRAND</span>
          </div>
          {children}
          <div className="flex lg:hidden flex-col gap-4 max-w-md mt-auto">
            <p className="text-3xl xl:text-4xl font-bold text-primary leading-tight">
              &ldquo;Powering the tools that power the team.&rdquo;
            </p>
            <p className="text-sm text-primary/80" >
              Lorem ipsum dolor sit amet consectetur. Elit purus nam gravida
              porttitor nibh urna sit ornare a. Proin dolor morbi id ornare
              aenean non
            </p>
          </div>
        </div>
      </div>
    </Providers>
  );
}
