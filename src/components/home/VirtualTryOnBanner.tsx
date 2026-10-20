import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, Camera, CheckCircle2 } from "lucide-react";

export default function VirtualTryOnBanner() {
  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1B2A4A] to-[#243862] text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-slate-800">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-[#F15A24]/15 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Text & Pitch */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-orange-400 text-xs font-bold border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-[#F15A24]" />
                <span>New Feature • Virtual Try-On</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                See How Any Frame Looks on Your Face!
              </h2>

              <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-xl">
                Upload your selfie or try on sample faces. Swap between Ray-Ban, Dior, Aviators, Cat-Eye, and titanium frames with 1 click before ordering with Cash on Delivery.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>100% Private (No upload)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Instant 0-Lag Swap</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Save & Share with Friends</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/virtual-try-on"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#F15A24] hover:bg-[#d84817] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-orange-950/20 active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                  <span>Open Virtual Try-On Mirror</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Visual Preview Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-xs aspect-[4/5] rounded-2xl overflow-hidden bg-slate-800 border-2 border-white/20 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
                  alt="Virtual Try On Preview"
                  fill
                  className="object-cover"
                />
                {/* Overlay Sample Glasses */}
                <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] aspect-[600/220] drop-shadow-2xl">
                  <Image
                    src="/images/frames/rectangle.svg"
                    alt="Frame Overlay Preview"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="absolute bottom-3 inset-x-3 bg-black/70 backdrop-blur-md text-white text-[11px] p-2 rounded-xl text-center font-bold">
                  👓 Live Interactive Fitting Active
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
