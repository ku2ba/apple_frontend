import Image from "next/image";
import { images } from "@/lib/assets";

export function BannerSection() {
  return (
    <section className="w-full overflow-hidden">
      <div className="relative aspect-[1919/1050] min-h-[300px] w-full overflow-hidden bg-[#f7f7f7]">
        <Image
          src={images.heroMain}
          alt="Apple Watch — премиум часы"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority={false}
        />
      </div>
    </section>
  );
}
