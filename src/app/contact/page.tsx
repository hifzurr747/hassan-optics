"use client";

import { useState } from "react";
import { STORE_INFO } from "@/lib/constants";
import {
  Phone,
  MapPin,
  Clock,
  Mail,
  Send,
  CheckCircle,
  MessageCircle,
  HelpCircle,
} from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    subject: "Order Inquiry",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F15A24]">
            Get In Touch
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1B2A4A] mt-1">
            Contact Hassan Optics Support
          </h1>
          <p className="text-slate-600 text-xs sm:text-base mt-2">
            Have a question regarding parcel delivery, frame sizing, or store appointments? Reach out to our customer care helpline.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1B2A4A] text-white p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
              <h3 className="text-xl font-bold">Store & Helpline Info</h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-200">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Physical Store:</strong>
                    <span>{STORE_INFO.address}</span>
                    <div className="text-xs text-slate-400">{STORE_INFO.city}, {STORE_INFO.province}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-orange-400 shrink-0" />
                  <div>
                    <strong className="text-white block">Helpline & WhatsApp:</strong>
                    <a href={`tel:${STORE_INFO.phone}`} className="hover:text-orange-300 transition-colors">
                      {STORE_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-orange-400 shrink-0" />
                  <div>
                    <strong className="text-white block">Official Email:</strong>
                    <span>{STORE_INFO.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Store Timings:</strong>
                    <span className="text-xs">{STORE_INFO.timings}</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Support Button */}
              <div className="pt-4 border-t border-white/10">
                <a
                  href={STORE_INFO.whatsappSupportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-xl transition-all shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp Support Helpline</span>
                </a>
                <span className="text-[10px] text-slate-300 block text-center mt-2">
                  Strict Rule: Helpline for customer queries only. Orders process on-site.
                </span>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Message Received!</h3>
                <p className="text-slate-600 text-xs sm:text-sm max-w-sm mx-auto">
                  Shukriya! Our optical support team at Faisal Plaza will contact you within working hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-5 py-2 bg-[#1B2A4A] text-white text-xs font-semibold rounded-lg hover:bg-[#F15A24] transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-[#1B2A4A] mb-2">Send an Online Message</h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asad Niazi"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-[#F15A24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Phone / Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0300-1234567 or email@domain.com"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-[#F15A24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subject / Query Type
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-hidden focus:border-[#F15A24]"
                  >
                    <option value="Order Inquiry">Order Inquiry / Delivery Tracking</option>
                    <option value="Product Advice">Frame Size & Lens Advice</option>
                    <option value="Eye Test Appointment">Eye Test Appointment Query</option>
                    <option value="General Feedback">General Feedback / Store Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Type your message or inquiry here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-[#F15A24]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#F15A24] hover:bg-[#d94b1a] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Support</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
