"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";

interface AppointmentStatusUpdaterProps {
  appointmentId: string;
  currentStatus: string;
  notes?: string | null;
}

export default function AppointmentStatusUpdater({
  appointmentId,
  currentStatus,
  notes: initialNotes,
}: AppointmentStatusUpdaterProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    setStatus(newStatus);
    try {
      const res = await fetch("/api/admin/appointments/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId,
          status: newStatus,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
        router.refresh();
      } else {
        alert("Failed to update appointment status");
        setStatus(currentStatus);
      }
    } catch (err) {
      alert("Error updating appointment");
      setStatus(currentStatus);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeStyle = (st: string) => {
    switch (st) {
      case "CONFIRMED":
        return "bg-blue-50 text-blue-700 border-blue-300";
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-700 border-emerald-300";
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-300";
      case "PENDING":
      default:
        return "bg-amber-50 text-amber-700 border-amber-300";
    }
  };

  return (
    <div className="inline-flex items-center gap-1.5 justify-end">
      <div className="relative">
        <select
          value={status}
          disabled={loading}
          onChange={(e) => handleStatusChange(e.target.value)}
          aria-label="Change Appointment Status"
          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border appearance-none pr-6 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#F15A24]/30 shadow-2xs transition-all ${getBadgeStyle(
            status
          )} ${loading ? "opacity-50" : ""}`}
        >
          <option value="PENDING">🟡 PENDING (Unconfirmed)</option>
          <option value="CONFIRMED">🔵 CONFIRMED (Booked)</option>
          <option value="COMPLETED">🟢 COMPLETED (Tested)</option>
          <option value="CANCELLED">🔴 CANCELLED</option>
        </select>
        <span className="pointer-events-none absolute right-2 top-1.5 text-[9px] text-slate-500">
          ▼
        </span>
      </div>

      {loading && <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin" />}
      {success && <Check className="w-3.5 h-3.5 text-emerald-600 animate-in zoom-in" />}
    </div>
  );
}
