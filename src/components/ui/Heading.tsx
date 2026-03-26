import { type ReactNode } from "react";

interface HeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

const levelStyles: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: "text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl",
  2: "text-2xl font-bold tracking-tight sm:text-3xl",
  3: "text-xl font-semibold sm:text-2xl",
  4: "text-lg font-semibold sm:text-xl",
  5: "text-base font-semibold sm:text-lg",
  6: "text-sm font-semibold uppercase tracking-wider",
};

const headingTags = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;
type HeadingTag = (typeof headingTags)[number];

export function Heading({
  children,
  level = 1,
  className = "",
}: HeadingProps) {
  const Tag = headingTags[level - 1];
  return (
    <Tag className={`text-neutral-900 ${levelStyles[level]} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
