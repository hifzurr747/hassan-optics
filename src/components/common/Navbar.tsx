"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, MapPin, Calendar, Search, Glasses } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { STORE_INFO } from "@/lib/constants";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const openCart = useCartStore((state) => state.openCart);
  const getItemCount = useCartStore((state) => state.getItemCount);

  useEffect(() => {
    useCartStore.persist.rehydrate();
    setMounted(true);
  }, []);

  const itemCount = mounted ? getItemCount() : 0;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Eyeglasses", href: "/shop?category=eyeglasses" },
    { name: "Sunglasses", href: "/sunglasses" },
    { name: "Contact Lenses", href: "/contact-lenses" },
    { name: "Face Shape Guide", href: "/face-shape-guide" },
    { name: "Book Eye Test", href: "/book-eye-test", highlight: true },
    { name: "Track Order", href: "/track-order" },
    { name: "Store Locator", href: "/store-locator" },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs print:hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-navy-900 flex items-center justify-center text-white shadow-md group-hover:bg-navy-800 transition shrink-0">
              <Glasses className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-base sm:text-2xl tracking-tight text-navy-900 group-hover:text-navy-800 transition block truncate">
                HASSAN <span className="text-orange-500">OPTICS</span>
              </span>
              <span className="block text-[9px] sm:text-[10px] tracking-wider uppercase font-semibold text-slate-500 truncate">
                {STORE_INFO.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href.split("?")[0]);

              if (link.highlight) {
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 transition border border-orange-200"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    {link.name}
                  </Link>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "text-orange-500 bg-orange-50/50 font-semibold"
                      : "text-slate-700 hover:text-navy-900 hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Quick Catalog Search Link */}
            <Link
              href="/shop"
              aria-label="Search Catalog"
              className="p-2 sm:p-2.5 text-slate-600 hover:text-navy-900 hover:bg-slate-100 rounded-full transition"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              aria-label="View Cart"
              className="relative flex items-center gap-1.5 sm:gap-2 bg-navy-900 hover:bg-navy-800 text-white p-2 sm:px-4 sm:py-2.5 rounded-full font-medium text-xs sm:text-sm transition shadow-sm active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-orange-400" />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="bg-orange-500 text-white text-[10px] sm:text-xs font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center animate-in zoom-in">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-navy-900 hover:bg-slate-100 rounded-lg transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-medium transition ${
                link.highlight
                  ? "bg-orange-50 text-orange-600 font-bold border border-orange-200"
                  : "text-slate-800 hover:bg-slate-50"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>{STORE_INFO.address}</span>
            </div>
            <div className="text-slate-500">{STORE_INFO.timings}</div>
          </div>
        </div>
      )}
    </header>
  );
}
