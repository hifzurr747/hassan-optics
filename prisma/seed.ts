import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import path from "path";

const dbPath = path.resolve(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding Hassan Optics database...");

  // 1. Clear existing records in proper order
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.lensOption.deleteMany();
  await prisma.eyeTestAppointment.deleteMany();

  // 2. Seed Lens Options (100% Zero-Power Screen & Fashion options)
  const lensOptions = [
    {
      id: "lens-demo",
      name: "Frame Only (Demo Lenses)",
      price: 0,
      badge: "Standard",
      description: "Original clear brand demo lenses. Ready to wear as fashion eyewear or fit elsewhere.",
    },
    {
      id: "lens-bluecut",
      name: "Zero-Power Blue Cut (Computer Glasses)",
      price: 800,
      badge: "Most Popular",
      description: "Blocks 95%+ harmful digital blue rays from mobile phones, laptops, TVs & tablets. Zero power.",
    },
    {
      id: "lens-antiglare",
      name: "Zero-Power Anti-Glare (AR Coated)",
      price: 600,
      badge: "Night Driving",
      description: "Eliminates reflections, glare & halos during night driving and under fluorescent room lights.",
    },
    {
      id: "lens-photochromic",
      name: "Zero-Power Photochromic (Light Responsive)",
      price: 1200,
      badge: "Indoor/Outdoor",
      description: "Completely clear indoors, transitions into dark grey sunglasses when exposed to outdoor sunlight.",
    },
  ];

  for (const lens of lensOptions) {
    await prisma.lensOption.create({ data: lens });
  }
  console.log("✅ Seeded Lens Options");

  // 3. Seed Products (Eyeglasses, Sunglasses, Contact Lenses)
  const products = [
    // --- Eyeglasses ---
    {
      slug: "dior-montaigne-acetate-frame",
      name: "Dior Montaigne Rectangular Optical Frame",
      brand: "Dior",
      category: "eyeglasses",
      basePrice: 4200,
      discountPrice: 3499,
      description: "Ultra-luxury Italian acetate handcrafted rectangular optical frame. Features refined hinge detailing, lightweight ergonomic nose pads, and distinctive Dior temple branding. Perfect for daily office & screen use.",
      frameType: "Full Rim",
      shape: "Rectangle",
      material: "Acetate",
      gender: "Unisex",
      sizeCategory: "Medium",
      lensWidth: 53,
      bridgeWidth: 17,
      templeLength: 142,
      stockQuantity: 15,
      isFeatured: true,
      isNewArrival: true,
      images: [
        "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { colorName: "Matte Black", colorHex: "#1C1C1C", stock: 8 },
        { colorName: "Tortoiseshell Brown", colorHex: "#8B4513", stock: 7 },
      ],
    },
    {
      slug: "ray-ban-clubmaster-browline",
      name: "Ray-Ban Classic Browline Eyeglass Frame",
      brand: "Ray-Ban",
      category: "eyeglasses",
      basePrice: 3800,
      discountPrice: 2999,
      description: "Timeless vintage browline design crafted with premium acetate and reinforced gold-tone metal alloy rims. A cultural icon suited for both formal meetings and casual wear.",
      frameType: "Full Rim",
      shape: "Square",
      material: "Metal",
      gender: "Unisex",
      sizeCategory: "Medium",
      lensWidth: 51,
      bridgeWidth: 21,
      templeLength: 145,
      stockQuantity: 20,
      isFeatured: true,
      isNewArrival: false,
      images: [
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { colorName: "Ebony Gold", colorHex: "#222222", stock: 12 },
        { colorName: "Havana Bronze", colorHex: "#6E473B", stock: 8 },
      ],
    },
    {
      slug: "bvlgari-serpenti-titanium-round",
      name: "Bvlgari Serpenti Ultralight Titanium Round",
      brand: "Bvlgari",
      category: "eyeglasses",
      basePrice: 5500,
      discountPrice: 4499,
      description: "Featherlight aerospace-grade titanium round frame featuring delicate serpent-scale laser engraving along the temples. Weighs under 14 grams for zero pressure on the nose bridge.",
      frameType: "Full Rim",
      shape: "Round",
      material: "Titanium",
      gender: "Women",
      sizeCategory: "Medium",
      lensWidth: 50,
      bridgeWidth: 19,
      templeLength: 140,
      stockQuantity: 10,
      isFeatured: true,
      isNewArrival: true,
      images: [
        "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { colorName: "Rose Gold", colorHex: "#B76E79", stock: 5 },
        { colorName: "Silver Platinum", colorHex: "#C0C0C0", stock: 5 },
      ],
    },
    {
      slug: "givenchy-geometric-tr90-matte",
      name: "Givenchy Flexible TR90 Geometric Frame",
      brand: "Givenchy",
      category: "eyeglasses",
      basePrice: 3200,
      discountPrice: 2499,
      description: "Ultra-durable, flexible Swiss TR90 thermoplastic polymer frame in modern geometric cut. Shatterproof and sweat-resistant, making it ideal for active lifestyle & long study hours.",
      frameType: "Full Rim",
      shape: "Geometric",
      material: "TR90",
      gender: "Men",
      sizeCategory: "Wide",
      lensWidth: 54,
      bridgeWidth: 18,
      templeLength: 145,
      stockQuantity: 18,
      isFeatured: false,
      isNewArrival: true,
      images: [
        "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { colorName: "Matte Slate Navy", colorHex: "#2C3E50", stock: 10 },
        { colorName: "Charcoal Black", colorHex: "#333333", stock: 8 },
      ],
    },
    {
      slug: "hassan-signature-rimless-titanium",
      name: "Hassan Signature Minimalist Rimless Frame",
      brand: "Hassan Signature",
      category: "eyeglasses",
      basePrice: 3600,
      discountPrice: 2899,
      description: "Engineered specifically for business professionals seeking an invisible optical presence. Mounted with high-tensile screwless titanium alloy hinges and silicone comfort cushions.",
      frameType: "Rimless",
      shape: "Rectangle",
      material: "Titanium",
      gender: "Unisex",
      sizeCategory: "Medium",
      lensWidth: 52,
      bridgeWidth: 18,
      templeLength: 140,
      stockQuantity: 14,
      isFeatured: true,
      isNewArrival: true,
      images: [
        "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { colorName: "Polished Gunmetal", colorHex: "#505050", stock: 7 },
        { colorName: "Silver Titanium", colorHex: "#D3D3D3", stock: 7 },
      ],
    },

    // --- Sunglasses ---
    {
      slug: "ray-ban-aviator-polarized-classic",
      name: "Ray-Ban Aviator Classic Polarized UV400",
      brand: "Ray-Ban",
      category: "sunglasses",
      basePrice: 4800,
      discountPrice: 3999,
      description: "The timeless pilot aviator silhouette with military-grade polarized UV400 lenses that neutralize blinding highway reflections and harsh Punjab summer sunlight.",
      frameType: "Full Rim",
      shape: "Aviator",
      material: "Metal",
      gender: "Unisex",
      sizeCategory: "Wide",
      lensWidth: 58,
      bridgeWidth: 14,
      templeLength: 135,
      stockQuantity: 25,
      isFeatured: true,
      isNewArrival: true,
      images: [
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { colorName: "Gold Frame / G-15 Green", colorHex: "#D4AF37", stock: 15 },
        { colorName: "Black Frame / Smoke Grey", colorHex: "#111111", stock: 10 },
      ],
    },
    {
      slug: "dior-so-real-cat-eye-sunglasses",
      name: "Dior Statement Cat-Eye Architectural Shades",
      brand: "Dior",
      category: "sunglasses",
      basePrice: 5200,
      discountPrice: 4299,
      description: "High-fashion cat-eye frame constructed from polished black acetate with subtle gold metal browlines and gradient UV400 lenses.",
      frameType: "Full Rim",
      shape: "Cat Eye",
      material: "Acetate",
      gender: "Women",
      sizeCategory: "Medium",
      lensWidth: 55,
      bridgeWidth: 18,
      templeLength: 145,
      stockQuantity: 12,
      isFeatured: true,
      isNewArrival: false,
      images: [
        "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { colorName: "Gloss Black", colorHex: "#000000", stock: 7 },
        { colorName: "Amber Tortoise", colorHex: "#A0522D", stock: 5 },
      ],
    },
    {
      slug: "oakley-style-sport-wrap-polar",
      name: "Tactical Sport Wrap Polarized Sunglasses",
      brand: "Givenchy",
      category: "sunglasses",
      basePrice: 3400,
      discountPrice: 2699,
      description: "Wrap-around aerodynamic styling providing 180-degree wind and dust protection. High-contrast polarized coating ideal for driving, biking, and outdoor sports.",
      frameType: "Half Rim",
      shape: "Square",
      material: "TR90",
      gender: "Men",
      sizeCategory: "Wide",
      lensWidth: 62,
      bridgeWidth: 16,
      templeLength: 130,
      stockQuantity: 16,
      isFeatured: false,
      isNewArrival: true,
      images: [
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { colorName: "Matte Black / Ice Blue Mirror", colorHex: "#1E3A8A", stock: 8 },
        { colorName: "Carbon Grey / Red Fire Mirror", colorHex: "#B91C1C", stock: 8 },
      ],
    },

    // --- Contact Lenses ---
    {
      slug: "freshlook-colorblends-cosmetic-lenses",
      name: "FreshLook ColorBlends Monthly Cosmetic Lenses (Pair)",
      brand: "FreshLook",
      category: "contact-lenses",
      basePrice: 2200,
      discountPrice: 1899,
      description: "3-in-1 color blend technology that seamlessly blends with your natural eye color for a breathtaking, natural look. 55% water content for all-day moisture. Includes lens storage case.",
      frameType: null,
      shape: null,
      material: "Phemfilcon A (Hydrogel)",
      gender: "Unisex",
      sizeCategory: "Medium",
      lensWidth: null,
      bridgeWidth: null,
      templeLength: null,
      stockQuantity: 40,
      isFeatured: true,
      isNewArrival: true,
      images: [
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { colorName: "Pure Hazel", colorHex: "#8E7051", stock: 15 },
        { colorName: "Sterling Gray", colorHex: "#808A87", stock: 15 },
        { colorName: "Gemstone Green", colorHex: "#2E8B57", stock: 10 },
      ],
    },
    {
      slug: "opti-free-puremoist-solution-kit",
      name: "Complete Multi-Purpose Contact Lens Solution (300ml + Case)",
      brand: "Hassan Signature",
      category: "contact-lenses",
      basePrice: 1100,
      discountPrice: 950,
      description: "Provides 16 hours of all-day moisture cushion. Removes protein buildup, cleans, rinses, disinfects, and stores soft silicone hydrogel contact lenses. Includes free antimicrobial lens case.",
      frameType: null,
      shape: null,
      material: "HydraGlyde Formula",
      gender: "Unisex",
      sizeCategory: null,
      lensWidth: null,
      bridgeWidth: null,
      templeLength: null,
      stockQuantity: 50,
      isFeatured: false,
      isNewArrival: false,
      images: [
        "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { colorName: "Standard 300ml Kit", colorHex: "#3B82F6", stock: 50 },
      ],
    },
  ];

  for (const item of products) {
    const { images, variants, ...prodData } = item;
    const createdProduct = await prisma.product.create({
      data: prodData,
    });

    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          url: images[i],
          isPrimary: i === 0,
          altText: `${item.name} View ${i + 1}`,
        },
      });
    }

    for (const v of variants) {
      await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,
          colorName: v.colorName,
          colorHex: v.colorHex,
          stock: v.stock,
        },
      });
    }
  }
  console.log(`✅ Seeded ${products.length} Products with images & variants`);

  // 4. Seed Initial Demonstration Orders
  const firstProduct = await prisma.product.findUnique({
    where: { slug: "dior-montaigne-acetate-frame" },
  });

  if (firstProduct) {
    const demoOrder = await prisma.order.create({
      data: {
        id: "HO-1001",
        customerName: "Muhammad Usman Khan",
        phone: "03001234567",
        email: "usman.khan@gmail.com",
        city: "Mianwali (Local Delivery)",
        address: "House 14, Street 2, PAF Road, Near College Chowk, Mianwali",
        orderNotes: "Please call before delivery.",
        subtotal: 3499,
        shippingFee: 0,
        discountCode: null,
        discountAmount: 0,
        totalAmount: 3499 + 800, // frame + blue cut
        paymentMethod: "COD",
        status: "CONFIRMED",
        courierName: "TCS Express",
        trackingNumber: "TCS-928374102",
        items: {
          create: [
            {
              productId: firstProduct.id,
              productName: firstProduct.name,
              brandName: firstProduct.brand,
              selectedColor: "Matte Black",
              lensOption: "Zero-Power Blue Cut (Computer Glasses)",
              lensPrice: 800,
              unitPrice: 3499,
              quantity: 1,
              totalPrice: 4299,
            },
          ],
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
    });
    console.log(`✅ Seeded Demo Order ${demoOrder.id}`);
  }

  // 5. Seed Demonstration Eye Test Appointment
  const demoAppointment = await prisma.eyeTestAppointment.create({
    data: {
      appointmentRef: "ETA-801",
      customerName: "Tariq Mehmood Niazi",
      phone: "03129876543",
      appointmentDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
      timeSlot: "11:30 AM - 12:00 PM",
      preferredBranch: "Faisal Plaza, Gulburg Chowk, Mianwali",
      status: "CONFIRMED",
      notes: "Routine eye exam & vision sharpness check.",
    },
  });
  console.log(`✅ Seeded Demo Appointment ${demoAppointment.appointmentRef}`);

  console.log("🚀 Hassan Optics database successfully seeded!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
