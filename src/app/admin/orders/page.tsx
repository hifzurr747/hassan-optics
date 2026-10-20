import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import OrderStatusUpdater from "./OrderStatusUpdater";
import { Printer, ShoppingBag, Search, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

interface AdminOrdersPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
  }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const params = await searchParams;
  const { status, search } = params;

  const whereClause: any = {};
  if (status) whereClause.status = status;
  if (search) {
    whereClause.OR = [
      { id: { contains: search } },
      { customerName: { contains: search } },
      { phone: { contains: search } },
      { city: { contains: search } },
    ];
  }

  const orders = await prisma.order.findMany({
    where: whereClause,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1B2A4A]">Customer Orders Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Total {orders.length} orders recorded. Manage packing, dispatch, and print shipping labels.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
          <form method="GET" action="/admin/orders" className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              name="search"
              defaultValue={search || ""}
              placeholder="Search Order ID, Name, Phone..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-[#F15A24]"
            />
          </form>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <Link
            href="/admin/orders"
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              !status ? "bg-[#1B2A4A] text-white" : "bg-white text-slate-700 hover:bg-slate-200"
            }`}
          >
            All
          </Link>
          <Link
            href="/admin/orders?status=CONFIRMED"
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              status === "CONFIRMED" ? "bg-[#F15A24] text-white" : "bg-white text-slate-700 hover:bg-slate-200"
            }`}
          >
            Confirmed
          </Link>
          <Link
            href="/admin/orders?status=PACKED"
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              status === "PACKED" ? "bg-amber-600 text-white" : "bg-white text-slate-700 hover:bg-slate-200"
            }`}
          >
            Packed
          </Link>
          <Link
            href="/admin/orders?status=SHIPPED"
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              status === "SHIPPED" ? "bg-blue-600 text-white" : "bg-white text-slate-700 hover:bg-slate-200"
            }`}
          >
            Shipped
          </Link>
          <Link
            href="/admin/orders?status=DELIVERED"
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              status === "DELIVERED" ? "bg-emerald-600 text-white" : "bg-white text-slate-700 hover:bg-slate-200"
            }`}
          >
            Delivered
          </Link>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-6">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Items / Lens Option</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status & Courier</th>
                <th className="py-3.5 px-6 text-right">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No orders match current criteria.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 align-top">
                      <div className="font-mono font-bold text-[#1B2A4A] text-sm">{o.id}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(o.createdAt).toLocaleDateString("en-PK")}
                      </div>
                    </td>

                    <td className="py-4 px-4 align-top">
                      <div className="font-bold text-slate-900">{o.customerName}</div>
                      <div className="text-slate-600">{o.phone}</div>
                      <div className="text-[11px] text-slate-500 max-w-xs">{o.address}, {o.city}</div>
                    </td>

                    <td className="py-4 px-4 align-top">
                      <div className="space-y-1">
                        {o.items.map((i) => (
                          <div key={i.id} className="text-[11px]">
                            <strong className="text-slate-800">{i.productName}</strong>
                            <span className="text-slate-500 block">
                              {i.selectedColor ? `${i.selectedColor} • ` : ""}
                              {i.lensOption} (x{i.quantity})
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-4 align-top">
                      <div className="font-bold text-[#F15A24] text-sm">
                        {formatPrice(o.totalAmount)}
                      </div>
                      <div className="text-[10px] text-slate-400">COD (Cash)</div>
                    </td>

                    <td className="py-4 px-4 align-top space-y-1">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
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
                      {o.courierName && (
                        <div className="text-[10px] text-slate-500 font-mono">
                          {o.courierName}: {o.trackingNumber || "N/A"}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-6 align-top text-right space-y-2">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/orders/${o.id}/print`}
                          target="_blank"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1B2A4A] text-white hover:bg-[#F15A24] rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Label</span>
                        </Link>

                        <OrderStatusUpdater
                          orderId={o.id}
                          currentStatus={o.status}
                          courierName={o.courierName}
                          trackingNumber={o.trackingNumber}
                        />
                      </div>
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
