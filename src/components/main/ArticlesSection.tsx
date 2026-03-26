"use client";

import Link from "next/link";
import Image from "next/image";
import { images } from "@/lib/assets";

const articles = [
  {
    id: "1",
    title: "Поздоровайся с MacBook Neo от Apple уже сейчас",
    description:
      "Новый MacBook от Apple отличается прочным алюминиевым корпусом, потрясающим 13-дюй...",
    date: "09/03/2026",
    image: images.article1,
  },
  {
    id: "2",
    title: "Представляем новый MacBook Air от компании Elbrus",
    description:
      "Новый MacBook от Elbrus: прочный корпус из титана, экран Retina XDR 15 дюймов и мощный...",
    date: "15/08/2024",
    image: images.article2,
  },
  {
    id: "3",
    title: "Встречайте новый iTab Pro от Texet",
    description:
      "Новый iTab Pro от Texet: прочный корпус из магниевого сплава, экран 14 дюймов OLED и бы...",
    date: "21/01/2025",
    image: images.article3,
  },
  {
    id: "4",
    title: "Встречайте новый iBook Pro от Digma",
    description:
      "Новый iBook Pro от Digma: корпус из карбона, экран Retina HD 14 дюймов и мощный процессор...",
    date: "14/07/2024",
    image: images.article4,
  },
];

export function ArticlesSection() {
  return (
    <section id="articles" className="bg-white pb-16 pt-12">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2
            className="text-[30px] font-normal leading-none tracking-[3px] text-[#221f1f]"
            style={{ fontFamily: "var(--font-charito), sans-serif" }}
          >
            СТАТЬИ
          </h2>
          <Link
            href="#all-articles"
            className="inline-flex items-center gap-1.5 text-[18px] font-normal leading-none text-[#949494] hover:text-[#221f1f] focus:outline-none focus:ring-2 focus:ring-[#221f1f] focus:ring-offset-2 rounded"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Смотреть все
            <span className="ml-0.5" aria-hidden>→</span>
          </Link>
        </div>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((article) => (
            <li key={article.id}>
              <article className="flex h-full flex-col overflow-hidden rounded-lg border border-[#e4e4e4] bg-white shadow-sm">
                <div className="relative h-[273px] w-full shrink-0 overflow-hidden bg-[#f7f7f7]">
                  <Image
                    src={article.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 415px"
                    unoptimized
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2.5 p-5">
                  <h3
                    className="text-[20px] font-semibold leading-[1.2] text-[#221f1f]"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    {article.title}
                  </h3>
                  <p
                    className="line-clamp-3 text-[16px] font-normal leading-[1.3] text-[#949494]"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    {article.description}
                  </p>
                  <p
                    className="mt-auto text-[14px] font-normal leading-none text-[#949494]"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    {article.date}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
