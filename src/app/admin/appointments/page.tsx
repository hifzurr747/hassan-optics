import prisma from "@/lib/prisma";
import Link from "next/link";
import { STORE_INFO } from "@/lib/constants";
import { Calendar, Phone, Clock, MapPin, CheckCircle, Search, MessageCircle } from "lucide-react";
import AppointmentStatusUpdater from "./AppointmentStatusUpdater";

export const dynamic = "force-dynamic";

interface AdminAppointmentsPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
  }>;
}

export default async function AdminAppointmentsPage({
  searchParams,
}: AdminAppointmentsPageProps) {
  const params = await searchParams;
  const { status, search } = params;

  const whereClause: any = {};
  if (status) whereClause.status = status;
  if (search) {
    whereClause.OR = [
      { appointmentRef: { contains: search } },
      { customerName: { contains: search } },
      { phone: { contains: search } },
    ];
  }

  const appointments = await prisma.eyeTestAppointment.findMany({
    where: whereClause,
    orderBy: { appointmentDate: "desc" },
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1B2A4A]">
            Computerized Eye Test Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Total {appointments.length} in-store appointments recorded for Hassan Optics (Faisal Plaza, Mianwali).
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <form method="GET" action="/admin/appointments" className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            name="search"
            defaultValue={search || ""}
            placeholder="Search Patient Name, Phone, Ref ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-[#F15A24]"
          />
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <Link
            href="/admin/appointments"
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              !status ? "bg-[#1B2A4A] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All
          </Link>
          <Link
            href="/admin/appointments?status=PENDING"
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              status === "PENDING"
                ? "bg-amber-500 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Pending
          </Link>
          <Link
            href="/admin/appointments?status=CONFIRMED"
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              status === "CONFIRMED"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Confirmed
          </Link>
          <Link
            href="/admin/appointments?status=COMPLETED"
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              status === "COMPLETED"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Completed
          </Link>
          <Link
            href="/admin/appointments?status=CANCELLED"
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              status === "CANCELLED"
                ? "bg-red-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Cancelled
          </Link>
        </div>
      </div>

      {/* Appointments Table */}
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
                <th className="py-3.5 px-6 text-right">Edit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No appointments match your filter.
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
                      <div className="flex items-center gap-2 mt-0.5">
                        <a
                          href={`tel:${a.phone}`}
                          className="text-[11px] text-slate-500 hover:text-navy-900 flex items-center gap-0.5 font-medium"
                          title="Call Patient"
                        >
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{a.phone}</span>
                        </a>
                        <a
                          href={`https://wa.me/${a.phone.replace(/[^0-9]/g, "").replace(/^0/, "92")}?text=Assalam-o-Alaikum%20${encodeURIComponent(
                            a.customerName
                          )},%20Hassan%20Optics%20Mianwali%20regarding%20your%20Eye%20Test%20Appointment%20(${
                            a.appointmentRef
                          })`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 font-semibold"
                          title="WhatsApp Patient"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">
                        {new Date(a.appointmentDate).toLocaleDateString("en-PK", {
                          dateStyle: "medium",
                        })}
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
                      <AppointmentStatusUpdater
                        appointmentId={a.id}
                        currentStatus={a.status}
                        notes={a.notes}
                      />
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
