import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "ghost" | "danger";
}

export function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  const base = "px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-stone-700 text-stone-50 hover:bg-stone-800 focus-visible:ring-stone-700",
    ghost: "text-stone-500 hover:text-stone-700 hover:bg-stone-100 focus-visible:ring-stone-400",
    danger: "text-rose-400 hover:text-rose-500 hover:bg-rose-50 focus-visible:ring-rose-400",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
