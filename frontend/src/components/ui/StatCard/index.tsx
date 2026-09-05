import type { ReactNode } from "react";

type StatCardColor = "primary" | "success" | "danger";

const COLOR_MAP: Record<StatCardColor, string> = {
  primary: "bg-primary text-primary-foreground",
  success: "bg-success text-success-foreground",
  danger: "bg-danger text-danger-foreground",
};

export interface StatCardProps {
  /** Small caption above the value, e.g. "Total of seats" */
  label: string;
  /** Big number / metric shown in the card */
  value: ReactNode;
  /** Icon element rendered above the label (svg / icon component) */
  icon?: ReactNode;
  /** Theme colour of the card. Defaults to "primary" (blue). */
  color?: StatCardColor;
  /** Extra classes for the outer card, e.g. to override the background. */
  className?: string;
}

export const StatCard = ({
  label,
  value,
  icon,
  color = "primary",
  className = "",
}: StatCardProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 rounded-[10px] px-6 py-8 text-center sm:py-10 ${COLOR_MAP[color]} ${className}`}
    >
      {icon ? (
        <span className="mb-1 [&_svg]:h-7 [&_svg]:w-7 [&_[stroke]]:stroke-current [&_[fill]:not([fill='none'])]:fill-current">
          {icon}
        </span>
      ) : null}
      <span className="text-base font-medium sm:text-lg">{label}</span>
      <span className="text-5xl leading-none sm:text-6xl">{value}</span>
    </div>
  );
};
