import HeroSlider from "@/components/home/HeroSlider";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import StoreLocationCTA from "@/components/home/StoreLocationCTA";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSlider />
      <CategoryGrid />
      <FeaturedProducts />
      <WhyChooseUs />
      <StoreLocationCTA />
    </div>
  );
}
