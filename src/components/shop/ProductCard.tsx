"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Eye, ShieldCheck, Sparkles } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    brand: string;
    category: string;
    basePrice: number;
    discountPrice?: number | null;
    shape?: string | null;
    material?: string | null;
    gender?: string | null;
    images: { url: string; altText?: string | null }[];
    variants?: { colorName: string; colorHex: string }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage =
    product.images[0]?.url ||
    "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80";
  const hoverImage = product.images[1]?.url || primaryImage;

  const currentPrice = product.discountPrice ?? product.basePrice;
  const hasDiscount = product.discountPrice && product.discountPrice < product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - product.discountPrice!) / product.basePrice) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {hasDiscount && (
          <span className="bg-[#F15A24] text-white text-[11px] font-bold px-2 py-0.5 rounded-md tracking-wider uppercase shadow-xs">
            Save {discountPercent}%
          </span>
        )}
        <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          Zero-Power Ready
        </span>
      </div>

      {/* Product Image Link */}
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/3] bg-slate-50 overflow-hidden">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {product.images[1] && (
          <Image
            src={hoverImage}
            alt={`${product.name} alternate view`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}
      </Link>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Brand & Category */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span className="font-semibold uppercase tracking-wider text-[#1B2A4A]">{product.brand}</span>
          {product.shape && (
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px] font-medium">
              {product.shape}
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/product/${product.slug}`} className="hover:text-[#F15A24] transition-colors">
          <h3 className="font-semibold text-slate-900 text-sm md:text-base line-clamp-1 mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Color swatches preview */}
        {product.variants && product.variants.length > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-[11px] text-slate-400">Colors:</span>
            {product.variants.map((v, idx) => (
              <span
                key={idx}
                title={v.colorName}
                style={{ backgroundColor: v.colorHex }}
                className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-xs inline-block"
              />
            ))}
          </div>
        )}

        {/* Price & Action */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Starting from</div>
            <div className="flex items-baseline gap-2">
              <span className="text-base md:text-lg font-bold text-[#1B2A4A]">
                {formatPrice(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.basePrice)}
                </span>
              )}
            </div>
          </div>

          <Link
            href={`/product/${product.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1B2A4A] text-white text-xs font-medium rounded-lg hover:bg-[#F15A24] transition-colors shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Options</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
