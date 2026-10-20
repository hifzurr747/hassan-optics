"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Edit, Truck } from "lucide-react";

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: string;
  courierName?: string | null;
  trackingNumber?: string | null;
}

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
  courierName,
  trackingNumber,
}: OrderStatusUpdaterProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const [courier, setCourier] = useState(courierName || "TCS Express");
  const [tracking, setTracking] = useState(trackingNumber || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await fetch("/api/admin/orders/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          status,
          courierName: courier,
          trackingNumber: tracking,
        }),
      });
      setIsOpen(false);
      router.refresh();
    } catch (e) {
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
      >
        <Edit className="w-3.5 h-3.5" />
        <span>Update</span>
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-left min-w-[200px]">
      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
        <span>Update Order Stage</span>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-slate-600 text-xs"
        >
          ✕
        </button>
      </div>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full text-xs p-1.5 rounded border border-slate-300 bg-white"
      >
        <option value="CONFIRMED">CONFIRMED</option>
        <option value="PACKED">PACKED (In Lab)</option>
        <option value="SHIPPED">SHIPPED (With Rider)</option>
        <option value="DELIVERED">DELIVERED & PAID</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>

      <input
        type="text"
        placeholder="Courier (e.g. TCS)"
        value={courier}
        onChange={(e) => setCourier(e.target.value)}
        className="w-full text-xs p-1.5 rounded border border-slate-300 bg-white"
      />

      <input
        type="text"
        placeholder="Tracking # (e.g. 91823)"
        value={tracking}
        onChange={(e) => setTracking(e.target.value)}
        className="w-full text-xs p-1.5 rounded border border-slate-300 bg-white"
      />

      <button
        type="button"
        disabled={loading}
        onClick={handleUpdate}
        className="w-full py-1.5 bg-[#1B2A4A] text-white rounded text-xs font-bold hover:bg-[#F15A24] transition-colors"
      >
        {loading ? "Saving..." : "Save Status"}
      </button>
    </div>
  );
}
