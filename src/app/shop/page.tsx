import prisma from "@/lib/prisma";
import ProductCard from "@/components/shop/ProductCard";
import Link from "next/link";
import { SlidersHorizontal, Glasses, Search } from "lucide-react";

export const dynamic = "force-dynamic";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    shape?: string;
    gender?: string;
    sort?: string;
    search?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const { category, shape, gender, sort, search } = params;

  const whereClause: any = {};
  if (category) whereClause.category = category;
  if (shape) whereClause.shape = shape;
  if (gender) whereClause.gender = gender;
  if (search) {
    whereClause.OR = [
      { name: { contains: search } },
      { brand: { contains: search } },
      { description: { contains: search } },
      { material: { contains: search } },
    ];
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-low") orderBy = { basePrice: "asc" };
  if (sort === "price-high") orderBy = { basePrice: "desc" };

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      images: { orderBy: { isPrimary: "desc" } },
      variants: true,
    },
    orderBy,
  });

  const shapes = ["Rectangle", "Square", "Round", "Aviator", "Cat Eye", "Geometric"];
  const genders = ["Men", "Women", "Unisex"];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link href="/" className="hover:text-[#F15A24]">Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Eyewear Catalog</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A4A]">
                {category === "eyeglasses"
                  ? "Zero-Power Eyeglasses & Frames"
                  : category === "sunglasses"
                  ? "Designer Sunglasses Collection"
                  : category === "contact-lenses"
                  ? "Cosmetic & Clear Contact Lenses"
                  : "All Eyewear Products"}
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Showing {products.length} ready-to-wear items with free protective hard case & nationwide COD.
              </p>
            </div>

            {/* Search & Quick Links */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <form method="GET" action="/shop" className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  name="search"
                  defaultValue={search || ""}
                  placeholder="Search Ray-Ban, Dior..."
                  className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:border-[#F15A24] w-full sm:w-48"
                />
              </form>

              <Link
                href="/face-shape-guide"
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-orange-100 text-[#F15A24] hover:bg-orange-200 transition-colors inline-flex items-center justify-center gap-1.5"
              >
                <Glasses className="w-4 h-4" />
                <span>Face Shape Guide</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-8 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1 mr-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#F15A24]" />
            Filter:
          </span>

          <Link
            href="/shop"
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              !category && !shape && !gender
                ? "bg-[#1B2A4A] text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All Items
          </Link>

          <Link
            href="/shop?category=eyeglasses"
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              category === "eyeglasses"
                ? "bg-[#1B2A4A] text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Eyeglasses
          </Link>

          <Link
            href="/shop?category=sunglasses"
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              category === "sunglasses"
                ? "bg-[#1B2A4A] text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Sunglasses
          </Link>

          <Link
            href="/shop?category=contact-lenses"
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              category === "contact-lenses"
                ? "bg-[#1B2A4A] text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Contact Lenses
          </Link>

          <div className="hidden md:block w-px h-5 bg-slate-200 mx-2" />

          {/* Shapes dropdown/pills */}
          {shapes.map((s) => (
            <Link
              key={s}
              href={`/shop?${category ? `category=${category}&` : ""}shape=${s}`}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors hidden sm:inline-block ${
                shape === s
                  ? "bg-[#F15A24] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {s}
            </Link>
          ))}
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8">
            <Glasses className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No frames match your filter</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
              Try resetting your filters to explore our full ready-to-wear inventory.
            </p>
            <Link
              href="/shop"
              className="mt-4 inline-block px-5 py-2.5 bg-[#1B2A4A] text-white text-xs font-semibold rounded-lg hover:bg-[#F15A24] transition-colors"
            >
              Reset All Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
