"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function formatPriceRub(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value) + " Р";
}

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
  const { items, totalItems, removeItem } = useCart();

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
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="flex h-[46px] items-center justify-center gap-2 rounded-lg border border-[#c9c9c9] bg-white px-5 py-3 text-[14px] font-normal uppercase leading-none text-[#221f1f] hover:bg-[#f7f7f7] focus:outline-none"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              КОРЗИНА
              <span className="relative inline-flex">
                <CartIcon className="size-5 shrink-0" />
                {totalItems > 0 && (
                  <span className="absolute -right-2 -top-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#d31b1b] px-1 text-[11px] font-semibold leading-none text-white">
                    {totalItems}
                  </span>
                )}
              </span>
            </button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[620px]">
            <DialogHeader>
              <DialogTitle>Корзина</DialogTitle>
            </DialogHeader>

            <div className="max-h-[50vh] space-y-3 overflow-y-auto pr-1">
              {items.length === 0 ? (
                <p
                  className="py-6 text-[14px] text-[#626262]"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  В корзине пока нет товаров.
                </p>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="relative rounded-lg border border-[#e4e4e4] p-3"
                  >
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Удалить ${item.name} из корзины`}
                      className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-md text-[#949494] hover:bg-[#f7f7f7] hover:text-[#221f1f] focus:outline-none"
                    >
                      ×
                    </button>
                    <p
                      className="pr-8 text-[14px] font-medium text-[#221f1f]"
                      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                      {item.name}
                    </p>
                    <p
                      className="mt-1 text-[13px] text-[#626262]"
                      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                      Кол-во: {item.quantity}
                      {item.color ? ` · ${item.color}` : ""}
                      {item.memoryGb ? ` · ${item.memoryGb} ГБ` : ""}
                    </p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-[18px] text-[#221f1f]">
                        {formatPriceRub(item.price)}
                      </span>
                      {item.priceOld && item.priceOld > item.price && (
                        <span className="text-[15px] text-[#949494] line-through">
                          {formatPriceRub(item.priceOld)}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <DialogFooter className="justify-end">
              <button
                type="button"
                className="inline-flex h-[42px] items-center justify-center rounded-lg bg-[#221f1f] px-5 text-[14px] uppercase leading-none text-white hover:bg-[#221f1f]/90 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                disabled={items.length === 0}
              >
                Перейти к оплате
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
