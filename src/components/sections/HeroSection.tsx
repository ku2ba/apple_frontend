"use client";

import Image from "next/image";
import Link from "next/link";
import { images } from "@/lib/assets";

/* Порядок и стили категорий как в Figma: iPhone (светлая), iPad, Apple Watch (активная — тёмная), AirPods, PlayStation, Mac, Apple Pencil */
const categories = [
  { label: "iPhone", active: false },
  { label: "iPad", active: false },
  { label: "Apple Watch", active: true },
  { label: "AirPods", active: false },
  { label: "PlayStation", active: false },
  { label: "Mac", active: false },
  { label: "Apple Pencil", active: false },
] as const;

export function HeroSection() {
  return (
    <section className="relative min-h-[900px] w-full overflow-hidden bg-white md:min-h-[950px]">
      {/* Фоновый текст "Loom Store" — Charito 169px, по центру как в макете */}
      <p
        className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-[calc(50%+120px)] font-charito text-[clamp(80px,12vw,169px)] leading-none text-[#221f1f] whitespace-nowrap md:-translate-y-[calc(50%+80px)]"
        aria-hidden
      >
        Loom Store
      </p>

      {/* Мелкий логотип слева сверху — в макете дублируется, у нас уже в Header */}

      {/* Текст скидки справа — Charito 20px */}
      <p className="absolute right-[calc(16.67%+20px)] top-[calc(50%-270px)] hidden font-charito text-[20px] leading-none text-[#221f1f] whitespace-nowrap lg:block">
        скидка за оплату безналом
      </p>

      {/* Навигация и контент — в одном потоке с контейнером */}
      <div className="relative z-10 mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8">
        {/* Описание — Montserrat Medium 20px, слева */}
        <p className="mt-6 max-w-[455px] font-medium leading-[1.3] text-[#3f3f3f] text-[20px] lg:mt-8">
          iPhone, MacBook, iPad и аксессуары Apple с гарантией, быстрой доставкой и профессиональной поддержкой
        </p>

        {/* Блок основателя — как в макете: rounded-[40px], border #c9c9c9 */}
        <Link
          href="#founder"
          className="mt-6 inline-flex items-center gap-3 rounded-[40px] border border-[#c9c9c9] bg-white pl-2.5 pr-4 py-2.5 hover:border-[#221f1f] focus:outline-none focus:ring-2 focus:ring-[#221f1f] focus:ring-offset-2"
        >
          <Image
            src={images.founderAvatar}
            alt=""
            width={38}
            height={38}
            className="size-[38px] shrink-0 rounded-full object-cover"
          />
          <div className="flex flex-col gap-0.5">
            <span className="font-normal text-[12px] leading-none text-[#535353]">
              Основатель магазина
            </span>
            <span className="font-medium text-[16px] leading-none text-[#221f1f]">
              Дмитрий Пуртов
            </span>
          </div>
          <Image
            src={images.arrowUpRight}
            alt=""
            width={22}
            height={22}
            className="size-[22px] shrink-0"
          />
        </Link>

        {/* Пилсы категорий — Etude Noire 16px, как в макете */}
        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((cat) => (
            <span
              key={cat.label}
              className={
                cat.active
                  ? "flex items-center justify-center rounded-[40px] border border-[#c9c9c9] bg-[#221f1f] px-5 py-3 font-etude text-[16px] leading-none text-white"
                  : "flex items-center justify-center rounded-[40px] border border-[#c9c9c9] bg-white px-5 py-3 font-etude text-[16px] leading-none text-[#221f1f]"
              }
            >
              {cat.label}
            </span>
          ))}
        </div>
      </div>

      {/* Центральное изображение — rotate 4.97deg, по центру */}
      <div className="absolute left-1/2 top-[128px] z-20 flex h-[705px] w-[636px] -translate-x-1/2 items-center justify-center md:left-1/2 md:top-[140px]">
        <div className="rotate-[4.97deg]">
          <div className="relative h-[657px] w-[582px]">
            <Image
              src={images.heroMain}
              alt="Apple Watch с цветным циферблатом"
              fill
              className="object-contain"
              priority
              sizes="582px"
            />
          </div>
        </div>
      </div>

      {/* Стрелка вниз — по центру под героем */}
      <div className="absolute left-1/2 top-[894px] flex -translate-x-1/2 justify-center">
        <Image src={images.arrowDown} alt="" width={46} height={46} />
      </div>
    </section>
  );
}
