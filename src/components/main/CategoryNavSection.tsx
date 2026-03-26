"use client";

import { useState } from "react";
import Link from "next/link";

const categories = [
  { name: "IPHONE", count: 12, href: "/category/iphone", active: true },
  { name: "IMAC и MACBOOK", count: 12, href: "/category/macbook", active: false },
  { name: "AIRPODS", count: 12, href: "/category/airpods", active: false },
  { name: "APPLE WATCH", count: 12, href: "/category/applewatch", active: false },
  { name: "IPAD", count: 12, href: "/category/ipad", active: false },
] as const;

const hoverColor = "#221f1f";
const defaultColor = "#949494";

export function CategoryNavSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  return (
    <section id="catalog" className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-[1920px] pl-6 pr-4 sm:pl-8 sm:pr-6 lg:pl-12 lg:pr-8">
        <nav
          aria-label="Каталог категорий"
          className="loom-category-nav flex flex-col items-start gap-8 md:gap-14 leading-none uppercase"
        >
          {categories.map((cat) => {
            const isActive = hoveredId === cat.href || focusedId === cat.href;
            const nameColor = isActive ? hoverColor : defaultColor;
            const numberColor = isActive ? hoverColor : defaultColor;

            return (
              <Link
                key={cat.href}
                href={cat.href}
                className="flex items-baseline gap-1 py-1 cursor-pointer focus:outline-none rounded transition-colors duration-300"
                onMouseEnter={() => setHoveredId(cat.href)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setFocusedId(cat.href)}
                onBlur={() => setFocusedId(null)}
              >
                <span
                  className="text-[40px] font-normal leading-none md:text-[56px] lg:text-[72px]"
                  style={{ color: nameColor, transition: "color 0.3s ease" }}
                >
                  {cat.name}
                </span>
                <span
                  className="text-[18px] font-normal leading-none md:text-[24px] lg:text-[30px]"
                  style={{ color: numberColor, transition: "color 0.3s ease" }}
                >
                  / 12 /
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
