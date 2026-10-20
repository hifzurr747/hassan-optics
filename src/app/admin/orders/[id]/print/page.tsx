import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { STORE_INFO, FREE_ACCESSORIES_NOTE } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import PrintButton from "@/app/order-success/[orderId]/PrintButton";
import { Glasses, MapPin, Phone, CheckSquare } from "lucide-react";

export const dynamic = "force-dynamic";

interface PrintInvoicePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PrintInvoicePage({ params }: PrintInvoicePageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen text-black p-6 sm:p-10 max-w-3xl mx-auto font-sans print:p-0">
      {/* Top screen-only action bar */}
      <div className="print:hidden flex items-center justify-between pb-6 mb-6 border-b border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Dispatch Label & Invoice Preview</h1>
          <p className="text-xs text-slate-500">Order #{order.id} • Cash on Delivery</p>
        </div>
        <PrintButton />
      </div>

      {/* Outer Printable Border / Parcel Label Container */}
      <div className="border-2 border-black rounded-xl p-6 sm:p-8 space-y-6">
        {/* Label Header */}
        <div className="flex items-start justify-between pb-4 border-b-2 border-black gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black uppercase tracking-wider">HASSAN OPTICS</span>
            </div>
            <p className="text-xs font-semibold">{STORE_INFO.address}</p>
            <p className="text-xs">{STORE_INFO.city}, Pakistan • Tel: {STORE_INFO.phone}</p>
          </div>

          <div className="text-right">
            <span className="inline-block border-2 border-black px-3 py-1 font-black text-sm uppercase">
              C.O.D. PARCEL
            </span>
            <div className="font-mono font-bold text-lg mt-1">#{order.id}</div>
            <div className="text-[11px] text-neutral-600">
              Date: {new Date(order.createdAt).toLocaleDateString("en-PK")}
            </div>
          </div>
        </div>

        {/* Courier Dispatch & COD Amount Box */}
        <div className="grid grid-cols-2 gap-4 border-2 border-black p-4 bg-neutral-50">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
              DELIVER TO CUSTOMER:
            </span>
            <div className="text-base font-black mt-0.5">{order.customerName}</div>
            <div className="text-xs font-medium mt-1 leading-snug">{order.address}</div>
            <div className="text-sm font-bold uppercase mt-1">{order.city}</div>
            <div className="text-xs font-bold mt-2">Mobile: {order.phone}</div>
          </div>

          <div className="border-l-2 border-black pl-4 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                CASH TO COLLECT (COD):
              </span>
              <div className="text-3xl font-black text-black mt-1">
                {formatPrice(order.totalAmount)}
              </div>
              <div className="text-[11px] text-neutral-600 mt-0.5">
                (Includes products + courier delivery)
              </div>
            </div>

            <div className="text-[11px] pt-2 border-t border-neutral-300">
              Courier: <strong>{order.courierName || "TCS Express"}</strong>
            </div>
          </div>
        </div>

        {/* Order Items List */}
        <div>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-black font-bold uppercase text-[11px]">
                <th className="py-2">Item Description</th>
                <th className="py-2">Lens Specification</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Unit Price</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-300">
              {order.items.map((i) => (
                <tr key={i.id}>
                  <td className="py-2 font-bold">
                    {i.productName}
                    {i.selectedColor && (
                      <span className="block font-normal text-neutral-600">
                        Color: {i.selectedColor}
                      </span>
                    )}
                  </td>
                  <td className="py-2">{i.lensOption}</td>
                  <td className="py-2 text-center font-bold">{i.quantity}</td>
                  <td className="py-2 text-right">{formatPrice(i.unitPrice + i.lensPrice)}</td>
                  <td className="py-2 text-right font-bold">{formatPrice(i.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Calculation */}
        <div className="pt-2 border-t-2 border-black flex justify-end">
          <div className="w-64 space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-bold">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discountAmount && order.discountAmount > 0 ? (
              <div className="flex justify-between font-semibold">
                <span>Discount ({order.discountCode}):</span>
                <span>-{formatPrice(order.discountAmount)}</span>
              </div>
            ) : null}
            <div className="flex justify-between">
              <span>Shipping Fee:</span>
              <span className="font-bold">
                {order.shippingFee === 0 ? "FREE" : formatPrice(order.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-black pt-2 border-t border-black">
              <span>Total Payable:</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Packing Quality Checklist (For optical workshop) */}
        <div className="border border-neutral-400 p-3 rounded-lg text-xs space-y-1">
          <span className="font-bold block uppercase tracking-wider text-[10px]">
            Hassan Optics Packing Quality Control:
          </span>
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <label className="flex items-center gap-1.5">
              <input type="checkbox" defaultChecked className="accent-black" />
              <span>Hard Case Enclosed</span>
            </label>
            <label className="flex items-center gap-1.5">
              <input type="checkbox" defaultChecked className="accent-black" />
              <span>Microfiber Cloth Enclosed</span>
            </label>
            <label className="flex items-center gap-1.5">
              <input type="checkbox" defaultChecked className="accent-black" />
              <span>Zero-Power Inspected</span>
            </label>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-[10px] text-neutral-500 pt-2">
          Thank you for choosing Hassan Optics! Helpline: {STORE_INFO.phone} • Faisal Plaza, Gulburg Chowk, Mianwali
        </div>
      </div>
    </div>
  );
}
