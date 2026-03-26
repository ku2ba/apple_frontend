"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

const SLIDES = [
  { image: "/main/AppleWatch_main.png", text: "Скидка за оплату безналом" },
  { image: "/main/AitPods_main.png", text: "Гарантия 3 года" },
  { image: "/main/iPhone_main.png", text: "Только оригинальный товар" },
  { image: "/main/MacBook_main.png", text: "15000 товаров доставлено" },
  { image: "/main/iPad_main.png", text: "Бери сейчас - плати потом" },
  { image: "/main/Naushniki_main.png", text: "Рассрочка без процентов" },
  { image: "/main/PlayStation_main.png", text: "Оплата криптовалютой" },
] as const;

/** Порядок слайдов: 0 Apple Watch, 1 AirPods, 2 iPhone, 3 MacBook, 4 iPad, 5 Naushniki, 6 PlayStation */
const ROW1 = [
  { label: "iPhone", slideIndex: 2 },
  { label: "iPad", slideIndex: 4 },
  { label: "Apple Watch", slideIndex: 0 },
  { label: "AirPods", slideIndex: 1 },
] as const;
const ROW2 = [
  { label: "PlayStation", slideIndex: 6 },
  { label: "Mac", slideIndex: 3 },
  { label: "Apple Pencil", slideIndex: 5 },
] as const;

const SLIDE_DURATION_MS = 4000;

export function MainSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[index];

  return (
    <section className="relative min-h-[85vh] w-full overflow-hidden bg-white">
      {/* Углы — абсолютное позиционирование, как на эталоне */}

      {/* Основатель: правый край блока в одну вертикаль с буквой L (начало надписи LOOM STORE) */}
      <div className="absolute z-20" style={{ top: "calc(50% - 130px)", right: "calc(50% - -300px)" }}>
        <a
          href="#founder"
          className="inline-flex items-center gap-3 rounded-2xl border border-[#c9c9c9] bg-white px-3 py-2.5 hover:border-[#221f1f] focus:outline-none focus:ring-2 focus:ring-[#221f1f] focus:ring-offset-2"
        >
          <Image
            src="/main/ava_founder.png"
            alt="Дмитрий Пуртов"
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-full object-cover"
          />
          <div className="flex flex-col gap-0.5">
            <span className="text-[12px] font-normal leading-none text-[#535353]">
              Основатель магазина
            </span>
            <span className="text-[16px] font-medium leading-none text-[#221f1f]">
              Дмитрий Пуртов
            </span>
          </div>
          <ArrowUpRightIcon className="size-5 shrink-0 text-[#221f1f]" aria-hidden />
        </a>
      </div>

      {/* Справа: сменяющийся текст — на прежнем месте (чуть выше надписи STORE) */}
      <div className="absolute right-4 z-20 text-right md:right-8 lg:right-12" style={{ top: "calc(50% - 85px)" }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="loom-promo-text"
          >
            {slide.text}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Центр: LOOM и STORE — слой под картинкой (z-0) */}
      <div className="absolute left-1/2 top-1/2 z-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1 md:gap-3">
        <span
          className="text-[clamp(2.5rem,8vw,6.5rem)] font-normal leading-none text-[#221f1f]"
          style={{ fontFamily: "var(--font-charito), sans-serif" }}
          aria-hidden
        >
          LOOM
        </span>
        <span
          className="text-[clamp(2.5rem,8vw,6.5rem)] font-normal leading-none text-[#221f1f]"
          style={{ fontFamily: "var(--font-charito), sans-serif" }}
          aria-hidden
        >
          STORE
        </span>
      </div>

      {/* Картинка — поверх текста LOOM STORE, чуть левее центра */}
      <div
        className="absolute top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        style={{ left: "calc(50% - 28px)" }}
        aria-hidden
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.96, x: 16 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.98, x: -16 }}
            transition={{ duration: 0.35 }}
            className="relative h-[320px] w-[320px] md:h-[500px] md:w-[500px]"
            style={{ transform: "rotate(-5deg)" }}
          >
            <Image
              src={slide.image}
              alt=""
              fill
              className="object-contain"
              sizes="(max-width: 768px) 320px, 500px"
              priority
              unoptimized
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Слева снизу: описание */}
      <div className="absolute bottom-6 left-4 z-20 max-w-[455px] md:left-8 lg:left-12">
        <p className="text-[20px] font-medium leading-[1.3] text-[#3f3f3f]">
          iPhone, MacBook, iPad и аксессуары Apple с гарантией, быстрой доставкой и профессиональной поддержкой
        </p>
      </div>

      {/* Справа снизу: плашки в 2 ряда (верх: 4, низ: 3 по центру); активна плашка текущего слайда */}
      <div className="absolute bottom-6 right-4 z-20 inline-flex flex-col items-end gap-3 md:right-8 md:gap-4 lg:right-12">
        <div className="flex flex-wrap gap-3 md:gap-4">
          {ROW1.map((cat) => {
            const active = index === cat.slideIndex;
            return (
              <button
                key={cat.label}
                type="button"
                className={
                  active
                    ? "rounded-[40px] border border-[#c9c9c9] bg-[#221f1f] px-5 py-3 text-[16px] leading-none text-white"
                    : "rounded-[40px] border border-[#c9c9c9] bg-white px-5 py-3 text-[16px] leading-none text-[#221f1f] hover:bg-[#f7f7f7]"
                }
                style={{ fontFamily: "var(--font-etude), sans-serif" }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap justify-center gap-3 self-stretch md:gap-4">
          {ROW2.map((cat) => {
            const active = index === cat.slideIndex;
            return (
              <button
                key={cat.label}
                type="button"
                className={
                  active
                    ? "rounded-[40px] border border-[#c9c9c9] bg-[#221f1f] px-5 py-3 text-[16px] leading-none text-white"
                    : "rounded-[40px] border border-[#c9c9c9] bg-white px-5 py-3 text-[16px] leading-none text-[#221f1f] hover:bg-[#f7f7f7]"
                }
                style={{ fontFamily: "var(--font-etude), sans-serif" }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
