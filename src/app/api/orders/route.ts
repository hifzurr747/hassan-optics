import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      phone,
      email,
      city,
      address,
      orderNotes,
      subtotal,
      shippingFee,
      discountCode,
      discountAmount,
      totalAmount,
      items,
    } = body;

    if (!customerName || !phone || !address || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required order fields or empty cart" },
        { status: 400 }
      );
    }

    // Generate readable Order ID
    const orderCount = await prisma.order.count();
    const orderId = `HO-${1001 + orderCount}`;

    const newOrder = await prisma.order.create({
      data: {
        id: orderId,
        customerName,
        phone,
        email: email || null,
        city: city || "Mianwali",
        address,
        orderNotes: orderNotes || null,
        subtotal: Number(subtotal),
        shippingFee: Number(shippingFee),
        discountCode: discountCode || null,
        discountAmount: Number(discountAmount) || 0,
        totalAmount: Number(totalAmount),
        paymentMethod: "COD",
        status: "CONFIRMED",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            brandName: item.brandName,
            selectedColor: item.selectedColor || null,
            lensOption: item.lensOption,
            lensPrice: Number(item.lensPrice) || 0,
            unitPrice: Number(item.unitPrice),
            quantity: Number(item.quantity) || 1,
            totalPrice: Number(item.totalPrice),
          })),
        },
        statusHistory: {
          create: [
            {
              status: "Order Confirmed",
              note: "Customer confirmed COD order via web portal.",
            },
          ],
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ success: true, orderId: newOrder.id });
  } catch (error: any) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to place order" },
      { status: 500 }
    );
  }
}
