import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { STORE_INFO } from "@/lib/constants";
import {
  Search,
  Truck,
  CheckCircle,
  Package,
  Clock,
  MapPin,
  AlertCircle,
  Phone,
  HelpCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface TrackOrderPageProps {
  searchParams: Promise<{
    id?: string;
    phone?: string;
  }>;
}

export default async function TrackOrderPage({ searchParams }: TrackOrderPageProps) {
  const params = await searchParams;
  const orderId = params.id?.trim().toUpperCase();
  const phone = params.phone?.trim();

  let order: any = null;
  let searched = false;

  if (orderId) {
    searched = true;
    order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        statusHistory: { orderBy: { timestamp: "desc" } },
      },
    });
  }

  // Stages
  const stages = [
    { key: "CONFIRMED", label: "Order Confirmed", desc: "Order booked on website" },
    { key: "PACKED", label: "Packed in Lab", desc: "Lens fitted & packed with hard case" },
    { key: "SHIPPED", label: "Dispatched with Courier", desc: "Handed over for delivery" },
    { key: "DELIVERED", label: "Delivered & Paid", desc: "Received by customer" },
  ];

  const getStageIndex = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return 0;
      case "PACKED":
        return 1;
      case "SHIPPED":
        return 2;
      case "DELIVERED":
        return 3;
      default:
        return 0;
    }
  };

  const currentStageIdx = order ? getStageIndex(order.status) : 0;

  return (
    <div className="bg-slate-50 min-h-screen py-10 md:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-[#F15A24] text-xs font-bold mb-2">
            <Truck className="w-3.5 h-3.5" />
            <span>Nationwide Parcel Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A4A]">
            Track Your Hassan Optics Order
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Enter your Order ID (e.g. HO-1001) to view real-time packing and courier delivery progress.
          </p>
        </div>

        {/* Search Form */}
        <form
          method="GET"
          action="/track-order"
          className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs mb-8 flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              name="id"
              defaultValue={orderId || ""}
              required
              placeholder="Enter Order ID (e.g. HO-1001)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium uppercase focus:outline-hidden focus:border-[#F15A24]"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#1B2A4A] hover:bg-[#F15A24] text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors shadow-xs"
          >
            Track Parcel
          </button>
        </form>

        {searched && !order && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-xs">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Order Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              We couldn&apos;t find an order with ID &quot;{orderId}&quot;. Please verify the order number on your receipt or contact our helpline.
            </p>
            <div className="mt-4">
              <a
                href={STORE_INFO.whatsappSupportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#25D366] font-semibold hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Contact Helpline (0311-0073721)</span>
              </a>
            </div>
          </div>
        )}

        {order && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-3">
                <div>
                  <span className="text-xs text-slate-400">Tracking Reference:</span>
                  <h2 className="text-xl font-extrabold text-[#1B2A4A] font-mono">{order.id}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg">
                    {order.status}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString("en-PK")}
                  </span>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="py-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
                  {stages.map((stage, idx) => {
                    const isPassed = idx <= currentStageIdx;
                    const isCurrent = idx === currentStageIdx;

                    return (
                      <div key={stage.key} className="flex flex-col items-center text-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-colors ${
                            isCurrent
                              ? "bg-[#F15A24] text-white ring-4 ring-orange-100 shadow-sm"
                              : isPassed
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 text-slate-400 border border-slate-200"
                          }`}
                        >
                          {isPassed ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                        </div>
                        <span
                          className={`text-xs font-bold leading-tight ${
                            isPassed ? "text-slate-900" : "text-slate-400"
                          }`}
                        >
                          {stage.label}
                        </span>
                        <span className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                          {stage.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Courier Tracking Info if dispatched */}
              {order.courierName && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Assigned Courier Partner:</span>
                    <div className="font-bold text-slate-900 text-sm">{order.courierName}</div>
                  </div>
                  {order.trackingNumber && (
                    <div>
                      <span className="text-slate-500">Courier Tracking Number:</span>
                      <div className="font-mono font-bold text-[#F15A24] text-sm">
                        {order.trackingNumber}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Destination & Order Items */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
                Delivery Details
              </h3>
              <div className="text-xs text-slate-600 space-y-1">
                <div>Recipient: <strong className="text-slate-900">{order.customerName}</strong></div>
                <div>Contact: <strong>{order.phone}</strong></div>
                <div>Address: {order.address}, <strong>{order.city}</strong></div>
                <div>Amount Payable (COD): <strong className="text-[#F15A24]">{formatPrice(order.totalAmount)}</strong></div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 block mb-2">Items in Package:</span>
                <div className="divide-y divide-slate-100">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-800">{item.productName}</span>
                        <span className="text-slate-400 block text-[11px]">
                          {item.lensOption} • Qty {item.quantity}
                        </span>
                      </div>
                      <span className="font-medium text-slate-700">
                        {formatPrice(item.totalPrice)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Helpline Box */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-orange-400">Need Delivery Assistance?</span>
                <p className="text-slate-300 text-[11px]">
                  WhatsApp our Mianwali store support team directly for fast updates.
                </p>
              </div>
              <a
                href={STORE_INFO.whatsappSupportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-lg shrink-0 transition-colors"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
