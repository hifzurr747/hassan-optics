"use client";

import { X, HelpCircle, Ruler, Info } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lensWidth?: number | null;
  bridgeWidth?: number | null;
  templeLength?: number | null;
}

export default function SizeGuideModal({
  isOpen,
  onClose,
  lensWidth,
  bridgeWidth,
  templeLength,
}: SizeGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-orange-400" />
            <h3 className="font-bold text-base">Eyewear Sizing & Dimensions Guide</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-sm text-slate-600">
          {/* Current Frame Dimensions */}
          {(lensWidth || bridgeWidth || templeLength) && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <span className="text-xs font-bold text-[#F15A24] uppercase tracking-wider block mb-2">
                This Frame&apos;s Measured Specs
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white rounded-lg p-2.5 shadow-2xs border border-orange-100">
                  <div className="text-xs text-slate-400">Lens Width</div>
                  <div className="text-base font-bold text-slate-900">{lensWidth ?? 52} mm</div>
                </div>
                <div className="bg-white rounded-lg p-2.5 shadow-2xs border border-orange-100">
                  <div className="text-xs text-slate-400">Bridge Width</div>
                  <div className="text-base font-bold text-slate-900">{bridgeWidth ?? 18} mm</div>
                </div>
                <div className="bg-white rounded-lg p-2.5 shadow-2xs border border-orange-100">
                  <div className="text-xs text-slate-400">Temple Length</div>
                  <div className="text-base font-bold text-slate-900">{templeLength ?? 140} mm</div>
                </div>
              </div>
            </div>
          )}

          {/* Sizing Diagram explanation */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600" />
              How to Check Your Current Glasses:
            </h4>
            <p className="text-xs leading-relaxed text-slate-600 mb-3">
              Look inside the temple (arm) of any existing eyeglasses or sunglasses you currently wear comfortably. You will see a 3-part number like <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">52 □ 18 - 140</code>.
            </p>

            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <span className="font-bold text-slate-800 shrink-0">1. Lens Width (e.g. 52mm):</span>
                <span>The horizontal diameter of one lens. 48-52mm is medium; 54mm+ is wide.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-slate-800 shrink-0">2. Bridge Width (e.g. 18mm):</span>
                <span>The distance between the two lenses across the bridge of your nose.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-slate-800 shrink-0">3. Temple Length (e.g. 140mm):</span>
                <span>The length of the arm extending behind your ear.</span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
            💡 <strong>Fitting Guarantee:</strong> All Hassan Optics frames are crafted with flexible spring hinges and adjustable silicone nose pads for a comfortable standard Pakistani face fit.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1B2A4A] text-white text-xs font-semibold rounded-lg hover:bg-[#F15A24] transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
