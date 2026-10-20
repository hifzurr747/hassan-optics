"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import {
  Upload,
  Camera,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Download,
  Share2,
  Sparkles,
  ShoppingBag,
  Zap,
  Eye,
  Check,
  EyeOff,
  Move,
  RotateCw,
} from "lucide-react";

interface TryOnProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  shape: string | null;
  basePrice: number;
  discountPrice: number | null;
  material: string | null;
  frameOverlay: string;
  imageUrl: string;
}

interface VirtualTryOnClientProps {
  products: TryOnProduct[];
  initialSlug?: string;
}

const SAMPLE_MODELS = [
  {
    id: "model-m1",
    label: "Male (Front)",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    defaultY: 38,
  },
  {
    id: "model-f1",
    label: "Female (Front)",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    defaultY: 37,
  },
  {
    id: "model-m2",
    label: "Male (Classic)",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    defaultY: 40,
  },
  {
    id: "model-f2",
    label: "Female (Style)",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    defaultY: 36,
  },
];

export default function VirtualTryOnClient({
  products,
  initialSlug,
}: VirtualTryOnClientProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  // Selected frame
  const initialProduct =
    products.find((p) => p.slug === initialSlug) || products[0];
  const [selectedProduct, setSelectedProduct] = useState<TryOnProduct>(initialProduct);

  // Face image state
  const [faceImage, setFaceImage] = useState<string>(SAMPLE_MODELS[0].url);
  const [isCustomPhoto, setIsCustomPhoto] = useState(false);

  // Position and transform states
  // position X & Y in percentage relative to container
  const [posX, setPosX] = useState(50); // center
  const [posY, setPosY] = useState(38); // approximate eye level
  const [scale, setScale] = useState(100); // 100%
  const [rotation, setRotation] = useState(0); // 0 degrees
  const [showGlasses, setShowGlasses] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, startPosX: 50, startPosY: 38 });

  // References
  const stageRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // When initialSlug prop changes
  useEffect(() => {
    if (initialSlug) {
      const match = products.find((p) => p.slug === initialSlug);
      if (match) setSelectedProduct(match);
    }
  }, [initialSlug, products]);

  // Handle User Photo Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFaceImage(event.target.result as string);
          setIsCustomPhoto(true);
          // Reset adjustments for new face
          setPosX(50);
          setPosY(38);
          setScale(100);
          setRotation(0);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Dragging logic (supports both mouse and mobile touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      startPosX: posX,
      startPosY: posY,
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

    setPosX(Math.max(10, Math.min(90, dragStart.startPosX + deltaX)));
    setPosY(Math.max(10, Math.min(90, dragStart.startPosY + deltaY)));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setPosX(50);
    setPosY(38);
    setScale(100);
    setRotation(0);
  };

  // Add selected frame to cart
  const handleAddToCart = (redirect = false) => {
    const price = selectedProduct.discountPrice ?? selectedProduct.basePrice;
    addItem({
      productId: selectedProduct.id,
      slug: selectedProduct.slug,
      name: selectedProduct.name,
      brand: selectedProduct.brand,
      image: selectedProduct.imageUrl,
      lensOption:
        selectedProduct.category === "eyeglasses"
          ? "Zero-Power Blue Cut (Computer Glasses)"
          : "UV400 Polarized (Included)",
      lensPrice: selectedProduct.category === "eyeglasses" ? 800 : 0,
      unitPrice: price,
      quantity: 1,
    });

    if (redirect) {
      router.push("/checkout");
    }
  };

  // Generate downloadable combined photo via Canvas
  const handleDownload = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const faceImg = new window.Image();
    faceImg.crossOrigin = "anonymous";
    faceImg.src = faceImage;

    faceImg.onload = () => {
      canvas.width = faceImg.naturalWidth || 800;
      canvas.height = faceImg.naturalHeight || 800;

      // Draw Face
      ctx.drawImage(faceImg, 0, 0, canvas.width, canvas.height);

      if (showGlasses) {
        const frameImg = new window.Image();
        frameImg.crossOrigin = "anonymous";
        frameImg.src = selectedProduct.frameOverlay;

        frameImg.onload = () => {
          ctx.save();

          // Calculate center coordinates
          const centerX = (posX / 100) * canvas.width;
          const centerY = (posY / 100) * canvas.height;

          ctx.translate(centerX, centerY);
          ctx.rotate((rotation * Math.PI) / 180);

          // Frame dimensions relative to face width
          const frameWidth = (canvas.width * 0.65 * scale) / 100;
          const frameHeight = frameWidth * (220 / 600); // 600x220 aspect

          ctx.drawImage(
            frameImg,
            -frameWidth / 2,
            -frameHeight / 2,
            frameWidth,
            frameHeight
          );
          ctx.restore();

          // Add Hassan Optics Brand Watermark at bottom
          ctx.fillStyle = "rgba(11, 19, 34, 0.85)";
          ctx.fillRect(0, canvas.height - 48, canvas.width, 48);
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "bold 16px sans-serif";
          ctx.fillText(
            `Hassan Optics Mianwali • ${selectedProduct.name}`,
            16,
            canvas.height - 18
          );

          // Trigger Download
          const a = document.createElement("a");
          a.download = `Hassan-Optics-${selectedProduct.slug}-TryOn.png`;
          a.href = canvas.toDataURL("image/png");
          a.click();
        };
      }
    };
  };

  const activePrice = selectedProduct.discountPrice ?? selectedProduct.basePrice;

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-[#F15A24] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Virtual Eyewear Mirror</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#1B2A4A] tracking-tight">
            Virtual Try-On • Hassan Optics
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Upload your selfie or pick a sample face to test any optical frame or sunglasses instantly on your face before buying with Cash on Delivery.
          </p>
        </div>

        {/* Main Interactive Stage & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Interactive Try-On Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full max-w-lg bg-white rounded-3xl p-3 sm:p-5 border border-slate-200 shadow-md">
              {/* Canvas Viewport */}
              <div
                ref={stageRef}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900 shadow-inner select-none touch-none cursor-grab active:cursor-grabbing border border-slate-200"
              >
                {/* Face Background Image */}
                <Image
                  src={faceImage}
                  alt="Face Model"
                  fill
                  priority
                  className="object-cover object-center pointer-events-none"
                />

                {/* Overlaid Glasses Frame */}
                {showGlasses && (
                  <div
                    onPointerDown={handlePointerDown}
                    style={{
                      position: "absolute",
                      left: `${posX}%`,
                      top: `${posY}%`,
                      width: `${60 * (scale / 100)}%`,
                      transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                      transformOrigin: "center center",
                      transition: isDragging ? "none" : "transform 0.1s ease-out",
                    }}
                    className="z-20 cursor-move"
                  >
                    {/* SVG Frame Asset */}
                    <div className="relative aspect-[600/220] w-full drop-shadow-xl filter">
                      <Image
                        src={selectedProduct.frameOverlay}
                        alt={selectedProduct.name}
                        fill
                        className="object-contain pointer-events-none"
                      />
                    </div>
                  </div>
                )}

                {/* Live Floating Indicators & Controls on Canvas */}
                <div className="absolute top-3 left-3 z-30 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-bold border border-white/20 flex items-center gap-1">
                    <Move className="w-3 h-3 text-orange-400" /> Drag to adjust
                  </span>
                </div>

                <div className="absolute top-3 right-3 z-30">
                  <button
                    type="button"
                    onClick={() => setShowGlasses(!showGlasses)}
                    className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 text-xs font-bold shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                    title="Toggle glasses on/off"
                  >
                    {showGlasses ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                        <span>Hide Frame</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Show Frame</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Active Frame Pill at Bottom */}
                <div className="absolute bottom-3 left-3 right-3 z-30 bg-white/95 backdrop-blur-md rounded-xl p-2.5 shadow-lg border border-slate-100 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <div className="text-[10px] font-bold text-[#F15A24] uppercase tracking-wider">
                      {selectedProduct.brand} • {selectedProduct.shape}
                    </div>
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {selectedProduct.name}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-[#1B2A4A] block">
                      {formatPrice(activePrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Slider Controls Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-3 px-1">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {/* Size Scale Slider */}
                  <div>
                    <div className="flex items-center justify-between text-slate-600 font-semibold mb-1">
                      <span className="flex items-center gap-1">
                        <ZoomIn className="w-3 h-3 text-[#F15A24]" /> Size / Scale
                      </span>
                      <span className="text-[11px] font-bold text-slate-900">{scale}%</span>
                    </div>
                    <input
                      type="range"
                      min="70"
                      max="140"
                      value={scale}
                      onChange={(e) => setScale(Number(e.target.value))}
                      className="w-full accent-[#F15A24] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Rotate Angle Slider */}
                  <div>
                    <div className="flex items-center justify-between text-slate-600 font-semibold mb-1">
                      <span className="flex items-center gap-1">
                        <RotateCw className="w-3 h-3 text-[#F15A24]" /> Tilt Angle
                      </span>
                      <span className="text-[11px] font-bold text-slate-900">{rotation}°</span>
                    </div>
                    <input
                      type="range"
                      min="-25"
                      max="25"
                      value={rotation}
                      onChange={(e) => setRotation(Number(e.target.value))}
                      className="w-full accent-[#F15A24] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center justify-between pt-1 gap-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Position</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
                      title="Save photo to your device"
                    >
                      <Download className="w-3.5 h-3.5 text-[#F15A24]" />
                      <span>Save Photo</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Photo Picker, Details, and Buying Options */}
          <div className="lg:col-span-5 space-y-6">
            {/* Step 1: Face Photo Selection */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#F15A24]" />
                  <span>Step 1: Choose Your Face</span>
                </h3>
                {isCustomPhoto && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Custom Photo
                  </span>
                )}
              </div>

              {/* Upload Button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-[#F15A24]/40 hover:border-[#F15A24] bg-orange-50/50 hover:bg-orange-50 rounded-2xl text-xs font-bold text-[#F15A24] transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Selfie or Take Photo (Private)</span>
              </button>

              {/* Sample Models Selection */}
              <div>
                <span className="text-[11px] text-slate-500 font-medium block mb-2">
                  Or pick a sample face model:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {SAMPLE_MODELS.map((m) => {
                    const isSelected = faceImage === m.url;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setFaceImage(m.url);
                          setIsCustomPhoto(false);
                          setPosX(50);
                          setPosY(m.defaultY);
                          setScale(100);
                          setRotation(0);
                        }}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                          isSelected
                            ? "border-[#F15A24] ring-2 ring-[#F15A24]/30"
                            : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image src={m.url} alt={m.label} fill className="object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-semibold text-center py-0.5">
                          {m.label.split(" ")[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 2: Selected Frame & Purchase Actions */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-[#F15A24] uppercase tracking-wider block">
                    {selectedProduct.brand} Eyewear
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    {selectedProduct.name}
                  </h2>
                </div>
                <div className="text-right">
                  <div className="text-lg font-extrabold text-[#1B2A4A]">
                    {formatPrice(activePrice)}
                  </div>
                  {selectedProduct.discountPrice && (
                    <span className="text-xs text-slate-400 line-through">
                      {formatPrice(selectedProduct.basePrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Free Accessories & COD Notice */}
              <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-slate-600 space-y-1 border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#F15A24]" />
                  <span>Free Magnetic Hard Case + Microfiber Cloth</span>
                </div>
                <div>100% Cash on Delivery across Pakistan. Ready to wear.</div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleAddToCart(false)}
                  className="w-full flex items-center justify-center gap-1.5 py-3 px-4 bg-[#1B2A4A] text-white text-xs font-bold rounded-xl hover:bg-[#142037] transition-all shadow-md active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 text-orange-400" />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAddToCart(true)}
                  className="w-full flex items-center justify-center gap-1.5 py-3 px-4 bg-[#F15A24] text-white text-xs font-bold rounded-xl hover:bg-[#d84817] transition-all shadow-md active:scale-95 shadow-orange-950/20"
                >
                  <Zap className="w-4 h-4" />
                  <span>Buy Now (COD)</span>
                </button>
              </div>

              <div className="text-center pt-1">
                <Link
                  href={`/product/${selectedProduct.slug}`}
                  className="text-xs text-slate-500 hover:text-[#F15A24] font-semibold underline underline-offset-2"
                >
                  View full product specifications & reviews →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Interactive Frames Carousel */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F15A24]">
                Browse & Swap
              </span>
              <h3 className="text-lg font-black text-[#1B2A4A]">
                Click Any Frame to Try On Your Face
              </h3>
            </div>
            <Link
              href="/shop"
              className="text-xs font-semibold text-[#1B2A4A] hover:text-[#F15A24]"
            >
              View Full Shop →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {products.map((p) => {
              const isSelected = selectedProduct.id === p.id;
              const price = p.discountPrice ?? p.basePrice;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedProduct(p)}
                  className={`text-left p-2.5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-[#F15A24] bg-orange-50/40 ring-2 ring-[#F15A24]/20 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="relative aspect-[600/220] w-full mb-2 bg-slate-50 rounded-lg p-1 overflow-hidden border border-slate-100">
                    <Image
                      src={p.frameOverlay}
                      alt={p.name}
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      {p.brand}
                    </div>
                    <div className="text-[11px] font-bold text-slate-900 line-clamp-1 leading-tight">
                      {p.name.split(" ")[0]} {p.name.split(" ")[1]}
                    </div>
                    <div className="text-xs font-extrabold text-[#1B2A4A] mt-1">
                      {formatPrice(price)}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-1.5 pt-1 border-t border-orange-200 text-[10px] font-bold text-[#F15A24] flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Wearing</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
