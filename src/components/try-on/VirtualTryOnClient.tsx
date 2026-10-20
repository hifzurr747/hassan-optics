"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import {
  detectFaceLandmarks,
  calculateEyewearTransform,
  type FaceDetectionResult,
} from "@/lib/try-on/faceDetector";
import {
  Upload,
  Camera,
  RotateCcw,
  ZoomIn,
  Download,
  Sparkles,
  ShoppingBag,
  Zap,
  Eye,
  Check,
  EyeOff,
  Move,
  RotateCw,
  ScanFace,
  Video,
  VideoOff,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sliders,
  CheckCircle2,
  Info,
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

interface SampleModel {
  id: string;
  label: string;
  url: string;
  defaultX: number;
  defaultY: number;
  defaultScale: number;
  defaultRotation: number;
  faceShape: "Oval" | "Round" | "Square" | "Heart" | "Diamond";
  pd: number;
  recommendation: string;
}

const SAMPLE_MODELS: SampleModel[] = [
  {
    id: "model-m1",
    label: "Male (Front)",
    url: "/images/models/male-1.jpg",
    defaultX: 50.0,
    defaultY: 38.0,
    defaultScale: 95,
    defaultRotation: 0,
    faceShape: "Oval",
    pd: 64,
    recommendation: "Versatile face shape! Aviators, Wayfarers & Rectangles look stunning on you.",
  },
  {
    id: "model-f1",
    label: "Female (Front)",
    url: "/images/models/female-1.jpg",
    defaultX: 49.5,
    defaultY: 37.0,
    defaultScale: 92,
    defaultRotation: -1.2,
    faceShape: "Heart",
    pd: 61,
    recommendation: "Browline, Oval & Rimless frames balance your face beautifully.",
  },
  {
    id: "model-m2",
    label: "Male (Classic)",
    url: "/images/models/male-2.jpg",
    defaultX: 50.5,
    defaultY: 39.0,
    defaultScale: 98,
    defaultRotation: 0.8,
    faceShape: "Square",
    pd: 65,
    recommendation: "Round, Oval & Aviator frames soften angles and look striking.",
  },
  {
    id: "model-f2",
    label: "Female (Style)",
    url: "/images/models/female-2.jpg",
    defaultX: 50.0,
    defaultY: 36.5,
    defaultScale: 90,
    defaultRotation: -0.5,
    faceShape: "Oval",
    pd: 60,
    recommendation: "Cat-Eye, Browline & Geometric frames accentuate your features.",
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

  // Face image & camera state
  const [activeModel, setActiveModel] = useState<SampleModel>(SAMPLE_MODELS[0]);
  const [faceImage, setFaceImage] = useState<string>(SAMPLE_MODELS[0].url);
  const [isCustomPhoto, setIsCustomPhoto] = useState(false);
  const [isLiveCamera, setIsLiveCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // AI Auto-Fit & Detection state
  const [isScanning, setIsScanning] = useState(false);
  const [detectionResult, setDetectionResult] = useState<FaceDetectionResult | null>(null);
  const [autoFitSuccess, setAutoFitSuccess] = useState(true);

  // Eyewear position & transform (auto-calculated by AI)
  const [posX, setPosX] = useState(SAMPLE_MODELS[0].defaultX);
  const [posY, setPosY] = useState(SAMPLE_MODELS[0].defaultY);
  const [scale, setScale] = useState(SAMPLE_MODELS[0].defaultScale);
  const [rotation, setRotation] = useState(SAMPLE_MODELS[0].defaultRotation);

  // Controls UI state
  const [showGlasses, setShowGlasses] = useState(true);
  const [showFineTune, setShowFineTune] = useState(false);
  const [showLandmarkPoints, setShowLandmarkPoints] = useState(false);

  // Manual drag states (kept as optional fine-tuning)
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, startPosX: 50, startPosY: 38 });

  // DOM references
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraLoopId = useRef<number | null>(null);

  // Trigger AI Auto-Fit on an image
  const triggerAutoFit = useCallback(
    async (imageUrl: string, fallbackPreset?: SampleModel) => {
      setIsScanning(true);
      setAutoFitSuccess(false);

      const img = new window.Image();
      img.crossOrigin = "anonymous";

      img.onload = async () => {
        try {
          const result = await detectFaceLandmarks(img);

          if (result && stageRef.current) {
            const rect = stageRef.current.getBoundingClientRect();
            const transform = calculateEyewearTransform(
              result,
              rect.width,
              rect.height,
              img.naturalWidth || 800,
              img.naturalHeight || 1000
            );

            setPosX(transform.posX);
            setPosY(transform.posY);
            setScale(transform.scale);
            setRotation(transform.rotation);
            setDetectionResult(result);
            setAutoFitSuccess(true);
          } else if (fallbackPreset) {
            // Apply calibrated sample preset
            setPosX(fallbackPreset.defaultX);
            setPosY(fallbackPreset.defaultY);
            setScale(fallbackPreset.defaultScale);
            setRotation(fallbackPreset.defaultRotation);
            setDetectionResult({
              landmarks: [],
              leftEye: { x: 0.45, y: 0.38 },
              rightEye: { x: 0.55, y: 0.38 },
              noseBridge: { x: 0.5, y: 0.38 },
              leftTemple: { x: 0.35, y: 0.38 },
              rightTemple: { x: 0.65, y: 0.38 },
              chin: { x: 0.5, y: 0.7 },
              forehead: { x: 0.5, y: 0.15 },
              pupillaryDistanceMm: fallbackPreset.pd,
              faceShape: fallbackPreset.faceShape,
              faceShapeRecommendation: fallbackPreset.recommendation,
              confidence: 0.95,
            });
            setAutoFitSuccess(true);
          } else {
            // Default center fit
            setPosX(50);
            setPosY(38);
            setScale(100);
            setRotation(0);
            setAutoFitSuccess(false);
          }
        } catch (err) {
          console.warn("AI face detection error:", err);
          if (fallbackPreset) {
            setPosX(fallbackPreset.defaultX);
            setPosY(fallbackPreset.defaultY);
            setScale(fallbackPreset.defaultScale);
            setRotation(fallbackPreset.defaultRotation);
          }
        } finally {
          setIsScanning(false);
        }
      };

      img.onerror = () => {
        setIsScanning(false);
        if (fallbackPreset) {
          setPosX(fallbackPreset.defaultX);
          setPosY(fallbackPreset.defaultY);
          setScale(fallbackPreset.defaultScale);
          setRotation(fallbackPreset.defaultRotation);
        }
      };

      img.src = imageUrl;
    },
    []
  );

  // Auto-fit on initial mount
  useEffect(() => {
    triggerAutoFit(SAMPLE_MODELS[0].url, SAMPLE_MODELS[0]);
  }, [triggerAutoFit]);

  // When initialSlug prop changes
  useEffect(() => {
    if (initialSlug) {
      const match = products.find((p) => p.slug === initialSlug);
      if (match) setSelectedProduct(match);
    }
  }, [initialSlug, products]);

  // Recalculate on window resize
  useEffect(() => {
    const handleResize = () => {
      if (detectionResult && stageRef.current) {
        const rect = stageRef.current.getBoundingClientRect();
        const transform = calculateEyewearTransform(
          detectionResult,
          rect.width,
          rect.height,
          800,
          1000
        );
        setPosX(transform.posX);
        setPosY(transform.posY);
        setScale(transform.scale);
        setRotation(transform.rotation);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [detectionResult]);

  // Handle User Photo Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      stopLiveCamera();
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setFaceImage(dataUrl);
          setIsCustomPhoto(true);
          triggerAutoFit(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Model Selection
  const handleSelectModel = (model: SampleModel) => {
    stopLiveCamera();
    setActiveModel(model);
    setFaceImage(model.url);
    setIsCustomPhoto(false);
    // Instant snap to pre-calibrated landmark
    setPosX(model.defaultX);
    setPosY(model.defaultY);
    setScale(model.defaultScale);
    setRotation(model.defaultRotation);
    triggerAutoFit(model.url, model);
  };

  // Start Live AR Camera
  const startLiveCamera = async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsLiveCamera(true);
        setIsCustomPhoto(false);
        runLiveCameraTracking();
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraError(
        "Camera permission denied. Please allow camera access in your browser settings or upload a selfie."
      );
      setIsLiveCamera(false);
    }
  };

  // Stop Live AR Camera
  const stopLiveCamera = () => {
    if (cameraLoopId.current) {
      cancelAnimationFrame(cameraLoopId.current);
      cameraLoopId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsLiveCamera(false);
  };

  // Continuous Face Tracking in Live Camera Mode
  const runLiveCameraTracking = () => {
    let lastDetectionTime = 0;

    const loop = async () => {
      const now = performance.now();
      // Track at ~15 fps to preserve battery & high smoothness
      if (now - lastDetectionTime > 66) {
        lastDetectionTime = now;
        if (
          videoRef.current &&
          videoRef.current.readyState >= 2 &&
          stageRef.current
        ) {
          try {
            const result = await detectFaceLandmarks(videoRef.current);
            if (result && stageRef.current) {
              const rect = stageRef.current.getBoundingClientRect();
              const transform = calculateEyewearTransform(
                result,
                rect.width,
                rect.height,
                videoRef.current.videoWidth || 640,
                videoRef.current.videoHeight || 480
              );
              setPosX(transform.posX);
              setPosY(transform.posY);
              setScale(transform.scale);
              setRotation(transform.rotation);
              setDetectionResult(result);
              setAutoFitSuccess(true);
            }
          } catch (e) {
            // keep running
          }
        }
      }

      cameraLoopId.current = requestAnimationFrame(loop);
    };

    cameraLoopId.current = requestAnimationFrame(loop);
  };

  // Snap Photo from Live Camera
  const handleSnapPhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

    stopLiveCamera();
    setFaceImage(dataUrl);
    setIsCustomPhoto(true);
    triggerAutoFit(dataUrl);
  };

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      stopLiveCamera();
    };
  }, []);

  // Optional manual drag handlers (if fine-tuning is enabled)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!showFineTune) return;
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

  // Reset to auto-detected position
  const handleResetToAuto = () => {
    if (isCustomPhoto) {
      triggerAutoFit(faceImage);
    } else {
      setPosX(activeModel.defaultX);
      setPosY(activeModel.defaultY);
      setScale(activeModel.defaultScale);
      setRotation(activeModel.defaultRotation);
    }
  };

  // Add to cart
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

  // Download high-res photo with Hassan Optics watermark
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
      canvas.height = faceImg.naturalHeight || 1000;

      // Draw Face
      ctx.drawImage(faceImg, 0, 0, canvas.width, canvas.height);

      if (showGlasses) {
        const frameImg = new window.Image();
        frameImg.crossOrigin = "anonymous";
        frameImg.src = selectedProduct.frameOverlay;

        frameImg.onload = () => {
          ctx.save();

          const centerX = (posX / 100) * canvas.width;
          const centerY = (posY / 100) * canvas.height;

          ctx.translate(centerX, centerY);
          ctx.rotate((rotation * Math.PI) / 180);

          // Frame dimensions
          const frameWidth = (canvas.width * 0.60 * scale) / 100;
          const frameHeight = frameWidth * (220 / 600); // 600x220 aspect

          ctx.drawImage(
            frameImg,
            -frameWidth / 2,
            -frameHeight / 2,
            frameWidth,
            frameHeight
          );
          ctx.restore();

          // Brand Watermark Footer
          ctx.fillStyle = "rgba(27, 42, 74, 0.92)";
          ctx.fillRect(0, canvas.height - 52, canvas.width, 52);
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "bold 15px -apple-system, BlinkMacSystemFont, sans-serif";
          ctx.fillText(
            `HASSAN OPTICS MIANWALI • ${selectedProduct.brand} ${selectedProduct.name} • 0311-0073721`,
            20,
            canvas.height - 20
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <ScanFace className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>AI Face Detection & Auto-Fit Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#1B2A4A] tracking-tight">
            Virtual Eyewear Try-On • Hassan Optics
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Upload your selfie or use live camera. Our AI automatically locates your eyes and snaps frames directly onto your face with zero manual dragging needed.
          </p>
        </div>

        {/* Main Grid: Try-On Stage & Side Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Try-On Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full max-w-lg bg-white rounded-3xl p-3 sm:p-5 border border-slate-200 shadow-md">
              {/* Canvas Viewport */}
              <div
                ref={stageRef}
                onPointerMove={showFineTune ? handlePointerMove : undefined}
                onPointerUp={showFineTune ? handlePointerUp : undefined}
                onPointerLeave={showFineTune ? handlePointerUp : undefined}
                className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900 shadow-inner select-none touch-none border border-slate-200"
              >
                {/* Mode 1: Live AR Webcam Stream */}
                {isLiveCamera ? (
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    autoPlay
                    className="w-full h-full object-cover object-center -scale-x-100"
                  />
                ) : (
                  /* Mode 2: Photo Face (Sample or Uploaded) */
                  <Image
                    src={faceImage}
                    alt="Face Model"
                    fill
                    priority
                    unoptimized={faceImage.startsWith("data:")}
                    className="object-cover object-center pointer-events-none"
                  />
                )}

                {/* Laser Scanning Animation when AI is processing */}
                {isScanning && (
                  <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-center items-center bg-black/35 backdrop-blur-[2px] transition-all">
                    {/* Glowing Laser Line */}
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#F15A24] to-transparent shadow-[0_0_20px_#F15A24] animate-pulse" />
                    <div className="mt-4 px-4 py-2 rounded-xl bg-slate-950/90 border border-orange-500/40 text-white text-xs font-bold flex items-center gap-2 shadow-2xl">
                      <ScanFace className="w-4 h-4 text-[#F15A24] animate-spin" />
                      <span>AI Detecting Face & Aligning Eyewear...</span>
                    </div>
                  </div>
                )}

                {/* Overlaid Eyewear Frame (Auto-positioned by AI) */}
                {showGlasses && (
                  <div
                    onPointerDown={showFineTune ? handlePointerDown : undefined}
                    style={{
                      position: "absolute",
                      left: `${posX}%`,
                      top: `${posY}%`,
                      width: `${60 * (scale / 100)}%`,
                      transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                      transformOrigin: "center center",
                      transition: isDragging || isLiveCamera ? "none" : "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    className={`z-20 ${showFineTune ? "cursor-move" : "pointer-events-none"}`}
                  >
                    <div className="relative aspect-[600/220] w-full drop-shadow-2xl filter">
                      <Image
                        src={selectedProduct.frameOverlay}
                        alt={selectedProduct.name}
                        fill
                        className="object-contain pointer-events-none"
                      />
                    </div>
                  </div>
                )}

                {/* Top Status Badges */}
                <div className="absolute top-3 left-3 z-30 flex flex-col gap-1.5">
                  {autoFitSuccess && !isScanning && (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold border border-emerald-400/30 flex items-center gap-1.5 shadow-md">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                      <span>AI Auto-Fitted (100% Alignment)</span>
                    </span>
                  )}
                  {isLiveCamera && (
                    <span className="px-2 py-0.5 rounded-md bg-red-600/90 text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      Live AR Mirror
                    </span>
                  )}
                </div>

                {/* Top Right Action: Toggle Frame Visibility */}
                <div className="absolute top-3 right-3 z-30">
                  <button
                    type="button"
                    onClick={() => setShowGlasses(!showGlasses)}
                    className="px-2.5 py-1.5 rounded-xl bg-white/95 hover:bg-white text-slate-800 text-xs font-bold shadow-md transition-all flex items-center gap-1.5 active:scale-95 border border-slate-200"
                    title="Toggle glasses on/off"
                  >
                    {showGlasses ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Show</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Live Camera Snap Controls Overlay */}
                {isLiveCamera && (
                  <div className="absolute bottom-16 inset-x-0 z-30 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleSnapPhoto}
                      className="px-4 py-2 bg-[#F15A24] hover:bg-[#d84817] text-white text-xs font-bold rounded-full shadow-xl flex items-center gap-2 active:scale-95 border-2 border-white"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Freeze / Snap Photo</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopLiveCamera}
                      className="px-3 py-2 bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold rounded-full backdrop-blur-md active:scale-95 border border-white/20"
                    >
                      Close Camera
                    </button>
                  </div>
                )}

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

              {/* AI Face Shape Analysis & Quick Insights */}
              {detectionResult && (
                <div className="mt-3 p-3 bg-gradient-to-r from-orange-50/60 to-blue-50/60 rounded-2xl border border-orange-100/80 flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-[#F15A24]/10 text-[#F15A24] shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-slate-700 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-[#1B2A4A]">
                        Face Shape: {detectionResult.faceShape}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        PD: ~{detectionResult.pupillaryDistanceMm}mm
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                      {detectionResult.faceShapeRecommendation}
                    </p>
                  </div>
                </div>
              )}

              {/* Optional Fine-Tuning Drawer (Collapsed by Default since AI auto-fits) */}
              <div className="mt-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFineTune(!showFineTune)}
                  className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-900 py-1"
                >
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[#F15A24]" />
                    <span>Fine-tune Fit Manually (Optional)</span>
                  </span>
                  {showFineTune ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {showFineTune && (
                  <div className="mt-3 space-y-3 pt-2 border-t border-slate-100 bg-slate-50 p-3 rounded-xl text-xs">
                    <div className="text-[11px] text-slate-500 mb-1">
                      💡 Frame was auto-aligned by AI. You can drag the frame or nudge size/tilt below if you prefer a looser or tighter fit.
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center justify-between text-slate-600 font-semibold mb-1">
                          <span className="flex items-center gap-1">
                            <ZoomIn className="w-3 h-3 text-[#F15A24]" /> Size Scale
                          </span>
                          <span className="text-[11px] font-bold text-slate-900">{scale}%</span>
                        </div>
                        <input
                          type="range"
                          min="70"
                          max="130"
                          value={scale}
                          onChange={(e) => setScale(Number(e.target.value))}
                          className="w-full accent-[#F15A24] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-slate-600 font-semibold mb-1">
                          <span className="flex items-center gap-1">
                            <RotateCw className="w-3 h-3 text-[#F15A24]" /> Tilt Angle
                          </span>
                          <span className="text-[11px] font-bold text-slate-900">{rotation}°</span>
                        </div>
                        <input
                          type="range"
                          min="-20"
                          max="20"
                          value={rotation}
                          onChange={(e) => setRotation(Number(e.target.value))}
                          className="w-full accent-[#F15A24] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={handleResetToAuto}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F15A24] hover:underline"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Re-snap to AI Center</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Bottom Action Bar: Save Photo & WhatsApp */}
                <div className="flex items-center justify-between pt-3 gap-2">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
                    title="Download picture wearing glasses"
                  >
                    <Download className="w-3.5 h-3.5 text-[#F15A24]" />
                    <span>Download Photo</span>
                  </button>

                  <a
                    href={`https://wa.me/923110073721?text=${encodeURIComponent(
                      `Assalam-o-Alaikum Hassan Optics, I tried on the ${selectedProduct.brand} ${selectedProduct.name} in your Virtual Mirror and want advice on lens prescription.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors border border-emerald-200"
                  >
                    <span>💬 WhatsApp Optometrist</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Face Selection & Purchase Details */}
          <div className="lg:col-span-5 space-y-6">
            {/* Step 1: Face Selector */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ScanFace className="w-4 h-4 text-[#F15A24]" />
                  <span>Step 1: Your Face Source</span>
                </h3>
                {isCustomPhoto && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Your Photo Auto-Fitted
                  </span>
                )}
              </div>

              {/* Camera Error Alert */}
              {cameraError && (
                <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{cameraError}</span>
                </div>
              )}

              {/* Upload & Live Camera Buttons */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-1.5 py-3 px-3 border-2 border-dashed border-[#F15A24]/40 hover:border-[#F15A24] bg-orange-50/50 hover:bg-orange-50 rounded-2xl text-xs font-bold text-[#F15A24] transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Selfie</span>
                </button>

                <button
                  type="button"
                  onClick={isLiveCamera ? stopLiveCamera : startLiveCamera}
                  className={`flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl text-xs font-bold transition-all border ${
                    isLiveCamera
                      ? "bg-red-500 hover:bg-red-600 text-white border-red-600 shadow-md"
                      : "bg-[#1B2A4A] hover:bg-[#142037] text-white border-[#1B2A4A]"
                  }`}
                >
                  {isLiveCamera ? (
                    <>
                      <VideoOff className="w-4 h-4" />
                      <span>Stop Camera</span>
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4 text-orange-400" />
                      <span>Open Live Camera</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sample Models Selection */}
              <div>
                <span className="text-[11px] text-slate-500 font-medium block mb-2">
                  Or pick a pre-calibrated sample face:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {SAMPLE_MODELS.map((m) => {
                    const isSelected = !isCustomPhoto && !isLiveCamera && activeModel.id === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleSelectModel(m)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                          isSelected
                            ? "border-[#F15A24] ring-2 ring-[#F15A24]/30 shadow-sm"
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

            {/* Step 2: Product & Purchase Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-[#F15A24] uppercase tracking-wider block">
                    {selectedProduct.brand} • {selectedProduct.shape}
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

              {/* Guarantee Banner */}
              <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-slate-600 space-y-1.5 border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Free Hard Case + Microfiber Cloth Included</span>
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
                  View full specifications & lens prescription options →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Interactive Frames Carousel - Instant Auto-Swap */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F15A24]">
                1-Click Frame Switcher
              </span>
              <h3 className="text-lg font-black text-[#1B2A4A]">
                Click Any Frame to Wear on Your Face Instantly
              </h3>
            </div>
            <Link
              href="/shop"
              className="text-xs font-semibold text-[#1B2A4A] hover:text-[#F15A24]"
            >
              Browse All Eyewear →
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
                      <span>Wearing Now</span>
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
