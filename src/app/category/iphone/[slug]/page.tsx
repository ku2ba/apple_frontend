import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products-db";
import { getProductGalleryImages } from "@/lib/product-media";
import { IphoneModelCardsClient } from "@/components/product/IphoneModelCardsClient";

type Props = { params: Promise<{ slug: string }> };

export default async function IphoneModelPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.category !== "iphone") notFound();

  const galleryByColor: Record<string, string[]> = {};
  for (const color of product.colors) {
    galleryByColor[color] = getProductGalleryImages({
      category: product.category,
      title: product.title,
      color,
    });
  }

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
          <Link href="/category/iphone" className="hover:text-[#221f1f]">
            iPhone
          </Link>
          <span className="mx-1">/</span>
          <span className="font-medium text-[#221f1f]">{product.title}</span>
        </nav>

        <h1
          className="loom-promo-section-title mb-8"
          style={{ fontFamily: "var(--font-charito), sans-serif" }}
        >
          {product.title}
        </h1>

        <IphoneModelCardsClient product={product} galleryByColor={galleryByColor} />
      </div>
    </div>
  );
}
