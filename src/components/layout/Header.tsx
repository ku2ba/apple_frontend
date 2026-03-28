"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { CartCheckoutDialogs } from "@/components/checkout/CartCheckoutDialogs";

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
        <Link
          href="/"
          className="flex shrink-0 flex-col text-[20px] font-bold leading-[0.85] text-[#221f1f] focus:outline-none rounded"
          style={{ fontFamily: "var(--font-akony), sans-serif" }}
          aria-label="Loom Store — главная"
        >
          <span>LOOM</span>
          <span>STORE</span>
        </Link>

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

        <div className="hidden w-[280px] shrink-0 lg:block xl:w-[367px]">
          <Input
            type="search"
            placeholder="Поиск"
            className="h-10 border-[#e4e4e4] bg-white placeholder:text-[#949494]"
            aria-label="Поиск по сайту"
          />
        </div>

        <CartCheckoutDialogs />
      </div>
    </header>
  );
}
