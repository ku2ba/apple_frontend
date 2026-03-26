"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const reviews = [
  {
    id: "1",
    text: "НАШЁЛ ЭТОТ МАГАЗИН НЕДАВНО И БЫЛ ОЧЕНЬ УДИВЛЁН ЦЕНАМИ И ПРЕИМУЩЕСТВАМИ МАГАЗИНА. ТЕПЕРЬ БУДУ ТОЛЬКО ЗДЕСЬ ЗАКУПАТЬСЯ ТЕХНИКОЙ. ОЧЕНЬ СОВЕТУЮ!",
    author: "ДЕНИС И.",
    date: "19/02/2026",
  },
  {
    id: "2",
    text: "ОТЛИЧНЫЙ МАГАЗИН! ЦЕНЫ ПРИЯТНО УДИВИЛИ, А ВЫБОР ТЕХНИКИ ПРОСТО ОГРОМНЫЙ. ТЕПЕРЬ Я ВАШ ПОСТОЯННЫЙ КЛИЕНТ! ВСЕМ РЕКОМЕНДУЮ!",
    author: "ВЛАДИСЛАВ А.",
    date: "19/02/2026",
  },
  {
    id: "3",
    text: "НЕДАВНО ОТКРЫЛ ДЛЯ СЕБЯ ЭТОТ МАГАЗИН, И БЫЛ ПРИЯТНО УДИВЛЕН АССОРТИМЕНТОМ И ОБСЛУЖИВАНИЕМ. ТЕПЕРЬ Я ВАШ ПОСТОЯННЫЙ ПОКУПАТЕЛЬ. СПАСИБО ЗА ОТЛИЧНЫЙ СЕРВИС!",
    author: "ИРИНА Е.",
    date: "19/02/2026",
  },
];

const STARS = "★★★★★";

export function ReviewsSection() {
  return (
    <section id="reviews" className="bg-white pb-16 pt-12">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2
            className="max-w-[443px] text-[30px] font-normal leading-[1.2] tracking-[3px] text-[#221f1f]"
            style={{ fontFamily: "var(--font-charito), sans-serif" }}
          >
            <span className="block">ОТЗЫВЫ НАШИХ</span>
            <span className="block">ПОКУПАТЕЛЕЙ</span>
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full border border-[#e4e4e4] text-[#221f1f] hover:bg-[#f7f7f7] focus:outline-none focus:ring-2 focus:ring-[#221f1f] focus:ring-offset-2"
              aria-label="Предыдущий отзыв"
            >
              <ChevronLeftIcon className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full border border-[#e4e4e4] text-[#221f1f] hover:bg-[#f7f7f7] focus:outline-none focus:ring-2 focus:ring-[#221f1f] focus:ring-offset-2"
              aria-label="Следующий отзыв"
            >
              <ChevronRightIcon className="size-5" aria-hidden />
            </button>
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <li key={review.id}>
              <div className="flex min-h-[380px] flex-col overflow-hidden rounded-lg bg-[#fafafc] p-6 md:p-8">
                <span className="mb-4 text-[20px] leading-none text-[#e5b318]" aria-hidden>
                  {STARS}
                </span>
                <span
                  className="mb-4 block text-[48px] leading-none text-[#221f1f]"
                  style={{ fontFamily: "var(--font-charito), sans-serif" }}
                  aria-hidden
                >
                  "
                </span>
                <p
                  className="flex-1 text-[18px] font-normal uppercase leading-[1.5] text-[#221f1f] md:text-[20px]"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  {review.text}
                </p>
                <div className="mt-6 flex flex-wrap items-baseline gap-3 border-t border-[#e4e4e4] pt-6">
                  <span
                    className="text-[18px] font-semibold uppercase leading-none text-[#221f1f] md:text-[20px]"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    {review.author}
                  </span>
                  <span
                    className="text-[14px] font-normal leading-none text-[#949494]"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    {review.date}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
