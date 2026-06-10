import React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "neutral" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const baseInset =
  "shadow-[inset_7px_7px_7px_rgba(153,153,153,0.25),inset_-7px_-7px_7px_rgba(235,235,235,0.25)]";
const hoverInset =
  "hover:shadow-[inset_9px_9px_9px_rgba(153,153,153,0.28),inset_-9px_-9px_9px_rgba(235,235,235,0.28)]";
const activeInset =
  "active:shadow-[inset_4px_4px_6px_rgba(153,153,153,0.35),inset_-4px_-4px_6px_rgba(235,235,235,0.35)]";

// const sizeClasses: Record<ButtonSize, string> = {
//   sm: "px-4 py-1 text-sm rounded-sm",
//   md: "px-4 py-1 text-sm rounded-2xl",
//   lg: "px-4 py-1 text-sm rounded-xl",
// };

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-[#008080] text-white",
  danger: "bg-[red] text-white",
  neutral: "bg-white text-gray-800",
  ghost: "bg-transparent text-gray-800 border border-transparent",
};

const disabledClasses =
  "opacity-60 cursor-not-allowed hover:shadow-none active:shadow-none";

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn(
        "inline-flex items-center cursor-pointer justify-center select-none focus:outline-none w-full h-10 lg:h-12 text-[0.8rem] font-bold rounded-xl",
        // sizeClasses[size],
        variantClasses[variant],
        baseInset,
        hoverInset,
        activeInset,
        fullWidth && "w-full",
        disabled && disabledClasses,
        className
      )}
      disabled={disabled}
      {...props}
    >
      {leftIcon && (
        <span className="mr-2 inline-flex items-center">{leftIcon}</span>
      )}
      <span>{children}</span>
      {rightIcon && (
        <span className="ml-2 inline-flex items-center">{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;
