import { ShieldCheck, Truck, Sparkles, RefreshCw, Award, HeartHandshake } from "lucide-react";
import { FREE_ACCESSORIES_NOTE } from "@/lib/constants";

export default function WhyChooseUs() {
  const perks = [
    {
      icon: ShieldCheck,
      title: "100% Zero-Power Ready",
      desc: "Ready to wear immediately with premium Blue Light Cut or Anti-Glare lenses for screen protection.",
    },
    {
      icon: Sparkles,
      title: "Free Hard Case & Cloth",
      desc: "Every single frame order includes a protective magnetic hard case and microfiber cleaning cloth.",
    },
    {
      icon: Truck,
      title: "Nationwide COD Delivery",
      desc: "Cash on delivery across all cities of Pakistan. Free delivery on all orders of Rs. 3,000 or above.",
    },
    {
      icon: RefreshCw,
      title: "7-Day Replacement",
      desc: "Hassle-free replacement guarantee if there is any defect or transit damage in your order.",
    },
    {
      icon: Award,
      title: "Faisal Plaza Physical Store",
      desc: "Trusted optical hub in Gulburg Chowk, Mianwali with high-tech computerized optical equipment.",
    },
    {
      icon: HeartHandshake,
      title: "Friendly Support Helpline",
      desc: "Dedicated WhatsApp helpline at 0311-0073721 for customer inquiries, parcel status & guidance.",
    },
  ];

  return (
    <section className="py-16 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F15A24]">
            Hassan Optics Guarantee
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A4A] mt-1">
            Why Customers Choose Hassan Optics
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Combining local Mianwali optical craftsmanship with seamless nationwide e-commerce convenience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {perks.map((perk, idx) => {
            const Icon = perk.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#1B2A4A]/30 hover:shadow-md transition-all flex items-start gap-4"
              >
                <div className="p-3 rounded-xl bg-orange-50 text-[#F15A24] shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">
                    {perk.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {perk.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Free Accessories Callout Banner */}
        <div className="mt-12 bg-gradient-to-r from-[#1B2A4A] to-[#243B6B] rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F15A24] text-white text-[11px] font-bold rounded-md uppercase tracking-wider mb-2">
              Complimentary With Every Order
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">
              {FREE_ACCESSORIES_NOTE.title}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              No hidden charges. When you order your glasses from Hassan Optics, your package arrives fully protected with a luxury hard case and micro-fiber cleaning cloth ready to wear.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-center px-4 py-3 bg-white/10 rounded-xl border border-white/15">
              <div className="text-xs font-semibold text-orange-300">Hard Case</div>
              <div className="text-[11px] text-slate-300">Magnetic Lid</div>
            </div>
            <div className="text-center px-4 py-3 bg-white/10 rounded-xl border border-white/15">
              <div className="text-xs font-semibold text-orange-300">Microfiber</div>
              <div className="text-[11px] text-slate-300">Scratchless</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
