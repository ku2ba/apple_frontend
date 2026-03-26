"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";

/** Иконка корзины (outline), как в Heroicons — inline SVG, чтобы избежать ошибок HMR с heroicons */
function CartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

const navItems = [
  { label: "ГЛАВНАЯ", href: "/", active: true },
  { label: "КАТАЛОГ", href: "#catalog", active: false },
  { label: "Акции", href: "#promo-products", active: false },
  { label: "СТАТЬИ", href: "#articles", active: false },
  { label: "ОТЗЫВЫ", href: "#reviews", active: false },
] as const;

export function Header() {
  return (
    <header className="border-b border-[#e4e4e4] bg-white">
      <div className="mx-auto flex max-w-[1920px] items-center gap-2 px-4 py-3 sm:px-6 lg:px-8">
        {/* Лого: AKONY Bold 20px, плотный межстрочный интервал как в Figma */}
        <Link
          href="/"
          className="flex shrink-0 flex-col text-[20px] font-bold leading-[0.85] text-[#221f1f] focus:outline-none rounded"
          style={{ fontFamily: "var(--font-akony), sans-serif" }}
          aria-label="Loom Store — главная"
        >
          <span>LOOM</span>
          <span>STORE</span>
        </Link>

        {/* Навигация — такой же стиль и шрифт, как у кнопок в футере */}
        <nav className="flex flex-1 items-center justify-center gap-3" aria-label="Основная навигация">
          <ul className="flex flex-wrap items-center gap-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex h-[46px] items-center justify-center rounded-lg border border-[#c9c9c9] bg-white px-5 py-3 text-center text-[14px] font-normal uppercase leading-none text-[#221f1f] hover:bg-[#f7f7f7] focus:outline-none"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Поиск — только shadcn Input */}
        <div className="hidden w-[280px] shrink-0 lg:block xl:w-[367px]">
          <Input
            type="search"
            placeholder="Поиск"
            className="h-10 border-[#e4e4e4] bg-white placeholder:text-[#949494]"
            aria-label="Поиск по сайту"
          />
        </div>

        {/* Корзина — такой же стиль и шрифт, справа иконка корзины */}
        <Link
          href="#cart"
          className="flex h-[46px] items-center justify-center gap-2 rounded-lg border border-[#c9c9c9] bg-white px-5 py-3 text-[14px] font-normal uppercase leading-none text-[#221f1f] hover:bg-[#f7f7f7] focus:outline-none"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          КОРЗИНА
          <CartIcon className="size-5 shrink-0" />
        </Link>
      </div>
    </header>
  );
}
