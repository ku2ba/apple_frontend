"use client";

import Link from "next/link";
import { ArrowUpIcon } from "@heroicons/react/24/outline";

const navItems = [
  { label: "ГЛАВНАЯ", href: "/" },
  { label: "КАТАЛОГ", href: "#catalog" },
  { label: "Акции", href: "#promo-products" },
  { label: "СТАТЬИ", href: "#articles" },
  { label: "ОТЗЫВЫ", href: "#reviews" },
] as const;

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-[#e4e4e4] bg-white py-12">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={scrollToTop}
              className="flex size-12 items-center justify-center rounded-lg border border-[#e4e4e4] bg-[#f7f7f7] text-[#221f1f] hover:bg-[#eee] focus:outline-none"
              aria-label="Наверх"
            >
              <ArrowUpIcon className="size-5" aria-hidden />
            </button>
          </div>

          <nav aria-label="Навигация в подвале">
            <ul className="flex flex-wrap items-center justify-center gap-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex h-[46px] items-center justify-center rounded-lg border border-[#c9c9c9] bg-white px-5 py-3 text-center text-[14px] font-normal uppercase leading-none text-[#221f1f] hover:bg-[#f7f7f7] focus:outline-none focus:ring-2 focus:ring-[#221f1f] focus:ring-offset-2"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="grid grid-cols-1 gap-4 border-t border-[#e4e4e4] pt-6 text-[14px] font-normal text-[#878787] sm:grid-cols-3 sm:items-center sm:gap-4">
            <p className="text-center uppercase sm:text-left" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
              LOOMSTORE © 2026. ВСЕ ПРАВА ЗАЩИЩЕНЫ
            </p>
            <Link
              href="#privacy"
              className="text-center uppercase hover:underline focus:outline-none rounded sm:text-center"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ
            </Link>
            <div className="text-center sm:text-right">
              <p style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>DESIGN: Polina Shevtsova</p>
              <p className="mt-0.5 text-[12px] text-[#878787]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                Lviv, Ukraine
              </p>
            </div>
          </div>

          <p className="footer-loom-logo" aria-hidden>
            LOOM STORE
          </p>
        </div>
      </div>
    </footer>
  );
}
