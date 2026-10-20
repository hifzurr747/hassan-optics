import prisma from "@/lib/prisma";
import ProductCard from "@/components/shop/ProductCard";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default async function FeaturedProducts() {
  const featured = await prisma.product.findMany({
    where: { isFeatured: true },
    include: {
      images: { orderBy: { isPrimary: "desc" } },
      variants: true,
    },
    take: 8,
  });

  if (featured.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F15A24] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trending in Mianwali & Nationwide</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A4A]">
              Featured Eyewear Collections
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              Handpicked premium frames with instant 1-click zero-power blue cut or anti-glare lenses.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B2A4A] hover:text-[#F15A24] transition-colors"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
