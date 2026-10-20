import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { STORE_INFO, FREE_ACCESSORIES_NOTE } from "@/lib/constants";
import PrintButton from "./PrintButton";
import {
  CheckCircle,
  Truck,
  Sparkles,
  MapPin,
  Phone,
  ArrowRight,
  ShieldCheck,
  Package,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface OrderSuccessPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      statusHistory: { orderBy: { timestamp: "desc" } },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 md:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Success Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs text-center mb-8">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in-75 duration-300">
            <CheckCircle className="w-10 h-10" />
          </div>

          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full mb-2">
            100% On-Site Order Confirmed
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A4A] mb-2">
            Shukriya, {order.customerName}!
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto mb-6">
            Aapka Hassan Optics COD order record ho chuka hai. Parcel pack kar ke courier rider ke hawale kiya ja raha hai.
          </p>

          <div className="inline-flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700">
            <span>Order Reference ID:</span>
            <span className="font-mono font-bold text-[#F15A24] text-sm">{order.id}</span>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <PrintButton />
            <Link
              href={`/track-order?id=${order.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B2A4A] hover:bg-[#F15A24] text-white font-semibold text-xs transition-colors"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Parcel Status</span>
            </Link>
          </div>
        </div>

        {/* Free Accessories Notice */}
        <div className="bg-gradient-to-r from-orange-500 to-[#F15A24] rounded-2xl p-5 text-white mb-8 flex items-center gap-4 shadow-sm">
          <Sparkles className="w-8 h-8 shrink-0 text-amber-200" />
          <div>
            <h3 className="font-bold text-sm">Complimentary Premium Accessories Packed</h3>
            <p className="text-xs text-orange-100 mt-0.5">
              Your parcel includes Hassan Optics magnetic hard case and microfiber cleaning cloth.
            </p>
          </div>
        </div>

        {/* Order Details Receipt Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-[#1B2A4A] text-base">Receipt & Delivery Summary</h2>
              <div className="text-xs text-slate-500">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-PK", { dateStyle: "long" })}
              </div>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-[#1B2A4A] text-xs font-bold rounded-lg border border-blue-100">
              {order.status}
            </span>
          </div>

          {/* Delivery Target */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="font-bold text-slate-700 block mb-1">Delivering To:</span>
              <div className="font-medium text-slate-900">{order.customerName}</div>
              <div className="text-slate-600">{order.address}</div>
              <div className="font-semibold text-slate-800">{order.city}</div>
            </div>
            <div>
              <span className="font-bold text-slate-700 block mb-1">Contact & Payment:</span>
              <div className="text-slate-800">Phone: <strong>{order.phone}</strong></div>
              <div className="text-slate-800">Method: <strong>Cash on Delivery (COD)</strong></div>
              {order.courierName && (
                <div className="text-slate-800 mt-1">Courier: <strong>{order.courierName}</strong></div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-xs sm:text-sm text-slate-900">
                    {item.productName}
                  </div>
                  <div className="text-xs text-slate-500">
                    {item.selectedColor && `${item.selectedColor} • `}
                    {item.lensOption}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Qty: {item.quantity} × {formatPrice(item.unitPrice + item.lensPrice)}
                  </div>
                </div>
                <div className="font-bold text-xs sm:text-sm text-slate-900">
                  {formatPrice(item.totalPrice)}
                </div>
              </div>
            ))}
          </div>

          {/* Financial Totals */}
          <div className="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900">{formatPrice(order.subtotal)}</span>
            </div>

            {order.discountAmount && order.discountAmount > 0 ? (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount Applied ({order.discountCode}):</span>
                <span>- {formatPrice(order.discountAmount)}</span>
              </div>
            ) : null}

            <div className="flex justify-between">
              <span>Shipping Fee:</span>
              <span>{order.shippingFee === 0 ? "FREE" : formatPrice(order.shippingFee)}</span>
            </div>

            <div className="flex justify-between text-base font-extrabold text-[#1B2A4A] pt-3 border-t border-slate-200">
              <span>Total Payable to Courier Rider:</span>
              <span className="text-lg text-[#F15A24]">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          {/* Offline Store Invitation */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-orange-400">Need Computerized Eye Testing?</div>
              <div className="text-[11px] text-slate-300">
                Visit Hassan Optics at Faisal Plaza, Gulburg Chowk, Mianwali.
              </div>
            </div>
            <Link
              href="/book-eye-test"
              className="px-3 py-2 bg-white/10 hover:bg-[#F15A24] text-white text-xs font-semibold rounded-lg shrink-0 transition-colors"
            >
              Book Test
            </Link>
          </div>
        </div>

        {/* Back to Home CTA */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1B2A4A] hover:text-[#F15A24] transition-colors"
          >
            <span>Return to Home</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
