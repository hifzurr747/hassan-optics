import prisma from "@/lib/prisma";
import { STORE_INFO } from "@/lib/constants";
import { Calendar, Phone, Clock, MapPin, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAppointmentsPage() {
  const appointments = await prisma.eyeTestAppointment.findMany({
    orderBy: { appointmentDate: "desc" },
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1B2A4A]">
          Computerized Eye Test Bookings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          In-store appointments scheduled for Hassan Optics optical center (Faisal Plaza, Mianwali).
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-6">Ref ID</th>
                <th className="py-3.5 px-4">Patient / Customer</th>
                <th className="py-3.5 px-4">Reserved Date & Slot</th>
                <th className="py-3.5 px-4">Branch</th>
                <th className="py-3.5 px-4">Symptoms / Notes</th>
                <th className="py-3.5 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No appointments booked yet.
                  </td>
                </tr>
              ) : (
                appointments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-bold text-[#F15A24]">
                      {a.appointmentRef}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{a.customerName}</div>
                      <div className="text-[11px] text-slate-400">{a.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">
                        {new Date(a.appointmentDate).toLocaleDateString("en-PK", { dateStyle: "medium" })}
                      </div>
                      <div className="text-[11px] text-slate-500">{a.timeSlot}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-slate-600">
                      {a.preferredBranch}
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-slate-500 max-w-xs truncate">
                      {a.notes || "Standard checkup"}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
