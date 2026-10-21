"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const SLIDES = [
  {
    tag: "Computer & Screen Protection",
    headline: "Zero-Power Blue Cut Glasses",
    subheadline:
      "Protect your eyes from digital strain, mobile glare, and late-night screen fatigue. 100% ready-to-wear, zero prescription needed.",
    ctaText: "Shop Blue Light Glasses",
    ctaLink: "/shop",
    secondaryText: "Book Eye Test",
    secondaryLink: "/book-eye-test",
    image:
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1200&q=80",
    badge: "Free Hard Case + Cloth",
  },
  {
    tag: "Summer 2026 Collection",
    headline: "High-Fashion Polarized Sunglasses",
    subheadline:
      "Ray-Ban, Dior, and Givenchy inspired eyewear with 100% UV400 and anti-glare protection for clear outdoor vision.",
    ctaText: "Explore Sunglasses",
    ctaLink: "/sunglasses",
    secondaryText: "Visit Faisal Plaza",
    secondaryLink: "/store-locator",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
    badge: "Nationwide COD Delivery",
  },
  {
    tag: "Visit Store in Mianwali",
    headline: "Computerized Eye Testing & Prescription Lenses",
    subheadline:
      "Need custom optical power cutting? Visit our flagship optical center at Gulburg Chowk, Faisal Plaza, Mianwali.",
    ctaText: "Reserve Appointment",
    ctaLink: "/book-eye-test",
    secondaryText: "View Store Map",
    secondaryLink: "/store-locator",
    image:
      "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1200&q=80",
    badge: "Qualified Optometrist",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance slides every 6 seconds unless paused
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const slide = SLIDES[current];

  return (
    <section
      className="relative bg-gradient-to-br from-[#0F172A] via-[#1B2A4A] to-[#1E293B] text-white overflow-hidden py-8 sm:py-16 md:py-24"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 rounded-full bg-[#F15A24]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-4 sm:space-y-6">
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] sm:text-xs md:text-sm font-medium text-orange-300">
              <Sparkles className="w-3.5 h-3.5 text-[#F15A24]" />
              <span>{slide.tag}</span>
              <span className="hidden sm:inline text-white/40">•</span>
              <span className="hidden sm:inline text-emerald-300 font-semibold">
                {slide.badge}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight transition-all duration-500">
              {slide.headline}
            </h1>

            {/* Subheadline */}
            <p className="text-slate-300 text-xs sm:text-base md:text-lg max-w-2xl leading-relaxed">
              {slide.subheadline}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 pt-1 w-full sm:w-auto">
              <Link
                href={slide.ctaLink}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 bg-[#F15A24] text-white font-semibold text-xs sm:text-sm md:text-base rounded-xl hover:bg-[#d94b1a] shadow-lg shadow-orange-950/20 transition-all active:scale-95"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={slide.secondaryLink}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium text-xs sm:text-sm md:text-base rounded-xl transition-all active:scale-95"
              >
                <Calendar className="w-4 h-4 text-orange-400" />
                <span>{slide.secondaryText}</span>
              </Link>
            </div>

            {/* Features Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 pt-3 sm:pt-4 border-t border-white/10 text-[10px] sm:text-xs text-slate-300 w-full">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F15A24]" />
                <span>Zero-Power Ready</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F15A24]" />
                <span>Mianwali Flagship Hub</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 col-span-2 sm:col-span-1">
                <span className="font-bold text-white">COD</span>
                <span>Nationwide Shipping</span>
              </div>
            </div>
          </div>

          {/* Image Column with Next/Previous Controls */}
          <div className="lg:col-span-5 relative group/slider">
            <div className="relative mx-auto w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-slate-800">
              <Image
                src={slide.image}
                alt={slide.headline}
                fill
                priority
                className="object-cover object-center transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Floating Left / Prev Arrow Button */}
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous Slide (Peechay)"
                className="absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-950/70 hover:bg-[#F15A24] text-white flex items-center justify-center backdrop-blur-md transition-all shadow-xl border border-white/25 active:scale-90 hover:scale-105 cursor-pointer"
                title="Peechay wala slide dekhein"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Floating Right / Next Arrow Button */}
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next Slide (Aagay)"
                className="absolute right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-950/70 hover:bg-[#F15A24] text-white flex items-center justify-center backdrop-blur-md transition-all shadow-xl border border-white/25 active:scale-90 hover:scale-105 cursor-pointer"
                title="Aagay wala slide dekhein"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Slide Bottom Card */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 backdrop-blur-md rounded-xl p-2.5 sm:p-3 text-slate-900 shadow-lg flex items-center justify-between">
                <div>
                  <div className="text-[10px] sm:text-[11px] font-semibold text-[#F15A24] uppercase tracking-wide">
                    Hassan Optics Mianwali
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-[#1B2A4A]">
                    Every Order Includes Case & Cloth
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                  FREE
                </span>
              </div>
            </div>

            {/* Slide Navigation Bar with Prev/Next buttons & Dots */}
            <div className="flex items-center justify-center gap-3 mt-4">
              {/* Prev Button */}
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous slide"
                className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-[#F15A24] text-white/80 hover:text-white transition active:scale-90 border border-white/20 cursor-pointer shadow-sm"
                title="Peechay (Previous)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Pagination Dots */}
              <div className="flex items-center gap-2">
                {SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === current
                        ? "w-8 bg-[#F15A24]"
                        : "w-2.5 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next slide"
                className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-[#F15A24] text-white/80 hover:text-white transition active:scale-90 border border-white/20 cursor-pointer shadow-sm"
                title="Aagay (Next)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
