"use client";

import { MessageCircle } from "lucide-react";
import { STORE_INFO } from "@/lib/constants";
import { useState } from "react";

export default function WhatsAppHelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end print:hidden">
      {/* Tooltip / Helper Bubble */}
      {isOpen && (
        <div className="mb-3 bg-white text-navy-950 p-4 rounded-2xl shadow-2xl border border-slate-200 max-w-xs animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-bold text-sm flex items-center gap-1.5 text-navy-900">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Store Helpline Support
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 text-xs px-1"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Need guidance regarding frame sizes, computer screen protection, or our Faisal Plaza Mianwali shop?
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg">
            ℹ️ <strong>Note:</strong> All purchases & eye test appointments are placed directly on-site for automated tracking.
          </div>
          <a
            href={STORE_INFO.whatsappSupportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            Chat with Support
          </a>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Customer Helpline"
        className="group flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="hidden sm:inline text-xs font-bold tracking-wide">
          Helpline
        </span>
      </button>
    </div>
  );
}
