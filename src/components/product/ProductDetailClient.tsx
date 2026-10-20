"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { STORE_INFO, FREE_ACCESSORIES_NOTE } from "@/lib/constants";
import SizeGuideModal from "@/components/product/SizeGuideModal";
import ProductReviews from "@/components/product/ProductReviews";
import ProductCard from "@/components/shop/ProductCard";
import {
  ShieldCheck,
  Truck,
  Sparkles,
  ShoppingBag,
  Zap,
  Check,
  Ruler,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Info,
} from "lucide-react";

interface LensOption {
  id: string;
  name: string;
  price: number;
  badge?: string | null;
  description: string;
}

interface ProductVariant {
  id: string;
  colorName: string;
  colorHex: string;
  stock: number;
}

interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
}

interface ProductDetailClientProps {
  product: {
    id: string;
    slug: string;
    name: string;
    brand: string;
    category: string;
    basePrice: number;
    discountPrice?: number | null;
    description: string;
    frameType?: string | null;
    shape?: string | null;
    material?: string | null;
    gender?: string | null;
    sizeCategory?: string | null;
    lensWidth?: number | null;
    bridgeWidth?: number | null;
    templeLength?: number | null;
    stockQuantity: number;
    images: ProductImage[];
    variants: ProductVariant[];
  };
  lensOptions: LensOption[];
  relatedProducts?: any[];
}

