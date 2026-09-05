'use client';

export const ButtonView = ({ text, onClick, type, color }: { text: string; onClick: () => void; type?: "button" | "submit" | "reset"; color?: "primary" | "secondary" }) => {
  const buttonColor = color === "secondary" ? "bg-secondary text-primary" : "bg-primary text-primary-foreground";

  return (
    <button
      type={type || "button"}
      onClick={onClick}
      className={`cursor-pointer active:scale-98 ${buttonColor} rounded-[4px] w-full py-3 flex items-center justify-center gap-2 mt-4 text-sm sm:text-base`}
    >
      {text}
    </button>
  );
};
