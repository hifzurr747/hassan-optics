"use client";

import { useState } from "react";
import Link from "next/link";
import { STORE_INFO } from "@/lib/constants";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Award,
  Sparkles,
  ExternalLink,
} from "lucide-react";

const TIME_SLOTS = [
  "10:30 AM - 11:00 AM",
  "11:30 AM - 12:00 PM",
  "12:30 PM - 01:00 PM",
  "03:30 PM - 04:00 PM",
  "04:30 PM - 05:00 PM",
  "05:30 PM - 06:00 PM",
  "06:30 PM - 07:00 PM",
  "07:30 PM - 08:00 PM",
];

export default function BookEyeTestPage() {
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    appointmentDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    timeSlot: TIME_SLOTS[0],
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.customerName.trim() || !formData.phone.trim() || !formData.appointmentDate) {
      setErrorMessage("Please fill in your name, contact phone, and preferred date.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.customerName.trim(),
          phone: formData.phone.trim(),
          appointmentDate: formData.appointmentDate,
          timeSlot: formData.timeSlot,
          preferredBranch: STORE_INFO.address,
          notes: formData.notes.trim() || null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to book appointment.");
      }

      setConfirmation(data);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to schedule appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-[#F15A24] text-xs font-bold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Faisal Plaza, Gulburg Chowk, Mianwali</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1B2A4A] tracking-tight">
            Book Computerized Eye Test
          </h1>
          <p className="text-slate-600 text-xs sm:text-base mt-2">
            Online frames are ready-to-wear zero-power. If you require custom prescription power lenses, book your appointment with our optometrist at our Mianwali store.
          </p>
        </div>

        {confirmation ? (
          /* Confirmation View */
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-lg text-center max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Appointment Reserved
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A4A] mt-2 mb-1">
              Shukriya, {confirmation.customerName}!
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm mb-6">
              Aapka computerized eye test slot confirm ho gaya hai. Hum aapka intezaar karein ge.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left space-y-3 mb-6 text-xs sm:text-sm">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Booking Reference:</span>
                <span className="font-mono font-bold text-[#F15A24] text-base">
                  {confirmation.appointmentRef}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Date & Slot:</span>
                <span className="font-semibold text-slate-800">
                  {new Date(confirmation.appointmentDate).toLocaleDateString("en-PK", { dateStyle: "medium" })} ({confirmation.timeSlot})
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Store Branch:</span>
                <span className="font-semibold text-slate-800 text-right">
                  {STORE_INFO.address}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Optician Helpline:</span>
                <span className="font-semibold text-slate-800">{STORE_INFO.phone}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={STORE_INFO.googleMapsLiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1B2A4A] text-white text-xs font-semibold rounded-xl hover:bg-[#F15A24] transition-colors"
              >
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>Get Driving Directions (Google Maps)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <Link
                href="/shop"
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors"
              >
                Browse Frames
              </Link>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs sm:text-sm flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Mehmood Niazi"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-[#F15A24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Phone / WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0312-3456789"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-[#F15A24]"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    We will send an SMS confirmation for your slot
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Preferred Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={formData.appointmentDate}
                      onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-[#F15A24]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Time Slot <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-hidden focus:border-[#F15A24]"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Branch Location
                  </label>
                  <input
                    type="text"
                    disabled
                    value={STORE_INFO.address}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Any Symptoms or Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Headache from laptop use, blurred distance vision, reading difficulty"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-[#F15A24]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#F15A24] hover:bg-[#d94b1a] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-orange-950/20 disabled:opacity-50"
                >
                  {isSubmitting ? "Booking Your Slot..." : "Confirm Appointment Reservation"}
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  100% on-site confirmation. Free consultation with frame purchase.
                </p>
              </form>
            </div>

            {/* Sidebar Benefits Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-5">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-400" />
                  <span>What to Expect at Hassan Optics</span>
                </h3>

                <ul className="space-y-4 text-xs text-slate-300">
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#F15A24] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Computerized Auto-Refractor Exam:</strong>
                      Accurate digital measurement of your refractive vision error (Myopia, Hyperopia, Astigmatism).
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#F15A24] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Trial Frame & Subjective Check:</strong>
                      Test your exact power in a trial frame so you feel zero dizziness or distortion.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#F15A24] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">500+ Designer Frames Trial:</strong>
                      Try on frames live on your face with professional styling advice from our opticians.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#F15A24] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Same-Day Cutting & Fitting:</strong>
                      High-precision optical lab cutting available for standard prescriptions.
                    </div>
                  </li>
                </ul>

                <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
                  <div className="flex items-center gap-2 text-white font-medium mb-1">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <span>Store Hours</span>
                  </div>
                  <p>{STORE_INFO.timings}</p>
                </div>
              </div>

              {/* Map Preview */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                <iframe
                  title="Store Location"
                  src={STORE_INFO.googleMapsEmbed}
                  className="w-full h-48 rounded-2xl border-0"
                  loading="lazy"
                />
                <div className="mt-3 text-center">
                  <a
                    href={STORE_INFO.googleMapsLiveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#F15A24] font-bold hover:underline"
                  >
                    <span>Open in Google Maps App</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
