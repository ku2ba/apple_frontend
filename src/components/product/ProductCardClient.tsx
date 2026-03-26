"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import type { Product, ProductVariant } from "@/lib/products-db";

function formatPriceRub(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value) + " Р";
}

function pickFirst<T>(arr: T[]) {
  return arr.length > 0 ? arr[0] : null;
}

function matchVariant(args: {
  variants: ProductVariant[];
  color: string | null;
  memoryGb: number | null;
  storage: string | null;
  lte: string | null;
  simType: string | null;
}) {
  const { variants, color, memoryGb, storage, lte, simType } = args;
  const filtered = variants.filter((v) => {
    if (color && v.color !== color) return false;
    if (memoryGb != null && v.memoryGb != null && v.memoryGb !== memoryGb)
      return false;
    if (storage && v.storage && v.storage !== storage) return false;
    if (lte && v.lte && v.lte !== lte) return false;
    if (simType && v.simType && v.simType !== simType) return false;
    return true;
  });
  return pickFirst(filtered);
}

export function ProductCardClient({
  product,
  galleryByColor,
  initialColor,
}: {
  product: Product;
  galleryByColor: Record<string, string[]>;
  initialColor?: string;
}) {
  const defaultColor = useMemo(() => {
    if (initialColor && product.colors.includes(initialColor)) return initialColor;
    return pickFirst(product.colors);
  }, [initialColor, product.colors]);
  const defaultMemory = useMemo(
    () => pickFirst(product.memoryOptionsGb),
    [product.memoryOptionsGb]
  );
  const defaultStorage = useMemo(
    () => pickFirst(product.storageOptions),
    [product.storageOptions]
  );
  const defaultLte = useMemo(
    () => pickFirst(product.lteOptions),
    [product.lteOptions]
  );
  const defaultSim = useMemo(
    () => pickFirst(product.simTypeOptions),
    [product.simTypeOptions]
  );

  const [selectedColor, setSelectedColor] = useState<string | null>(defaultColor);
  const [selectedMemoryGb, setSelectedMemoryGb] = useState<number | null>(
    defaultMemory
  );
  const [selectedStorage, setSelectedStorage] = useState<string | null>(
    defaultStorage
  );
  const [selectedLte, setSelectedLte] = useState<string | null>(defaultLte);
  const [selectedSimType, setSelectedSimType] = useState<string | null>(defaultSim);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const gallery = (selectedColor ? galleryByColor[selectedColor] : null) ?? [];

  const currentVariant =
    matchVariant({
      variants: product.variants,
      color: selectedColor,
      memoryGb: selectedMemoryGb,
      storage: selectedStorage,
      lte: selectedLte,
      simType: selectedSimType,
    }) ?? product.variants[0];

  const price = currentVariant?.price ?? 0;
  const priceOld = currentVariant?.priceOld ?? 0;

  return (
    <div className="bg-white">
      <div className="border-b border-[#e4e4e4] py-3">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8">
          <nav aria-label="Хлебные крошки" className="flex justify-end">
            <ol
              className="flex flex-wrap items-center gap-1 text-[14px] text-[#949494]"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              <li className="flex items-center gap-1">
                <Link href="/" className="hover:text-[#221f1f] focus:outline-none">
                  Главная
                </Link>
              </li>
              <li className="flex items-center gap-1">
                <span className="text-[#c9c9c9]">/</span>
                <span className="text-[#221f1f]">{product.title}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-[1920px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <section className="flex gap-4" aria-label="Галерея товара">
            <div className="flex flex-col gap-2">
              {gallery.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setMainImageIndex(i)}
                  className={`relative aspect-square w-16 overflow-hidden rounded-lg border-2 bg-[#f7f7f7] focus:outline-none md:w-20 ${
                    mainImageIndex === i
                      ? "border-[#221f1f]"
                      : "border-transparent"
                  }`}
                  aria-label={`Показать фото ${i + 1}`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-contain p-1"
                    sizes="80px"
                    unoptimized
                  />
                </button>
              ))}
            </div>

            <div className="relative aspect-square flex-1 overflow-hidden rounded-lg bg-[#f7f7f7]">
              {gallery.length > 0 && (
                <Image
                  src={gallery[mainImageIndex] ?? gallery[0]}
                  alt={product.title}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  unoptimized
                />
              )}
            </div>
          </section>

          <section className="flex flex-col" aria-label="Информация о товаре">
            <h1
              className="text-[28px] font-semibold leading-tight text-[#221f1f] md:text-[32px]"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {currentVariant?.name ?? product.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-baseline gap-2">
              <span className="loom-promo-price text-[24px] md:text-[28px]">
                {formatPriceRub(price)}
              </span>
              {priceOld > price && (
                <span className="loom-promo-price text-[20px] line-through">
                  {formatPriceRub(priceOld)}
                </span>
              )}
            </div>

            {product.colors.length > 0 && (
              <div className="mt-8">
                <p
                  className="mb-2 text-[14px] font-medium text-[#221f1f]"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  Цвет:
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setSelectedColor(c);
                        setMainImageIndex(0);
                      }}
                      className={`rounded-lg border px-4 py-2.5 text-[14px] focus:outline-none ${
                        selectedColor === c
                          ? "border-[#221f1f] bg-[#221f1f] text-white"
                          : "border-[#c9c9c9] bg-white text-[#221f1f] hover:bg-[#f7f7f7]"
                      }`}
                      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                      aria-pressed={selectedColor === c}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.memoryOptionsGb.length > 0 && (
              <div className="mt-6">
                <p
                  className="mb-2 text-[14px] font-medium text-[#221f1f]"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  Память:
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.memoryOptionsGb.map((gb) => (
                    <button
                      key={gb}
                      type="button"
                      onClick={() => setSelectedMemoryGb(gb)}
                      className={`rounded-lg border px-4 py-2.5 text-[14px] focus:outline-none ${
                        selectedMemoryGb === gb
                          ? "border-[#221f1f] bg-[#221f1f] text-white"
                          : "border-[#c9c9c9] bg-white text-[#221f1f] hover:bg-[#f7f7f7]"
                      }`}
                      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                      aria-pressed={selectedMemoryGb === gb}
                    >
                      {gb} ГБ
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.storageOptions.length > 0 && (
              <div className="mt-6">
                <p
                  className="mb-2 text-[14px] font-medium text-[#221f1f]"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  Конфигурация:
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.storageOptions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedStorage(s)}
                      className={`rounded-lg border px-4 py-2.5 text-[14px] focus:outline-none ${
                        selectedStorage === s
                          ? "border-[#221f1f] bg-[#221f1f] text-white"
                          : "border-[#c9c9c9] bg-white text-[#221f1f] hover:bg-[#f7f7f7]"
                      }`}
                      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                      aria-pressed={selectedStorage === s}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.lteOptions.length > 0 && (
              <div className="mt-6">
                <p
                  className="mb-2 text-[14px] font-medium text-[#221f1f]"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  LTE:
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.lteOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSelectedLte(opt)}
                      className={`rounded-lg border px-4 py-2.5 text-[14px] focus:outline-none ${
                        selectedLte === opt
                          ? "border-[#221f1f] bg-[#221f1f] text-white"
                          : "border-[#c9c9c9] bg-white text-[#221f1f] hover:bg-[#f7f7f7]"
                      }`}
                      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                      aria-pressed={selectedLte === opt}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.simTypeOptions.length > 0 && (
              <div className="mt-6">
                <p
                  className="mb-2 text-[14px] font-medium text-[#221f1f]"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  Тип SIM:
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.simTypeOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSelectedSimType(opt)}
                      className={`rounded-lg border px-4 py-2.5 text-[14px] focus:outline-none ${
                        selectedSimType === opt
                          ? "border-[#221f1f] bg-[#221f1f] text-white"
                          : "border-[#c9c9c9] bg-white text-[#221f1f] hover:bg-[#f7f7f7]"
                      }`}
                      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                      aria-pressed={selectedSimType === opt}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="#cart"
                className="flex h-[48px] items-center justify-center rounded-lg bg-[#221f1f] px-6 py-3 text-[14px] font-normal uppercase leading-none text-white hover:bg-[#221f1f]/90 focus:outline-none"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                В КОРЗИНУ
              </Link>
              <Link
                href="#buy-one-click"
                className="flex h-[48px] items-center justify-center rounded-lg border border-[#c9c9c9] bg-white px-6 py-3 text-[14px] font-normal leading-none text-[#221f1f] hover:bg-[#f7f7f7] focus:outline-none"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Купить в 1 клик
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

