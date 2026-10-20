import Link from "next/link";
import { STORE_INFO } from "@/lib/constants";
import {
  MapPin,
  Phone,
  Clock,
  Calendar,
  ExternalLink,
  Navigation,
  CheckCircle,
  ShieldCheck,
  Glasses,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function StoreLocatorPage() {
  const storeServices = [
    "Computerized Eye Examination & Refraction",
    "Prescription Lens Cutting & Fitting",
    "Blue Light Cut & Photochromic Transitions",
    "Frame Adjustment, Screw Tightening & Nose Pad Replacement",
    "500+ Designer Frames & Sunglasses Display",
    "Cosmetic & Medical Contact Lenses Consultation",
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F15A24]">
            Flagship Optical Center
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1B2A4A] mt-1">
            Hassan Optics — Mianwali Store
          </h1>
          <p className="text-slate-600 text-xs sm:text-base mt-2">
            Visit our central optical showroom for computerized vision testing, custom lens cutting, and the finest collection of eyewear in Mianwali.
          </p>
        </div>

        {/* Main Details Card */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Info Column */}
            <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-4">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Open Today</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-[#1B2A4A] mb-4">
                  Faisal Plaza Flagship Branch
                </h2>

                <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#F15A24] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">{STORE_INFO.address}</div>
                      <div className="text-slate-500">
                        {STORE_INFO.city}, {STORE_INFO.province}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Located centrally at Gulburg Chowk, easily accessible from PAF Road, General Bus Stand, and College Chowk.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#F15A24] shrink-0" />
                    <div>
                      <span className="text-slate-400">Direct Helpline: </span>
                      <a
                        href={`tel:${STORE_INFO.phone}`}
                        className="font-bold text-slate-900 hover:text-[#F15A24] transition-colors"
                      >
                        {STORE_INFO.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#F15A24] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">Opening Hours:</span>
                      <div className="text-slate-500 text-xs">{STORE_INFO.timings}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-100">
                <a
                  href={STORE_INFO.googleMapsLiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#1B2A4A] hover:bg-[#F15A24] text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
                >
                  <Navigation className="w-4 h-4 text-orange-400" />
                  <span>Get Driving Directions</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                </a>

                <Link
                  href="/book-eye-test"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-orange-50 hover:bg-orange-100 text-[#F15A24] font-semibold text-xs rounded-xl transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Eye Test Slot</span>
                </Link>
              </div>
            </div>

            {/* Embedded Map */}
            <div className="lg:col-span-6 bg-slate-100 min-h-[350px]">
              <iframe
                title="Hassan Optics Mianwali Map Location"
                src={STORE_INFO.googleMapsEmbed}
                className="w-full h-full min-h-[350px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Services In-Store */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <h3 className="text-lg font-bold text-[#1B2A4A] mb-4 flex items-center gap-2">
            <Glasses className="w-5 h-5 text-[#F15A24]" />
            <span>Optical Services Available at Faisal Plaza, Mianwali</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {storeServices.map((service, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-medium">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
