import Link from "next/link";
import Image from "next/image";
import { getMacbookLines } from "@/lib/macbook-models";
import { cn } from "@/lib/utils";

function pluralize(n: number) {
  if (n === 1) return "товар";
  if (n >= 2 && n <= 4) return "товара";
  return "товаров";
}

export default function MacbookCategoryPage() {
  const lines = getMacbookLines();

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
          <span className="font-medium text-[#221f1f]">MacBook и iMac</span>
        </nav>

        <h1 className="loom-promo-section-title mb-8">MacBook и iMac</h1>

        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3">
          {lines.map((line) => (
            <li key={line.slug}>
              <Link
                href={`/category/macbook/${line.slug}`}
                className={cn(
                  "flex h-full flex-col overflow-hidden rounded-lg border border-[#e4e4e4] bg-white shadow-sm transition-shadow hover:shadow-md"
                )}
              >
                <div className="relative h-[140px] w-full shrink-0 overflow-hidden rounded-t-lg bg-[#f7f7f7] px-4 pt-4">
                  <Image
                    src={line.previewUrl ?? "/main/iPhone_main.png"}
                    alt={line.lineName}
                    fill
                    className="object-contain object-center"
                    sizes="(max-width: 640px) 50vw, 33vw"
                    unoptimized
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center gap-1 p-4 pt-3 text-center">
                  <h2
                    className="text-[15px] font-normal leading-tight text-[#221f1f]"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    {line.lineName}
                  </h2>
                  <p
                    className="text-[13px] font-normal text-[#949494]"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    {line.count} {pluralize(line.count)}
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
