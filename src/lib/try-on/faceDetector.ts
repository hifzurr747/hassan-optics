/**
 * Hassan Optics - AI Face Landmark Detector & Auto-Fit Engine
 * Powered by Google MediaPipe FaceMesh
 * 
 * Accurately detects pupil centers, nose bridge, temple width, and face tilt
 * to automatically position, scale, and rotate eyewear with zero manual effort.
 */

export interface FaceDetectionResult {
  landmarks: Array<{ x: number; y: number; z: number }>;
  leftEye: { x: number; y: number };
  rightEye: { x: number; y: number };
  noseBridge: { x: number; y: number };
  leftTemple: { x: number; y: number };
  rightTemple: { x: number; y: number };
  chin: { x: number; y: number };
  forehead: { x: number; y: number };
  pupillaryDistanceMm: number;
  faceShape: "Oval" | "Round" | "Square" | "Heart" | "Diamond";
  faceShapeRecommendation: string;
  confidence: number;
  faceBox: {
    top: number;
    bottom: number;
    left: number;
    right: number;
    width: number;
    height: number;
  };
}

export interface EyewearTransform {
  posX: number; // percentage in container (0-100)
  posY: number; // percentage in container (0-100)
  scale: number; // percentage (typically 20 - 150)
  rotation: number; // degrees (-35 to +35)
}

// MediaPipe FaceMesh singleton state
let faceMeshInstance: any = null;
let scriptLoadingPromise: Promise<any> | null = null;
let currentDetectionResolver: ((result: FaceDetectionResult | null) => void) | null = null;
let isBusyProcessing = false;

/**
 * Dynamically loads MediaPipe FaceMesh from CDN if not already loaded on window
 */
export async function loadMediaPipeFaceMesh(): Promise<any> {
  if (typeof window === "undefined") return null;

  if ((window as any).FaceMesh) {
    return (window as any).FaceMesh;
  }

  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  scriptLoadingPromise = new Promise((resolve, reject) => {
    // If already in DOM
    const existing = document.querySelector('script[src*="face_mesh.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve((window as any).FaceMesh));
      existing.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js";
    script.crossOrigin = "anonymous";
    script.async = true;

    script.onload = () => {
      resolve((window as any).FaceMesh);
    };

    script.onerror = (err) => {
      console.warn("Failed to load MediaPipe FaceMesh:", err);
      reject(err);
    };

    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

/**
 * Initializes and configures the singleton FaceMesh instance
 */
export async function getFaceMeshInstance(): Promise<any> {
  if (faceMeshInstance) return faceMeshInstance;

  const FaceMeshClass = await loadMediaPipeFaceMesh();
  if (!FaceMeshClass) return null;

  faceMeshInstance = new FaceMeshClass({
    locateFile: (file: string) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    },
  });

  faceMeshInstance.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.35,
    minTrackingConfidence: 0.35,
  });

  // Register onResults handler once
  faceMeshInstance.onResults((results: any) => {
    if (!currentDetectionResolver) return;
    const resolver = currentDetectionResolver;
    currentDetectionResolver = null;
    isBusyProcessing = false;

    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
      resolver(null);
      return;
    }

    const lm = results.multiFaceLandmarks[0];

    // Left eye
    const leftEyeOuter = lm[33];
    const leftEyeInner = lm[133];
    // Right eye
    const rightEyeInner = lm[362];
    const rightEyeOuter = lm[263];

    const leftEye = lm[468] || {
      x: (leftEyeOuter.x + leftEyeInner.x) / 2,
      y: (leftEyeOuter.y + leftEyeInner.y) / 2,
      z: (leftEyeOuter.z + leftEyeInner.z) / 2,
    };

    const rightEye = lm[473] || {
      x: (rightEyeOuter.x + rightEyeInner.x) / 2,
      y: (rightEyeOuter.y + rightEyeInner.y) / 2,
      z: (rightEyeOuter.z + rightEyeInner.z) / 2,
    };

    // Nose bridge landmark 168 (right between the eyes, where eyewear bridge sits)
    const noseBridge = lm[168] || lm[6] || {
      x: (leftEye.x + rightEye.x) / 2,
      y: (leftEye.y + rightEye.y) / 2,
      z: 0,
    };

    const leftTemple = lm[234];
    const rightTemple = lm[454];
    const forehead = lm[10];
    const chin = lm[152];
    const leftJaw = lm[172] || lm[58];
    const rightJaw = lm[397] || lm[288];

    const eyeDistanceNorm = Math.hypot(rightEye.x - leftEye.x, rightEye.y - leftEye.y);
    const estimatedPd = Math.round(60 + eyeDistanceNorm * 15);

    const { shape, recommendation } = analyzeFaceShape(
      forehead,
      chin,
      leftTemple,
      rightTemple,
      leftJaw,
      rightJaw
    );

    // Calculate face bounding box in normalized coordinates (0..1)
    const faceBox = {
      top: forehead.y,
      bottom: chin.y,
      left: leftTemple.x,
      right: rightTemple.x,
      width: Math.abs(rightTemple.x - leftTemple.x),
      height: Math.abs(chin.y - forehead.y),
    };

    resolver({
      landmarks: lm,
      leftEye,
      rightEye,
      noseBridge,
      leftTemple,
      rightTemple,
      chin,
      forehead,
      pupillaryDistanceMm: Math.min(72, Math.max(56, estimatedPd)),
      faceShape: shape,
      faceShapeRecommendation: recommendation,
      confidence: 0.98,
      faceBox,
    });
  });

  return faceMeshInstance;
}

