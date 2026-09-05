'use client';

import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { EyeIcon, EyeSlashIcon } from "../../icons";

interface InputViewProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  icon?: ReactNode;
  error?: string;
  isPassword?: boolean;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
}

export const InputView = ({ icon, error, isPassword, type, className, ...props }: InputViewProps) => {
  const [visible, setVisible] = useState(false);
  const resolvedType = isPassword ? (visible ? "text" : "password") : type;

  return (
    <div className={className}>
      <div
        className={`flex items-center gap-2 w-full rounded-[4px] border bg-card px-3 py-3 ${
          error ? "border-danger" : "border-border"
        }`}
      >
        {icon && <span className="text-muted-foreground shrink-0">{icon}</span>}
        <input
          {...props}
          type={resolvedType}
          className="w-full bg-transparent outline-none text-sm sm:text-base placeholder:text-placeholder"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="text-muted-foreground shrink-0 cursor-pointer"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <EyeIcon /> : <EyeSlashIcon />}
          </button>
        )}
      </div>
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );
};
