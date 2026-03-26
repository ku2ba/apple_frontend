import { type ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div";
}

export function Section({
  children,
  className = "",
  id,
  as: Component = "section",
}: SectionProps) {
  return (
    <Component id={id} className={className.trim() || undefined}>
      {children}
    </Component>
  );
}
