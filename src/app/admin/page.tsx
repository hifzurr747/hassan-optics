import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  DollarSign,
  Truck,
  Calendar,
  Layers,
  ArrowRight,
  Printer,
  Eye,
  PlusCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [totalOrders, orders, productsCount, appointmentsCount] = await Promise.all([
    prisma.order.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.product.count(),
    prisma.eyeTestAppointment.count(),
  ]);

  const totalRevenue = (
    await prisma.order.aggregate({
      _sum: { totalAmount: true },
    })
  )._sum.totalAmount || 0;

  const pendingOrders = await prisma.order.count({
    where: { status: "CONFIRMED" },
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A4A]">
            Store Control Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Hassan Optics Faisal Plaza, Mianwali — Online & In-Store Operations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F15A24] text-white text-xs font-bold rounded-xl hover:bg-[#d94b1a] transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Frame</span>
          </Link>

          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1B2A4A] text-white text-xs font-bold rounded-xl hover:bg-[#15223c] transition-colors shadow-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>All Orders</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400">Total COD Revenue</div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#1B2A4A] mt-1">
              {formatPrice(totalRevenue)}
            </div>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
            Rs
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400">Total Orders Placed</div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#1B2A4A] mt-1">
              {totalOrders}
            </div>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400">Pending Packing</div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#F15A24] mt-1">
              {pendingOrders}
            </div>
          </div>
          <div className="w-12 h-12 bg-orange-50 text-[#F15A24] rounded-xl flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400">Eye Test Bookings</div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-1">
              {appointmentsCount}
            </div>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-[#1B2A4A] text-base">Recent Online Orders</h2>
            <p className="text-xs text-slate-500">Live COD customer bookings awaiting fulfillment</p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#F15A24] hover:underline"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-6">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">City</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-6 font-mono font-bold text-[#1B2A4A]">
                    {o.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{o.customerName}</div>
                    <div className="text-[11px] text-slate-400">{o.phone}</div>
                  </td>
                  <td className="py-3.5 px-4">{o.city}</td>
                  <td className="py-3.5 px-4 font-bold text-[#F15A24]">
                    {formatPrice(o.totalAmount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${
                        o.status === "DELIVERED"
                          ? "bg-emerald-100 text-emerald-800"
                          : o.status === "SHIPPED"
                          ? "bg-blue-100 text-blue-800"
                          : o.status === "PACKED"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right space-x-2">
                    <Link
                      href={`/admin/orders/${o.id}/print`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-[#1B2A4A] hover:text-white rounded-lg text-[11px] font-semibold transition-colors"
                      title="Print Dispatch Label"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Label</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