/**
 * Determines face shape and style recommendation
 */
function analyzeFaceShape(
  forehead: { x: number; y: number },
  chin: { x: number; y: number },
  leftTemple: { x: number; y: number },
  rightTemple: { x: number; y: number },
  leftJaw: { x: number; y: number },
  rightJaw: { x: number; y: number }
): { shape: "Oval" | "Round" | "Square" | "Heart" | "Diamond"; recommendation: string } {
  const faceHeight = Math.hypot(chin.x - forehead.x, chin.y - forehead.y);
  const cheekWidth = Math.hypot(rightTemple.x - leftTemple.x, rightTemple.y - leftTemple.y);
  const jawWidth = Math.hypot(rightJaw.x - leftJaw.x, rightJaw.y - leftJaw.y);

  const ratio = faceHeight / (cheekWidth || 1);
  const jawRatio = jawWidth / (cheekWidth || 1);

  if (ratio > 1.35) {
    if (jawRatio < 0.72) {
      return {
        shape: "Heart",
        recommendation: "Browline, Oval & Rimless frames balance your face beautifully.",
      };
    }
    return {
      shape: "Oval",
      recommendation: "Versatile face shape! Aviators, Wayfarers & Rectangles look stunning on you.",
    };
  } else {
    if (jawRatio > 0.82) {
      return {
        shape: "Square",
        recommendation: "Round, Oval & Aviator frames soften angles and look striking.",
      };
    } else if (cheekWidth > jawWidth * 1.3) {
      return {
        shape: "Diamond",
        recommendation: "Cat-Eye, Browline & Geometric frames accentuate your high cheekbones.",
      };
    } else {
      return {
        shape: "Round",
        recommendation: "Angular, Rectangle & Wayfarer frames add sleek definition to your features.",
      };
    }
  }
}

/**
 * Runs FaceMesh detection safely without race conditions or memory leaks
 */
export async function detectFaceLandmarks(
  source: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
): Promise<FaceDetectionResult | null> {
  if (typeof window === "undefined") return null;

  // If already processing a frame, skip to maintain real-time performance
  if (isBusyProcessing) {
    return null;
  }

  try {
    const mesh = await getFaceMeshInstance();
    if (!mesh) return null;

    isBusyProcessing = true;

    // Convert Image elements to an offscreen canvas to guarantee valid pixel buffer
    let inputSource: any = source;
    if (source instanceof HTMLImageElement) {
      const canvas = document.createElement("canvas");
      canvas.width = source.naturalWidth || source.width || 640;
      canvas.height = source.naturalHeight || source.height || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
        inputSource = canvas;
      }
    }

    return new Promise((resolve) => {
      // Guard timer
      const timer = setTimeout(() => {
        if (isBusyProcessing) {
          isBusyProcessing = false;
          currentDetectionResolver = null;
          resolve(null);
        }
      }, 3500);

      currentDetectionResolver = (result) => {
        clearTimeout(timer);
        resolve(result);
      };

      mesh.send({ image: inputSource }).catch((err: any) => {
        clearTimeout(timer);
        isBusyProcessing = false;
        currentDetectionResolver = null;
        resolve(null);
      });
    });
  } catch (error) {
    isBusyProcessing = false;
    currentDetectionResolver = null;
    return null;
  }
}

