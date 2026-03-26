import { type ReactNode } from "react";

interface TextProps {
  children: ReactNode;
  as?: "p" | "span" | "div";
  size?: "sm" | "base" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
};

export function Text({
  children,
  as: Component = "p",
  size = "base",
  className = "",
}: TextProps) {
  return (
    <Component
      className={`text-neutral-600 ${sizeStyles[size]} ${className}`.trim()}
    >
      {children}
    </Component>
  );
}
