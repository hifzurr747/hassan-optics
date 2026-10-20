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

    const safeSubtotal = Number(subtotal) || 0;
    const safeShippingFee = Number(shippingFee) || 0;
    const safeDiscountAmount = Number(discountAmount) || 0;
    const safeTotalAmount =
      Number(totalAmount) || Math.max(0, safeSubtotal + safeShippingFee - safeDiscountAmount);

    // Resolve product IDs if a slug was passed instead of cuid
    const resolvedItems = await Promise.all(
      items.map(async (item: any) => {
        let validProductId = item.productId;
        const found = await prisma.product.findFirst({
          where: {
            OR: [{ id: item.productId }, { slug: item.productId }],
          },
          select: { id: true, name: true, brand: true },
        });

        if (found) {
          validProductId = found.id;
        }

        const unitPrice = Number(item.unitPrice) || 0;
        const lensPrice = Number(item.lensPrice) || 0;
        const quantity = Number(item.quantity) || 1;
        const itemTotal = Number(item.totalPrice) || (unitPrice + lensPrice) * quantity;

        return {
          productId: validProductId,
          productName: item.productName || found?.name || "Optical Item",
          brandName: item.brandName || found?.brand || "Hassan Optics",
          selectedColor: item.selectedColor || null,
          lensOption: item.lensOption || "Standard",
          lensPrice,
          unitPrice,
          quantity,
          totalPrice: itemTotal,
        };
      })
    );

    const newOrder = await prisma.order.create({
      data: {
        id: orderId,
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email ? email.trim() : null,
        city: city ? city.trim() : "Mianwali",
        address: address.trim(),
        orderNotes: orderNotes ? orderNotes.trim() : null,
        subtotal: safeSubtotal,
        shippingFee: safeShippingFee,
        discountCode: discountCode || null,
        discountAmount: safeDiscountAmount,
        totalAmount: safeTotalAmount,
        paymentMethod: "COD",
        status: "CONFIRMED",
        items: {
          create: resolvedItems,
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
