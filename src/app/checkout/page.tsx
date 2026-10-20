"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { formatPrice, calculateShipping, PAKISTAN_CITIES } from "@/lib/utils";
import { validatePromoCode, PromoResult } from "@/lib/promo";
import { STORE_INFO, FREE_ACCESSORIES_NOTE } from "@/lib/constants";
import {
  ShieldCheck,
  Truck,
  Sparkles,
  Tag,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
  ArrowRight,
  MapPin,
  Phone,
  User,
  Home,
  MessageSquare,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, getSubtotal } = useCartStore();

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    city: "Mianwali (Local Delivery)",
    address: "",
    orderNotes: "",
  });

  const [promoInput, setPromoInput] = useState("");
  const [promoResult, setPromoResult] = useState<PromoResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const subtotal = getSubtotal();
  const rawShipping = calculateShipping(subtotal);
  const shippingFee = promoResult?.isFreeShipping ? 0 : rawShipping;
  const discountAmount = promoResult?.discount ?? 0;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const res = validatePromoCode(promoInput, subtotal);
    setPromoResult(res);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (items.length === 0) {
      setErrorMessage("Your cart is empty. Please add items before checking out.");
      return;
    }

    if (!formData.customerName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMessage("Please fill in your name, contact phone number, and delivery address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.customerName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || null,
          city: formData.city,
          address: formData.address.trim(),
          orderNotes: formData.orderNotes.trim() || null,
          subtotal,
          shippingFee,
          discountCode: promoResult?.valid ? promoResult.code : null,
          discountAmount,
          totalAmount,
          items: items.map((i) => ({
            productId: i.productId,
            productName: i.name,
            brandName: i.brand,
            selectedColor: i.selectedColor || null,
            lensOption: i.lensOption,
            lensPrice: i.lensPrice,
            unitPrice: i.unitPrice,
            quantity: i.quantity,
            totalPrice: (i.unitPrice + i.lensPrice) * i.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to place order.");
      }

      // Clear Zustand cart upon successful order creation
      clearCart();

      // Redirect immediately to order success confirmation page
      router.push(`/order-success/${data.orderId}`);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md w-full shadow-xs mx-4">
          <div className="w-16 h-16 bg-orange-50 text-[#F15A24] rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Your Shopping Cart is Empty</h2>
          <p className="text-slate-500 text-xs sm:text-sm mb-6">
            Looks like you haven&apos;t added any eyeglasses or sunglasses yet.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1B2A4A] text-white text-xs font-semibold rounded-xl hover:bg-[#F15A24] transition-colors"
          >
            <span>Explore Eyewear Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A4A]">
            Checkout & Cash on Delivery (COD)
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Complete your order below. 100% on-site confirmation. Pay cash to the courier at your doorstep.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Customer & Delivery Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-[#1B2A4A] font-bold text-base pb-3 border-b border-slate-100">
                <User className="w-5 h-5 text-[#F15A24]" />
                <span>Customer & Contact Information</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Usman Khan"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Phone / Mobile (03XX-XXXXXXX) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="0300-1234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24]"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">Used for rider parcel delivery SMS/Call</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="name@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24]"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">For automated tracking updates</span>
                </div>
              </div>
            </div>

            {/* Delivery Destination */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-[#1B2A4A] font-bold text-base pb-3 border-b border-slate-100">
                <MapPin className="w-5 h-5 text-[#F15A24]" />
                <span>Delivery Address in Pakistan</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Destination City <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-hidden focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24]"
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Complete Street Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="House / Flat #, Street #, Sector / Colony, Near Landmark"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Order Notes / Special Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Call before delivery / Deliver after 2 PM"
                  value={formData.orderNotes}
                  onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24]"
                />
              </div>
            </div>

            {/* Payment Method Notice */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-start gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Payment Method: Cash on Delivery (COD)
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  No online card or bank transfer required upfront. Inspect your Hassan Optics parcel and pay cash to the TCS / Leopards courier rider when delivered.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Confirmation */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <h3 className="font-bold text-[#1B2A4A] text-base pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs text-slate-500 font-normal">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              </h3>

              {/* Items List */}
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      {item.image && (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs text-slate-900 truncate">{item.name}</h4>
                      <p className="text-[11px] text-slate-500">
                        {item.selectedColor && `${item.selectedColor}`}
                        {item.selectedColor && item.lensOption && !["Standard Pack", "Standard", "None"].includes(item.lensOption) && " • "}
                        {item.lensOption && !["Standard Pack", "Standard", "None"].includes(item.lensOption) && item.lensOption}
                      </p>
                      <div className="text-[11px] font-medium text-slate-400">
                        Qty: {item.quantity} × {formatPrice(item.unitPrice + item.lensPrice)}
                      </div>
                    </div>
                    <div className="text-right text-xs font-bold text-slate-900">
                      {formatPrice((item.unitPrice + item.lensPrice) * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Free Accessories Callout */}
              <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-2xl flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#F15A24] shrink-0" />
                <div className="text-xs text-slate-700">
                  <span className="font-bold text-slate-900">Free Accessories Included:</span>
                  <div className="text-[11px] text-slate-600">
                    Protective hard case &amp; cloth for eyewear • Sterile storage case for contact lenses
                  </div>
                </div>
              </div>

              {/* Promo Code Box */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Have a Promo Code?
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. WELCOME500 or MIANWALI"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs uppercase font-medium focus:outline-hidden focus:border-[#F15A24]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-[#1B2A4A] text-white text-xs font-semibold rounded-xl hover:bg-[#F15A24] transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </div>
                {promoResult && (
                  <p
                    className={`text-xs mt-1.5 ${
                      promoResult.valid ? "text-emerald-600 font-semibold" : "text-red-500"
                    }`}
                  >
                    {promoResult.message}
                  </p>
                )}
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({promoResult?.code}):</span>
                    <span>- {formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span>Nationwide Courier Shipping:</span>
                  {shippingFee === 0 ? (
                    <span className="font-bold text-emerald-600">FREE</span>
                  ) : (
                    <span className="font-semibold text-slate-900">{formatPrice(shippingFee)}</span>
                  )}
                </div>

                {shippingFee > 0 && subtotal < 3000 && (
                  <p className="text-[11px] text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
                    💡 Add {formatPrice(3000 - subtotal)} more to get <strong>100% FREE delivery!</strong>
                  </p>
                )}

                <div className="flex justify-between text-base font-extrabold text-[#1B2A4A] pt-3 border-t border-slate-200">
                  <span>Total Due (COD):</span>
                  <span className="text-xl text-[#F15A24]">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#F15A24] hover:bg-[#d94b1a] text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-orange-950/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01]"
              >
                <span>{isSubmitting ? "Confirming Order..." : "Confirm Cash on Delivery Order"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% On-Site Secured • No WhatsApp Checkout Required</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
