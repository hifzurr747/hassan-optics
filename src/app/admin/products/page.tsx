import prisma from "@/lib/prisma";
import Link from "next/link";
import ProductRow from "./ProductRow";
import { PlusCircle, Search } from "lucide-react";

export const dynamic = "force-dynamic";

interface AdminProductsPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const params = await searchParams;
  const { category } = params;

  const whereClause: any = {};
  if (category) whereClause.category = category;

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      images: { orderBy: { isPrimary: "desc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1B2A4A]">Products & Stock Inventory</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Total {products.length} products listed. Edit inventory units or add new optical frames.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F15A24] text-white text-xs font-bold rounded-xl hover:bg-[#d94b1a] transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 text-xs">
        <Link
          href="/admin/products"
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            !category ? "bg-[#1B2A4A] text-white" : "bg-white text-slate-700 hover:bg-slate-200"
          }`}
        >
          All
        </Link>
        <Link
          href="/admin/products?category=eyeglasses"
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            category === "eyeglasses" ? "bg-[#1B2A4A] text-white" : "bg-white text-slate-700 hover:bg-slate-200"
          }`}
        >
          Eyeglasses
        </Link>
        <Link
          href="/admin/products?category=sunglasses"
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            category === "sunglasses" ? "bg-[#1B2A4A] text-white" : "bg-white text-slate-700 hover:bg-slate-200"
          }`}
        >
          Sunglasses
        </Link>
        <Link
          href="/admin/products?category=contact-lenses"
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            category === "contact-lenses" ? "bg-[#1B2A4A] text-white" : "bg-white text-slate-700 hover:bg-slate-200"
          }`}
        >
          Contact Lenses
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-6">Product & Brand</th>
                <th className="py-3.5 px-4">Base Price (PKR)</th>
                <th className="py-3.5 px-4">Available Stock</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {products.map((p) => (
                <ProductRow key={p.id} product={p} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
