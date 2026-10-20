import Link from "next/link";
import { STORE_INFO } from "@/lib/constants";
import { MapPin, Phone, Clock, Calendar, ExternalLink, Navigation } from "lucide-react";

export default function StoreLocationCTA() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Store Information */}
            <div className="lg:col-span-7 p-8 sm:p-12 text-white flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-400 text-xs font-semibold mb-4 border border-white/10">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Physical Store in Mianwali</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4">
                  Visit Hassan Optics Flagship Store
                </h2>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                  Experience computerized eye examinations, custom power lens cutting, and browse over 500+ designer frames in person at our central Gulburg Chowk outlet.
                </p>

                <div className="space-y-3.5 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#F15A24] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">{STORE_INFO.address}</div>
                      <div className="text-xs text-slate-400">{STORE_INFO.city}, {STORE_INFO.province}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#F15A24] shrink-0" />
                    <div>
                      <span className="text-xs text-slate-400">Direct Helpline: </span>
                      <a href={`tel:${STORE_INFO.phone}`} className="font-semibold text-white hover:text-orange-400 transition-colors">
                        {STORE_INFO.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#F15A24] shrink-0" />
                    <span className="text-xs text-slate-300">{STORE_INFO.timings}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-slate-800">
                <Link
                  href="/book-eye-test"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#F15A24] hover:bg-[#d94b1a] text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-950/30"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Free Eye Test Slot</span>
                </Link>

                <a
                  href={STORE_INFO.googleMapsLiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl border border-white/15 transition-all text-sm"
                >
                  <Navigation className="w-4 h-4 text-orange-400" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Embedded Map Column */}
            <div className="lg:col-span-5 bg-slate-800 relative min-h-[300px] lg:min-h-full">
              <iframe
                title="Hassan Optics Mianwali Location Map"
                src={STORE_INFO.googleMapsEmbed}
                className="w-full h-full min-h-[320px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
