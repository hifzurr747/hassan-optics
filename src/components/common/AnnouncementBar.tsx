import { MapPin, Phone, Truck, ShieldCheck } from "lucide-react";
import { STORE_INFO } from "@/lib/constants";
import { formatPrice, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";

export default function AnnouncementBar() {
  return (
    <div className="bg-navy-950 text-white text-xs py-2 px-4 border-b border-navy-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        {/* Left: Free delivery & COD */}
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <span className="flex items-center gap-1.5 text-orange-400 font-medium">
            <Truck className="w-3.5 h-3.5" />
            FREE Delivery on orders above {formatPrice(FREE_SHIPPING_THRESHOLD)}
          </span>
          <span className="hidden sm:inline text-navy-400">•</span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            100% Cash on Delivery Across Pakistan
          </span>
        </div>

        {/* Right: Physical store & phone */}
        <div className="flex items-center gap-4 text-slate-300">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden lg:inline">{STORE_INFO.address}</span>
            <span className="lg:hidden">Mianwali Store</span>
          </span>
          <span className="text-navy-400">•</span>
          <a
            href={`tel:${STORE_INFO.phone}`}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-orange-400" />
            <span>{STORE_INFO.helplineDisplay}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
