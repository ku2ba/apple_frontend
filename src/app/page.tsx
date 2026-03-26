import { MainSection } from "@/components/main/MainSection";
import { CategoryNavSection } from "@/components/main/CategoryNavSection";
import { PromoProductsSection } from "@/components/main/PromoProductsSection";
import { VideoSection } from "@/components/main/VideoSection";
import { ArticlesSection } from "@/components/main/ArticlesSection";
import { ReviewsSection } from "@/components/main/ReviewsSection";

export default function Home() {
  return (
    <>
      <MainSection />
      <CategoryNavSection />
      <PromoProductsSection />
      <VideoSection />
      <ArticlesSection />
      <ReviewsSection />
    </>
  );
}
