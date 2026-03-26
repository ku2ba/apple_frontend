import Link from "next/link";
import Image from "next/image";
import {
  MODELS,
  getColorsForModel,
  getPreviewImageForIphoneModel,
  getImagesForModelColor,
  getPlaceholderImageBasePath,
} from "@/lib/iphone-models";
import { cn } from "@/lib/utils";

function pluralize(n: number) {
  if (n === 1) return "товар";
  if (n >= 2 && n <= 4) return "товара";
  return "товаров";
}

const NEW_MODELS = new Set([
  "iphone-17-pro-max",
  "iphone-17-pro",
  "iphone-17",
  "iphone-air",
]);
const HIT_MODELS = new Set(["iphone-16-pro-max", "iphone-16-pro"]);

export default function IphoneCategoryPage() {
  const models = Object.entries(MODELS).map(([slug, { title }]) => {
    const colors = getColorsForModel(slug);
    const count = colors.length * 2; // 256 ГБ и 512 ГБ
    const preview = getPreviewImageForIphoneModel(slug);
    const firstImage =
      preview ??
      (colors.length > 0
        ? getImagesForModelColor(slug, colors[0])[0]
        : getPlaceholderImageBasePath());
    return {
      slug,
      title,
      count,
      image: firstImage,
      label: NEW_MODELS.has(slug)
        ? ("Новинка" as const)
        : HIT_MODELS.has(slug)
          ? ("Хит" as const)
          : null,
    };
  });

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
          <span className="font-medium text-[#221f1f]">iPhone</span>
        </nav>

        <h1 className="loom-promo-section-title mb-8">iPhone</h1>

        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3">
          {models.map((model) => (
            <li key={model.slug}>
              <Link
                href={`/category/iphone/${model.slug}`}
                className={cn(
                  "flex h-full flex-col overflow-hidden rounded-lg border border-[#e4e4e4] bg-white shadow-sm transition-shadow hover:shadow-md"
                )}
              >
                <div className="relative h-[140px] w-full shrink-0 overflow-hidden rounded-t-lg bg-[#f7f7f7] px-4 pt-4">
                  <Image
                    src={model.image}
                    alt={model.title}
                    fill
                    className="object-contain object-center"
                    sizes="(max-width: 640px) 50vw, 33vw"
                    unoptimized
                  />
                  {model.label && (
                    <span
                      className="absolute right-2 top-2 rounded-md bg-[#221f1f] px-2.5 py-0.5 text-[12px] font-medium uppercase leading-none text-white"
                      style={{ fontFamily: "var(--font-etude), sans-serif" }}
                    >
                      {model.label}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-center gap-1 p-4 pt-3 text-center">
                  <h2
                    className="text-[15px] font-normal leading-tight text-[#221f1f]"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    {model.title}
                  </h2>
                  <p
                    className="text-[13px] font-normal text-[#949494]"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    {model.count} {pluralize(model.count)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
