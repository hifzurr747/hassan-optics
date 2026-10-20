"use client";

import { useState } from "react";
import Link from "next/link";
import { Glasses, Sparkles, Check, ArrowRight, Info } from "lucide-react";

const FACE_SHAPES = [
  {
    id: "oval",
    name: "Oval Face Shape",
    features: "Balanced proportions, slightly narrower jawline than temples, rounded chin.",
    recommendedShapes: ["Rectangle", "Square", "Aviator", "Round"],
    avoid: "Overly oversized frames that cover facial balance.",
    bestStyles: "Most frame shapes look great on you! Bold geometric and classic rectangular frames are standout.",
    tag: "Versatile",
    filterParam: "Rectangle",
  },
  {
    id: "round",
    name: "Round Face Shape",
    features: "Soft curves, cheekbones are widest point, equal width and length with a rounded jaw.",
    recommendedShapes: ["Rectangle", "Square", "Geometric"],
    avoid: "Small round frames that accentuate facial roundness.",
    bestStyles: "Angular rectangular & square frames add structure and lengthen your facial appearance.",
    tag: "Structure Needed",
    filterParam: "Rectangle",
  },
  {
    id: "square",
    name: "Square Face Shape",
    features: "Strong, angular jawline, broad forehead, straight cheekbones.",
    recommendedShapes: ["Round", "Aviator", "Cat Eye"],
    avoid: "Boxy, sharply rectangular frames with thick rims.",
    bestStyles: "Curved, round or aviator frames soften the sharp angles of your jawline.",
    tag: "Curves Balance",
    filterParam: "Round",
  },
  {
    id: "heart",
    name: "Heart Face Shape",
    features: "Broad forehead, prominent cheekbones, tapering down to a pointed chin.",
    recommendedShapes: ["Aviator", "Cat Eye", "Round"],
    avoid: "Heavy top-rim designs that widen the forehead.",
    bestStyles: "Frames that are wider at the bottom or light rimless/aviator frames balance the chin nicely.",
    tag: "Chin Balance",
    filterParam: "Aviator",
  },
  {
    id: "diamond",
    name: "Diamond Face Shape",
    features: "High dramatic cheekbones, narrow forehead and narrow pointed jawline.",
    recommendedShapes: ["Cat Eye", "Round", "Square"],
    avoid: "Narrow or completely flat frames.",
    bestStyles: "Cat-eye and browline frames highlight the cheekbones while giving width to the eyes.",
    tag: "Cheekbone Focus",
    filterParam: "Cat Eye",
  },
];

export default function FaceShapeGuidePage() {
  const [selectedShape, setSelectedShape] = useState(FACE_SHAPES[0]);

  return (
    <div className="bg-slate-50 min-h-screen py-10 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-[#F15A24] text-xs font-bold mb-2">
            <Glasses className="w-3.5 h-3.5" />
            <span>Optician&apos;s Styling Advice</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1B2A4A] tracking-tight">
            Find the Perfect Frame for Your Face
          </h1>
          <p className="text-slate-600 text-xs sm:text-base mt-2">
            Select your facial silhouette below to see which eyeglass frame shapes will flatter your features best.
          </p>
        </div>

        {/* Shape Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {FACE_SHAPES.map((shape) => {
            const isSelected = selectedShape.id === shape.id;
            return (
              <button
                key={shape.id}
                onClick={() => setSelectedShape(shape)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  isSelected
                    ? "bg-[#1B2A4A] text-white shadow-md scale-105"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {shape.name.replace(" Face Shape", "")}
              </button>
            );
          })}
        </div>

        {/* Selected Shape Detail Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F15A24]">
                {selectedShape.tag}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A4A]">
                {selectedShape.name}
              </h2>
            </div>

            <Link
              href={`/shop?shape=${selectedShape.filterParam}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F15A24] text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-[#d94b1a] transition-colors shadow-xs"
            >
              <span>Browse {selectedShape.filterParam} Frames</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4 text-xs sm:text-sm text-slate-600">
              <div>
                <strong className="text-slate-900 block mb-1">Key Facial Features:</strong>
                <p>{selectedShape.features}</p>
              </div>

              <div>
                <strong className="text-slate-900 block mb-1">Why These Frames Work:</strong>
                <p>{selectedShape.bestStyles}</p>
              </div>

              <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-100 text-xs">
                <strong>What to Avoid:</strong> {selectedShape.avoid}
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-3">
                  Recommended Optical Shapes:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedShape.recommendedShapes.map((s) => (
                    <Link
                      key={s}
                      href={`/shop?shape=${s}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 hover:border-[#F15A24] hover:text-[#F15A24] transition-colors"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{s}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Visit Hassan Optics at Faisal Plaza, Mianwali to try frames on your face in person!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
