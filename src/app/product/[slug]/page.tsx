import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/product/ProductDetailClient";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { isPrimary: "desc" } },
      variants: true,
    },
  });

  if (!product) {
    notFound();
  }

  const lensOptions = await prisma.lensOption.findMany({
    orderBy: { price: "asc" },
  });

  const relatedProducts = await prisma.product.findMany({
    where: {
      category: product.category,
      id: { not: product.id },
    },
    include: {
      images: { orderBy: { isPrimary: "desc" } },
      variants: true,
    },
    take: 4,
  });

  return (
    <ProductDetailClient
      product={product}
      lensOptions={lensOptions}
      relatedProducts={relatedProducts}
    />
  );
}
