"use client";

import { useCartStore } from "@/lib/store";
import { formatPrice, FREE_SHIPPING_THRESHOLD, calculateShipping } from "@/lib/utils";
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartDrawer() {
  const { isCartOpen, closeCart, items, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isCartOpen) return null;

  const subtotal = getSubtotal();
  const shippingFee = calculateShipping(subtotal);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden print:hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-navy-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-navy-900" />
              <h2 className="font-extrabold text-lg text-navy-900">Your Shopping Cart</h2>
              <span className="text-xs bg-navy-100 text-navy-900 font-bold px-2 py-0.5 rounded-full">
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-slate-400 hover:text-navy-900 hover:bg-slate-200/50 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="p-4 bg-orange-50/50 border-b border-orange-100 text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="text-slate-700 font-medium">
                Add <span className="font-bold text-orange-600">{formatPrice(remainingForFreeShipping)}</span> more to qualify for <span className="font-bold text-navy-900">FREE Nationwide Delivery</span>!
              </p>
            ) : (
              <p className="text-emerald-700 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                🎉 You have unlocked FREE Nationwide Delivery!
              </p>
            )}
            <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-orange-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Your cart is empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Discover our stylish ready-to-wear frames, blue-cut computer specs, and sunglasses.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="mt-5 inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold px-5 py-3 rounded-xl transition"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 bg-white shadow-2xs flex gap-3 transition"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <span className="text-[11px] font-bold text-orange-600 tracking-wider uppercase">
                          {item.brand}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-red-500 transition p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="text-xs font-bold text-navy-900 truncate">
                        {item.name}
                      </h4>

                      {/* Add-on pills */}
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.selectedColor && (
                          <span className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md">
                            Color: {item.selectedColor}
                          </span>
                        )}
                        {item.lensOption && !["Standard Pack", "Standard", "None"].includes(item.lensOption) && (
                          <span className="text-[10px] bg-navy-50 text-navy-800 font-semibold px-2 py-0.5 rounded-md border border-navy-100">
                            {item.lensOption}
                            {item.lensPrice > 0 && ` (+${formatPrice(item.lensPrice)})`}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Item Subtotal */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 transition font-bold"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-bold text-navy-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 transition font-bold"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-extrabold text-navy-900">
                          {formatPrice((item.unitPrice + item.lensPrice) * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Trigger */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50/70 space-y-3">
              {/* Included Accessories Badge */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-2.5 flex items-center gap-2.5 text-[11px] text-emerald-800">
                <Package className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Included Free:</strong> Hard Protective Case + Microfiber Cleaning Cloth.
                </span>
              </div>

              {/* Bill breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Nationwide Shipping</span>
                  {shippingFee === 0 ? (
                    <span className="font-bold text-emerald-600">FREE (Orders &ge; Rs. 3,000)</span>
                  ) : (
                    <span className="font-semibold text-slate-900">{formatPrice(shippingFee)}</span>
                  )}
                </div>
                <div className="flex justify-between text-sm font-extrabold text-navy-900 pt-2 border-t border-slate-200">
                  <span>Total Bill (COD)</span>
                  <span className="text-base text-orange-600">{formatPrice(subtotal + shippingFee)}</span>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition duration-200 active:scale-98"
              >
                <span>Proceed to On-Site Checkout</span>
                <ArrowRight className="w-4 h-4 text-orange-400" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
