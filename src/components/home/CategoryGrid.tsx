import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const CATEGORIES = [
  {
    title: "Zero-Power Eyeglasses",
    subtitle: "Blue Cut Computer & Screen Protection",
    tag: "Most Popular",
    href: "/shop",
    image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80",
    color: "from-blue-900/80 to-slate-900/90",
  },
  {
    title: "Fashion & Polarized Sunglasses",
    subtitle: "100% UV400 Driving & Outdoor Shades",
    tag: "Trending",
    href: "/sunglasses",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    color: "from-amber-900/80 to-stone-900/90",
  },
  {
    title: "Cosmetic Contact Lenses",
    subtitle: "FreshLook ColorBlends & HydraGlyde Solutions",
    tag: "Natural Colors",
    href: "/contact-lenses",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
    color: "from-teal-900/80 to-slate-900/90",
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-14 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F15A24]">
            Hassan Optics Curations
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A4A] mt-1">
            Shop by Category
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Explore ready-to-wear optical frames, luxury sunglasses, and contact lenses with nationwide Cash on Delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 aspect-[4/3] flex flex-col justify-end p-6 border border-slate-200"
            >
              {/* Background Image */}
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-80 group-hover:opacity-85 transition-opacity`} />

              {/* Tag */}
              <span className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md border border-white/20">
                {cat.tag}
              </span>

              {/* Icon circle */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[#F15A24] transition-colors">
                <ArrowUpRight className="w-5 h-5" />
              </div>

              {/* Text content */}
              <div className="relative z-10 text-white">
                <h3 className="text-xl font-bold tracking-tight mb-1 group-hover:text-orange-200 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 line-clamp-2">
                  {cat.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
