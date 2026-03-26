"use client";

import Image from "next/image";
import { images } from "@/lib/assets";

const products = [
  {
    id: "1",
    title: "Наушники Apple AirPods Max",
    price: "45 000 Р",
    originalPrice: "55 000 Р",
    image: images.product1,
  },
  {
    id: "2",
    title: "Наушники Apple AirPods Max",
    price: "45 000 Р",
    originalPrice: "52 000 Р",
    image: images.heroMain,
  },
  {
    id: "3",
    title: "Наушники Apple AirPods Max",
    price: "45 000 Р",
    originalPrice: "128 000 Р",
    image: images.product2,
  },
  {
    id: "4",
    title: "Наушники Apple AirPods Max",
    price: "45 000 Р",
    originalPrice: "58 000 Р",
    image: images.macbook,
  },
];

export function PromoProductsSection() {
  return (
    <section id="promo-products" className="bg-white pb-16 pt-12">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8">
        <h2 className="loom-promo-section-title mb-8">
          Акционные товары
        </h2>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <li key={product.id} className="flex flex-col gap-5">
              <div className="relative flex min-h-[273px] flex-1 items-center justify-center overflow-hidden rounded-lg bg-[#f7f7f7]">
                <Image
                  src={product.image}
                  alt=""
                  width={344}
                  height={273}
                  className="object-contain p-4"
                  unoptimized
                />
                <div className="absolute left-5 top-5 rounded-md bg-white px-2.5 py-1.5">
                  <span className="loom-promo-badge">NEW</span>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <p className="loom-promo-product-title">
                  {product.title}
                </p>
                <p className="flex flex-wrap items-baseline gap-2">
                  <span className="loom-promo-price">{product.price}</span>
                  <span className="loom-promo-price line-through">
                    {product.originalPrice}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
