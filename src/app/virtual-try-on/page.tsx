import prisma from "@/lib/prisma";
import VirtualTryOnClient from "@/components/try-on/VirtualTryOnClient";
import Script from "next/script";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Virtual Eyewear Try-On • AI Auto-Fit Mirror | Hassan Optics",
  description:
    "Upload your photo or use live camera to virtually try on Ray-Ban, Dior, and designer eyeglasses & sunglasses with instant AI face auto-fit before buying with Cash on Delivery.",
};

const SHAPE_FRAME_MAP: Record<string, string> = {
  "ray-ban-aviator-polarized-classic": "/images/frames/sg_1.png",
  "dior-montaigne-acetate-frame": "/images/frames/gl_1.png",
  "ray-ban-clubmaster-browline": "/images/frames/sg_25.png",
  "bvlgari-serpenti-titanium-round": "/images/frames/gl_63.png",
  "dior-so-real-cat-eye-sunglasses": "/images/frames/sg_70.png",
  "hassan-signature-rimless-titanium": "/images/frames/gl_18.png",
  "givenchy-geometric-tr90-matte": "/images/frames/sg_12.png",
  "oakley-style-sport-wrap-polar": "/images/frames/sg_63.png",
};

interface VirtualTryOnPageProps {
  searchParams: Promise<{
    frame?: string;
  }>;
}

export default async function VirtualTryOnPage({
  searchParams,
}: VirtualTryOnPageProps) {
  const params = await searchParams;
  const initialSlug = params.frame;

  const dbProducts = await prisma.product.findMany({
    where: {
      category: { in: ["eyeglasses", "sunglasses"] },
    },
    include: {
      images: { orderBy: { isPrimary: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  const products = dbProducts.map((p) => {
    // Map overlay by slug or fallback by shape
    let overlay = SHAPE_FRAME_MAP[p.slug];
    if (!overlay) {
      if (p.shape === "Aviator") overlay = "/images/frames/sg_1.png";
      else if (p.shape === "Round") overlay = "/images/frames/gl_63.png";
      else if (p.shape === "Cat Eye") overlay = "/images/frames/sg_70.png";
      else if (p.shape === "Geometric") overlay = "/images/frames/sg_12.png";
      else if (p.category === "eyeglasses") overlay = "/images/frames/gl_1.png";
      else overlay = "/images/frames/sg_12.png";
    }

    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      category: p.category,
      shape: p.shape,
      basePrice: p.basePrice,
      discountPrice: p.discountPrice,
      material: p.material,
      frameOverlay: overlay,
      imageUrl: p.images[0]?.url || "",
    };
  });

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js"
        strategy="afterInteractive"
      />
      <VirtualTryOnClient products={products} initialSlug={initialSlug} />
    </>
  );
}
