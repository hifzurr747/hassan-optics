"use client";

import { Star, CheckCircle, ShieldCheck } from "lucide-react";

interface ProductReviewsProps {
  productName: string;
}

export default function ProductReviews({ productName }: ProductReviewsProps) {
  const reviews = [
    {
      author: "Adnan Malik",
      city: "Mianwali (Local Delivery)",
      rating: 5,
      date: "3 days ago",
      text: `Mianwali mein sub se behtareen quality! I ordered the ${productName} with Blue Cut lenses. Mobile aur laptop use kartay waqt aankhein thakna band ho gayi hain. Hard case aur cloth bhi sath mila. Highly recommended!`,
    },
    {
      author: "Zainab Farooq",
      city: "Rawalpindi",
      rating: 5,
      date: "1 week ago",
      text: "TCS delivery arrived in 2 days. The frame feels solid, lightweight and sits perfectly on the nose bridge. Original Hassan Optics hard case was a very nice touch.",
    },
    {
      author: "Hamza Niazi",
      city: "Lahore",
      rating: 5,
      date: "2 weeks ago",
      text: "Finishing and color are 10/10 exactly like photographs. Great service and genuine Zero-power screen protection lenses.",
    },
  ];

  return (
    <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <h3 className="text-xl font-bold text-[#1B2A4A] flex items-center gap-2">
            <span>Verified Customer Reviews</span>
            <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-semibold">
              4.9 / 5.0
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Real feedback from confirmed COD deliveries across Pakistan.
          </p>
        </div>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-5 h-5 fill-amber-400 text-amber-400" />
          ))}
          <span className="text-sm font-bold text-slate-800 ml-2">4.9</span>
          <span className="text-xs text-slate-400">(48 reviews)</span>
        </div>
      </div>

      <div className="divide-y divide-slate-100 mt-6">
        {reviews.map((r, i) => (
          <div key={i} className="py-4 first:pt-0 last:pb-0">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 text-sm">{r.author}</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                  <CheckCircle className="w-3 h-3" />
                  Verified Buyer
                </span>
              </div>
              <span className="text-[11px] text-slate-400">{r.date}</span>
            </div>

            <div className="text-[11px] text-slate-500 mb-2">{r.city}</div>

            <div className="flex items-center gap-1 mb-2">
              {[...Array(r.rating)].map((_, idx) => (
                <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {r.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