export default function ProductDetailClient({
  product,
  lensOptions,
  relatedProducts = [],
}: ProductDetailClientProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const isEyeglasses = product.category === "eyeglasses";
  const isSunglasses = product.category === "sunglasses";
  const isContactLenses = product.category === "contact-lenses";

  // States
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.variants[0]?.colorName || "Standard"
  );

  // Default lens selection:
  // ONLY eyeglasses get the zero-power frame lens selector options.
  const defaultEyeglassLens =
    lensOptions.find((l) => l.name.includes("Blue Cut")) ||
    lensOptions[0] || {
      id: "demo",
      name: "Frame Only",
      price: 0,
      description: "Standard demo lenses",
    };

  const defaultNonEyeglassLens: LensOption = isSunglasses
    ? {
        id: "sunglasses-standard",
        name: "UV400 Polarized (Included)",
        price: 0,
        description: "100% UV Protection & Anti-Glare Shield",
      }
    : {
        id: "contact-standard",
        name: "Standard Pack",
        price: 0,
        description: "Original factory-sealed packaging",
      };

  const [selectedLens, setSelectedLens] = useState<LensOption>(
    isEyeglasses ? defaultEyeglassLens : defaultNonEyeglassLens
  );

  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const activePrice = product.discountPrice ?? product.basePrice;
  const lensPrice = isEyeglasses ? selectedLens.price : 0;
  const totalPrice = (activePrice + lensPrice) * quantity;
  const hasDiscount = product.discountPrice && product.discountPrice < product.basePrice;

  const handleAddToCart = (redirectAfter = false) => {
    setIsAdding(true);
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      image: product.images[0]?.url || "",
      selectedColor: product.variants.length > 0 ? selectedColor : undefined,
      lensOption: isEyeglasses
        ? selectedLens.name
        : isSunglasses
        ? "UV400 Polarized (Included)"
        : "Standard Pack",
      lensPrice: isEyeglasses ? selectedLens.price : 0,
      unitPrice: activePrice,
      quantity,
    });

    setTimeout(() => {
      setIsAdding(false);
      if (redirectAfter) {
        router.push("/checkout");
      }
    }, 200);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-4 sm:py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#F15A24]">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#F15A24]">Shop</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-xs">
          {/* Images Column */}
          <div className="lg:col-span-6 space-y-4">
            {/* Primary Display */}
            <div className="relative aspect-square sm:aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <Image
                src={
                  product.images[selectedImage]?.url ||
                  "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80"
                }
                alt={product.name}
                fill
                priority
                className="object-cover object-center"
              />
              {hasDiscount && (
                <div className="absolute top-4 left-4 bg-[#F15A24] text-white text-xs font-bold px-3 py-1 rounded-md shadow-sm">
                  SALE
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === idx
                        ? "border-[#F15A24] ring-2 ring-[#F15A24]/20"
                        : "border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.altText || `View ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Free Accessories Box */}
            {isContactLenses ? (
              <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#F15A24] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                    Free Antimicrobial Lens Case Included
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Every order includes a sterile leakproof contact lens storage case automatically at Rs. 0.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#F15A24] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                    {FREE_ACCESSORIES_NOTE.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Magnetic protective hard case + ultra-fine scratchless cloth included in every parcel automatically at Rs. 0.
                  </p>
                </div>
              </div>
            )}

            {/* Prescription Store Visit Callout */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-start justify-between gap-3 shadow-md">
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {isContactLenses ? "Need Prescription Contact Lenses?" : "Need Optical Power Cutting?"}
                </div>
                <p className="text-xs text-slate-300">
                  {isContactLenses
                    ? "We test cornea curvature and eyesight computerized in our Faisal Plaza, Mianwali store for customized vision."
                    : "We test eyes computerized in our Faisal Plaza, Mianwali store. Online frames are Zero-Power / Screen Protection."}
                </p>
              </div>
              <Link
                href="/book-eye-test"
                className="shrink-0 px-3 py-2 bg-white/10 hover:bg-[#F15A24] text-white text-xs font-semibold rounded-lg transition-colors border border-white/15"
              >
                Book Test
              </Link>
            </div>
          </div>

          {/* Details & Options Column */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            {/* Title & Brand */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F15A24]">
                  {product.brand}
                </span>
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                  In Stock ({product.stockQuantity} available)
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A4A] tracking-tight">
                {product.name}
              </h1>
            </div>

            {/* Price Display */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">
                  {isEyeglasses
                    ? "Total Price (Frame + Lens):"
                    : isSunglasses
                    ? "Total Price (Frame + UV Lenses):"
                    : "Total Price:"}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#1B2A4A]">
                    {formatPrice(totalPrice)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-slate-400 line-through">
                      {formatPrice(
                        (product.basePrice + (isEyeglasses ? selectedLens.price : 0)) * quantity
                      )}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-emerald-600 block">
                  {totalPrice >= 3000 ? "FREE Nationwide Delivery" : "Flat Rs. 250 Delivery"}
                </span>
                <span className="text-[11px] text-slate-400">Cash on Delivery (COD)</span>
              </div>
            </div>

            {/* Color Variant Selection */}
            {product.variants.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-800">
                    Selected Color: <span className="text-[#F15A24]">{selectedColor}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v) => {
                    const isSelected = selectedColor === v.colorName;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedColor(v.colorName)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                          isSelected
                            ? "border-[#1B2A4A] bg-[#1B2A4A] text-white shadow-xs"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span
                          style={{ backgroundColor: v.colorHex }}
                          className="w-3.5 h-3.5 rounded-full border border-white/50 shrink-0 shadow-2xs"
                        />
                        <span>{v.colorName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 1-Click Zero-Power Lens Add-on Selector (ONLY for Eyeglasses) */}
            {isEyeglasses && lensOptions.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#F15A24]" />
                    Choose Zero-Power Lens Option:
                  </span>
                  <span className="text-[11px] text-slate-400">Zero power • Ready to wear</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {lensOptions.map((lens) => {
                    const isSelected = selectedLens.id === lens.id;
                    return (
                      <button
                        key={lens.id}
                        type="button"
                        onClick={() => setSelectedLens(lens)}
                        className={`text-left p-3 rounded-xl border transition-all relative flex flex-col justify-between ${
                          isSelected
                            ? "border-[#1B2A4A] bg-blue-50/50 ring-2 ring-[#1B2A4A]/20"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <span className="font-bold text-xs text-slate-900 leading-tight">
                            {lens.name}
                          </span>
                          {lens.badge && (
                            <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-[#F15A24]">
                              {lens.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mb-2">
                          {lens.description}
                        </p>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                          <span className="font-semibold text-slate-700">
                            {lens.price === 0 ? "Included (+Rs. 0)" : `+ ${formatPrice(lens.price)}`}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-[#1B2A4A]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Frame Dimensions & Size Guide Trigger */}
            {(isEyeglasses || isSunglasses) && (product.lensWidth || product.bridgeWidth || product.templeLength) ? (
              <div className="pt-2 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  {product.lensWidth && <span>Lens: <strong>{product.lensWidth}mm</strong></span>}
                  {product.bridgeWidth && <span>Bridge: <strong>{product.bridgeWidth}mm</strong></span>}
                  {product.templeLength && <span>Temple: <strong>{product.templeLength}mm</strong></span>}
                </div>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1 text-[#F15A24] font-semibold hover:underline"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide</span>
                </button>
              </div>
            ) : isContactLenses ? (
              <div className="pt-2 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Sterile & Sealed Eye Care</span>
                </div>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full text-[11px]">
                  Ready to Dispatch
                </span>
              </div>
            ) : null}

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold text-slate-900 w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Virtual Try-On Button (Only for Eyeglasses and Sunglasses) */}
              {product.category !== "contact-lenses" && (
                <Link
                  href={`/virtual-try-on?frame=${product.slug}`}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 hover:from-orange-100 hover:to-amber-100 text-[#F15A24] font-extrabold text-xs sm:text-sm rounded-xl border border-orange-200 shadow-xs hover:shadow-md transition-all group"
                >
                  <Sparkles className="w-4 h-4 text-[#F15A24] group-hover:rotate-12 transition-transform" />
                  <span>👓 Try On Your Face (Virtual Mirror)</span>
                </Link>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleAddToCart(false)}
                  disabled={isAdding}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1B2A4A] text-white font-bold text-sm rounded-xl hover:bg-[#15223c] transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isAdding ? "Adding..." : "Add to Cart"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddToCart(true)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#F15A24] text-white font-bold text-sm rounded-xl hover:bg-[#d94b1a] transition-all shadow-md hover:shadow-lg shadow-orange-950/20"
                >
                  <Zap className="w-4 h-4" />
                  <span>Buy Now (Cash on Delivery)</span>
                </button>
              </div>
            </div>

            {/* Description & Specifications Accordion */}
            <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-600">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Product Description</h4>
                <p className="leading-relaxed">{product.description}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="text-slate-400 text-[10px]">{isContactLenses ? "Formula / Type" : "Material"}</div>
                  <div className="font-semibold text-slate-800">
                    {product.material || (isContactLenses ? "HydraGlyde Formula" : "Premium Acetate")}
                  </div>
                </div>
                {product.shape ? (
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div className="text-slate-400 text-[10px]">Shape</div>
                    <div className="font-semibold text-slate-800">{product.shape}</div>
                  </div>
                ) : isContactLenses ? (
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div className="text-slate-400 text-[10px]">Compatibility</div>
                    <div className="font-semibold text-slate-800">All Soft Contact Lenses</div>
                  </div>
                ) : null}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="text-slate-400 text-[10px]">Gender / Fit</div>
                  <div className="font-semibold text-slate-800">{product.gender || "Unisex"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <ProductReviews productName={product.name} />

        {/* Similar Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F15A24]">
                  More from Hassan Optics
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#1B2A4A] mt-0.5">
                  {isContactLenses
                    ? "More Contact Lenses & Solutions"
                    : isSunglasses
                    ? "Similar Sunglasses You May Like"
                    : "Similar Frames You May Like"}
                </h3>
              </div>
              <Link
                href={`/shop?category=${product.category}`}
                className="text-xs font-semibold text-[#1B2A4A] hover:text-[#F15A24] inline-flex items-center gap-1 transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

        {/* Size Guide Modal */}
        <SizeGuideModal
          isOpen={isSizeGuideOpen}
          onClose={() => setIsSizeGuideOpen(false)}
          lensWidth={product.lensWidth}
          bridgeWidth={product.bridgeWidth}
          templeLength={product.templeLength}
        />
      </div>
    </div>
  );
}
