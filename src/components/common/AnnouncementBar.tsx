import { MapPin, Phone, Truck, ShieldCheck } from "lucide-react";
import { STORE_INFO } from "@/lib/constants";
import { formatPrice, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";

export default function AnnouncementBar() {
  return (
    <div className="bg-navy-950 text-white text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-navy-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
        {/* Left: Free delivery & COD */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center sm:justify-start">
          <span className="flex items-center gap-1.5 text-orange-400 font-medium">
            <Truck className="w-3.5 h-3.5" />
            <span>FREE Delivery over {formatPrice(FREE_SHIPPING_THRESHOLD)}</span>
          </span>
          <span className="hidden md:inline text-navy-400">•</span>
          <span className="hidden sm:flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Cash on Delivery</span>
          </span>
        </div>

        {/* Right: Physical store & phone */}
        <div className="flex items-center gap-3 text-slate-300 shrink-0">
          <span className="hidden md:flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span>Faisal Plaza, Mianwali</span>
          </span>
          <span className="hidden md:inline text-navy-400">•</span>
          <a
            href={`tel:${STORE_INFO.phone}`}
            className="flex items-center gap-1 text-orange-300 hover:text-white transition-colors font-semibold"
          >
            <Phone className="w-3.5 h-3.5 text-orange-400" />
            <span>{STORE_INFO.helplineDisplay}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
