import Link from "next/link";
import Image from "next/image";

import { getProductsByCategory } from "@/lib/products-db";
import { getProductGalleryImages } from "@/lib/product-media";

export default async function AppleWatchCategoryPage() {
  const products = await getProductsByCategory("applewatch");

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1920px] px-4 py-6 md:px-6 md:py-8">
        <nav
          className="mb-4 text-[14px] text-[#878787]"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          aria-label="Хлебные крошки"
        >
          <Link href="/" className="hover:text-[#221f1f]">
            Главная
          </Link>
          <span className="mx-1">/</span>
          <span className="font-medium text-[#221f1f]">Apple Watch</span>
        </nav>

        <h1 className="loom-promo-section-title mb-8">Apple Watch</h1>

        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3">
          {products.map((p) => {
            const firstColor = p.colors[0] ?? null;
            const preview =
              firstColor != null
                ? getProductGalleryImages({
                    category: p.category,
                    title: p.title,
                    color: firstColor,
                  })[0] ?? null
                : null;

            return (
              <li key={p.productId}>
                <Link
                  href={`/product/${p.slug}`}
                  className="flex h-full flex-col overflow-hidden rounded-lg border border-[#e4e4e4] bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative h-[140px] w-full shrink-0 overflow-hidden rounded-t-lg bg-[#f7f7f7] px-4 pt-4">
                    {preview && (
                      <Image
                        src={preview}
                        alt={p.title}
                        fill
                        className="object-contain object-center"
                        sizes="(max-width: 640px) 50vw, 33vw"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-1 p-4 pt-3 text-center">
                    <h2
                      className="text-[15px] font-normal leading-tight text-[#221f1f]"
                      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                      {p.title}
                    </h2>
                    <p
                      className="text-[13px] font-normal text-[#949494]"
                      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                      {p.colors.length > 0 ? `${p.colors.length} цветов` : "В наличии"}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

