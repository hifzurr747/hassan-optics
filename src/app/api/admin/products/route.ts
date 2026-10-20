import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
        variants: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      brand,
      category,
      basePrice,
      discountPrice,
      description,
      frameType,
      shape,
      material,
      gender,
      stockQuantity,
      imageUrl,
    } = body;

    if (!name || !slug || !brand || !category || !basePrice || !description) {
      return NextResponse.json(
        { error: "Missing required product fields" },
        { status: 400 }
      );
    }

    const created = await prisma.product.create({
      data: {
        name,
        slug,
        brand,
        category,
        basePrice: parseFloat(basePrice),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        description,
        frameType: frameType || null,
        shape: shape || null,
        material: material || null,
        gender: gender || "Unisex",
        stockQuantity: parseInt(stockQuantity) || 10,
        images: imageUrl
          ? {
              create: [
                {
                  url: imageUrl,
                  isPrimary: true,
                  altText: name,
                },
              ],
            }
          : undefined,
      },
      include: { images: true },
    });

    return NextResponse.json({ success: true, product: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
