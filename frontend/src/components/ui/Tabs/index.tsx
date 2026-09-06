'use client';

export interface TabItem {
  key: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  active: string;
  onChange: (key: string) => void;
  className?: string;
}

export const Tabs = ({ items, active, onChange, className = "" }: TabsProps) => {
  return (
    <div className={`flex items-center gap-6 border-b border-border ${className}`}>
      {items.map((item) => {
        const isActive = item.key === active;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={`-mb-px cursor-pointer border-b-2 px-1 pb-3 text-sm font-medium transition-colors sm:text-base ${
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