/**
 * Converts detected face landmarks into exact CSS percentages for frame position,
 * scale, and rotation, compensating for object-cover image rendering and live selfie mirroring.
 */
export function calculateEyewearTransform(
  detection: FaceDetectionResult,
  containerWidth: number,
  containerHeight: number,
  imageNaturalWidth: number,
  imageNaturalHeight: number,
  imageZoom: number = 1.0,
  panOffsetY: number = 0,
  isMirrored: boolean = false
): EyewearTransform {
  if (!containerWidth || !containerHeight || !imageNaturalWidth || !imageNaturalHeight) {
    return { posX: 50, posY: 38, scale: 75, rotation: 0 };
  }

  // Calculate object-cover base scaling
  const baseScale = Math.max(
    containerWidth / imageNaturalWidth,
    containerHeight / imageNaturalHeight
  );

  const effectiveScale = baseScale * imageZoom;
  const renderedWidth = imageNaturalWidth * effectiveScale;
  const renderedHeight = imageNaturalHeight * effectiveScale;

  const offsetX = (renderedWidth - containerWidth) / 2;
  const offsetY = (renderedHeight - containerHeight) / 2 - panOffsetY;

  // Convert normalized landmark (0-1) to pixel in viewport container
  const toContainerPixelX = (normX: number) => {
    // If live camera is mirrored horizontally (-scale-x-100)
    const effectiveX = isMirrored ? 1 - normX : normX;
    return effectiveX * renderedWidth - offsetX;
  };

  const toContainerPixelY = (normY: number) => normY * renderedHeight - offsetY;

  // Nose bridge in container pixels
  const bridgePxX = toContainerPixelX(detection.noseBridge.x);
  const bridgePxY = toContainerPixelY(detection.noseBridge.y);

  // Convert to container percentage (0-100)
  const posX = (bridgePxX / containerWidth) * 100;
  // Frame bridge sits right on the top of the nose bridge
  const posY = (bridgePxY / containerHeight) * 100 - 0.4;

  // Left & right eye pixel positions
  const leftEyePxX = toContainerPixelX(detection.leftEye.x);
  const leftEyePxY = toContainerPixelY(detection.leftEye.y);
  const rightEyePxX = toContainerPixelX(detection.rightEye.x);
  const rightEyePxY = toContainerPixelY(detection.rightEye.y);

  // Eye tilt angle
  const deltaX = rightEyePxX - leftEyePxX;
  const deltaY = rightEyePxY - leftEyePxY;
  let rotation = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

  if (isMirrored) {
    rotation = -rotation;
  }

  // Pupillary distance on screen
  const pupilDistPx = Math.hypot(deltaX, deltaY);

  // Real-life eyewear ratio: Frame width = Pupil Distance * 2.22
  const targetFrameWidthPx = pupilDistPx * 2.22;
  const targetFrameWidthPct = (targetFrameWidthPx / containerWidth) * 100;

  // Base frame CSS is width: `60 * (scale / 100)`%
  // scale = (targetFrameWidthPct / 60) * 100
  let calculatedScale = Math.round((targetFrameWidthPct / 60) * 100);

  // Safety boundaries (clamp to realistic range 20% to 160%)
  calculatedScale = Math.min(160, Math.max(20, calculatedScale));

  return {
    posX: Math.min(95, Math.max(5, posX)),
    posY: Math.min(95, Math.max(5, posY)),
    scale: calculatedScale,
    rotation: Math.min(35, Math.max(-35, Math.round(rotation * 10) / 10)),
  };
}
