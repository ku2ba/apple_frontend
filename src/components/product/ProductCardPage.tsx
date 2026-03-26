import { notFound } from "next/navigation";
import { ProductCardClient } from "@/components/product/ProductCardClient";
import { getProductBySlug } from "@/lib/products-db";
import { getProductGalleryImages } from "@/lib/product-media";

export async function ProductCardPage({
  slug,
  initialColor,
}: {
  slug: string;
  initialColor?: string;
}) {
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const galleryByColor: Record<string, string[]> = {};
  for (const color of product.colors) {
    galleryByColor[color] = getProductGalleryImages({
      category: product.category,
      title: product.title,
      color,
    });
  }

  return (
    <ProductCardClient
      product={product}
      galleryByColor={galleryByColor}
      initialColor={initialColor}
    />
  );
}
