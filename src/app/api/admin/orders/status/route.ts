import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { orderId, status, courierName, trackingNumber, note } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Order ID and Status are required" },
        { status: 400 }
      );
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        courierName: courierName || undefined,
        trackingNumber: trackingNumber || undefined,
        statusHistory: {
          create: {
            status,
            note: note || `Order status updated to ${status}`,
          },
        },
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update status" },
      { status: 500 }
    );
  }
}
