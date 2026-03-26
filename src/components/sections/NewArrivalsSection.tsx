"use client";

import Link from "next/link";
import Image from "next/image";
import { images } from "@/lib/assets";

const products = [
  { id: "1", title: "Наушники Apple AirPods Max", price: "45 000 ₽", image: images.product1 },
  { id: "2", title: "Наушники Apple AirPods Max", price: "45 000 ₽", image: images.heroMain },
  { id: "3", title: "Наушники Apple AirPods Max", price: "45 000 ₽", image: images.product2 },
  { id: "4", title: "Наушники Apple AirPods Max", price: "45 000 ₽", image: images.product3 },
  { id: "5", title: "Наушники Apple AirPods Max", price: "45 000 ₽", image: images.product1 },
  { id: "6", title: "Наушники Apple AirPods Max", price: "45 000 ₽", image: images.product3 },
  { id: "7", title: "Наушники Apple AirPods Max", price: "45 000 ₽", image: images.macbook },
  { id: "8", title: "Наушники Apple AirPods Max", price: "45 000 ₽", image: images.macbook },
];

export function NewArrivalsSection() {
  return (
    <section id="novinki" className="bg-white pb-16 pt-12">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-charito text-[30px] leading-none tracking-[3px] text-[#221f1f]">
            НОВИНКИ
          </h2>
          <Link
            href="#all-new"
            className="inline-flex items-center gap-1.5 font-normal text-[18px] leading-none text-[#949494] hover:text-[#221f1f] focus:outline-none focus:ring-2 focus:ring-[#221f1f] focus:ring-offset-2 rounded"
          >
            Смотреть все
            <Image src={images.arrowRight} alt="" width={24} height={24} className="shrink-0" />
          </Link>
        </div>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <li key={product.id} className="flex flex-col gap-[19px]">
              <div className="relative flex min-h-[273px] flex-1 items-center justify-center overflow-hidden bg-[#f7f7f7]">
                <Image
                  src={product.image}
                  alt=""
                  width={344}
                  height={344}
                  className="object-cover"
                />
                <div className="absolute left-5 top-5 flex items-center justify-center bg-white px-2.5 py-2.5">
                  <span className="font-semibold text-[18px] leading-none text-[#221f1f]">NEW</span>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <p className="font-semibold text-[20px] leading-none text-[#221f1f]">
                  {product.title}
                </p>
                <p className="font-normal text-[18px] leading-none text-[#949494]">
                  {product.price}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
