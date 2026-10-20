import Link from "next/link";
import Image from "next/image";
import { STORE_INFO, FREE_ACCESSORIES_NOTE } from "@/lib/constants";
import { Glasses, MapPin, Phone, Mail, Clock, ShieldCheck, Truck, Package, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-8 border-t border-navy-800 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-navy-800/80">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-navy-900/50 border border-navy-800">
            <div className="w-11 h-11 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Cash on Delivery</h4>
              <p className="text-xs text-slate-400">Nationwide courier delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-navy-900/50 border border-navy-800">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Free Hard Case + Cloth</h4>
              <p className="text-xs text-slate-400">Included free with every pair</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-navy-900/50 border border-navy-800">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">7-Day Replacement</h4>
              <p className="text-xs text-slate-400">100% Quality Guaranteed</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-navy-900/50 border border-navy-800">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Faisal Plaza, Mianwali</h4>
              <p className="text-xs text-slate-400">Physical optical store</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-12 border-b border-navy-800/80 text-sm">
          {/* Brand Intro */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-white p-1 shadow-md shrink-0">
                <Image
                  src="/images/hassan-logo.png"
                  alt="Hassan Optics Logo"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                HASSAN <span className="text-orange-500">OPTICS</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mianwali&apos;s trusted optical destination for premium branded frames, zero-power blue light screen protection glasses, sunglasses, and cosmetic contact lenses.
            </p>
            <div className="pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2 mb-1.5">
                <Clock className="w-4 h-4 text-orange-400 shrink-0" />
                <span>{STORE_INFO.timings}</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Explore Eyewear
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/shop?category=eyeglasses" className="hover:text-orange-400 transition">
                  Ready-to-Wear Frames (Zero Power)
                </Link>
              </li>
              <li>
                <Link href="/face-shape-guide" className="hover:text-orange-400 transition">
                  Face Shape Frame Guide
                </Link>
              </li>
              <li>
                <Link href="/sunglasses" className="hover:text-orange-400 transition">
                  Polarized & UV400 Sunglasses
                </Link>
              </li>
              <li>
                <Link href="/contact-lenses" className="hover:text-orange-400 transition">
                  Cosmetic Contact Lenses
                </Link>
              </li>
              <li>
                <Link href="/shop?shape=Aviator" className="hover:text-orange-400 transition">
                  Aviator & Classic Shapes
                </Link>
              </li>
            </ul>
          </div>

          {/* Store & Customer Service */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Customer Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/track-order" className="hover:text-orange-400 transition">
                  Track Your Order (#HO-XXXX)
                </Link>
              </li>
              <li>
                <Link href="/book-eye-test" className="hover:text-orange-400 transition text-orange-400 font-semibold">
                  Book Computerized Eye Test (Mianwali)
                </Link>
              </li>
              <li>
                <Link href="/store-locator" className="hover:text-orange-400 transition">
                  Store Locator & Google Maps
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-400 transition">
                  Help & Contact Us
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-slate-400 text-slate-500 transition">
                  Admin Dashboard Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Store Address & Contact */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Faisal Plaza Store
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>{STORE_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <a href={`tel:${STORE_INFO.phone}`} className="hover:text-white transition">
                  {STORE_INFO.helplineDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <span>{STORE_INFO.email}</span>
              </li>
              <li className="flex items-center gap-2.5 pt-2">
                <a
                  href={STORE_INFO.whatsappSupportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 px-3 py-1.5 rounded-lg border border-emerald-500/30 transition text-xs font-medium"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Helpline: {STORE_INFO.helplineDisplay}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>
            &copy; 2026 Hassan Optics. All Rights Reserved. Faisal Plaza, Gulburg Chowk, Mianwali.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Cash on Delivery Available Across Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
