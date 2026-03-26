import { ProductCardPage } from "@/components/product/ProductCardPage";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = (await searchParams) ?? {};
  const colorParamRaw = sp.color;
  const color =
    typeof colorParamRaw === "string"
      ? colorParamRaw
      : Array.isArray(colorParamRaw)
        ? colorParamRaw[0]
        : undefined;

  return <ProductCardPage slug={slug} initialColor={color} />;
}
