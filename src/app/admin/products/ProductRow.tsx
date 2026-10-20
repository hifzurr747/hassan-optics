"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { Trash2, Save, ExternalLink } from "lucide-react";

interface ProductRowProps {
  product: {
    id: string;
    slug: string;
    name: string;
    brand: string;
    category: string;
    basePrice: number;
    discountPrice?: number | null;
    stockQuantity: number;
    images: { url: string }[];
  };
}

export default function ProductRow({ product }: ProductRowProps) {
  const router = useRouter();
  const [stock, setStock] = useState(product.stockQuantity);
  const [basePrice, setBasePrice] = useState(product.basePrice);
  const [saving, setSaving] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stockQuantity: stock, basePrice }),
      });
      router.refresh();
    } catch (e) {
      alert("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;
    try {
      await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      setDeleted(true);
      router.refresh();
    } catch (e) {
      alert("Failed to delete product");
    }
  };

  if (deleted) return null;

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="py-3.5 px-6">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
            {product.images[0] && (
              <Image
                src={product.images[0].url}
                alt={product.name}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div>
            <div className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
              {product.name}
            </div>
            <div className="text-[11px] text-slate-400">
              <span className="font-semibold text-[#1B2A4A]">{product.brand}</span> • {product.category}
            </div>
          </div>
        </div>
      </td>

      <td className="py-3.5 px-4">
        <div className="flex items-center gap-1">
          <span className="text-slate-400 text-xs">Rs.</span>
          <input
            type="number"
            value={basePrice}
            onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
            className="w-24 px-2 py-1 border border-slate-300 rounded text-xs font-bold"
          />
        </div>
      </td>

      <td className="py-3.5 px-4">
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(parseInt(e.target.value) || 0)}
          className={`w-20 px-2 py-1 border rounded text-xs font-bold ${
            stock <= 3 ? "border-red-300 bg-red-50 text-red-700" : "border-slate-300"
          }`}
        />
        {stock <= 3 && (
          <span className="block text-[10px] text-red-500 font-semibold mt-0.5">Low Stock</span>
        )}
      </td>

      <td className="py-3.5 px-6 text-right space-x-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1B2A4A] hover:bg-[#F15A24] text-white rounded-lg text-xs font-semibold transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? "Saving" : "Save"}</span>
        </button>

        <Link
          href={`/product/${product.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1 p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="View in Store"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={handleDelete}
          className="inline-flex items-center gap-1 p-1.5 rounded-lg border border-red-200 text-red-500 hover:text-white hover:bg-red-600 transition-colors"
          title="Delete Product"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
}
