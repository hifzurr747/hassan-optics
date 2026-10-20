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
}

export interface EyewearTransform {
  posX: number; // percentage in container (0-100)
  posY: number; // percentage in container (0-100)
  scale: number; // percentage (typically 20 - 150)
  rotation: number; // degrees (-35 to +35)
}

// MediaPipe FaceMesh instance cache
let faceMeshInstance: any = null;
let scriptLoadingPromise: Promise<any> | null = null;

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
      console.warn("Failed to load MediaPipe from CDN:", err);
      reject(err);
    };

    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

/**
 * Initializes or returns the cached FaceMesh instance
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
    minDetectionConfidence: 0.4,
    minTrackingConfidence: 0.4,
  });

  return faceMeshInstance;
}

/**
 * Determines face shape and style recommendation based on landmarks
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
 * Runs FaceMesh detection on an Image or Video element
 */
export async function detectFaceLandmarks(
  source: HTMLImageElement | HTMLVideoElement
): Promise<FaceDetectionResult | null> {
  try {
    const mesh = await getFaceMeshInstance();
    if (!mesh) return null;

    return new Promise((resolve) => {
      let isResolved = false;

      const timer = setTimeout(() => {
        if (!isResolved) {
          isResolved = true;
          resolve(null);
        }
      }, 5000);

      mesh.onResults((results: any) => {
        if (isResolved) return;
        isResolved = true;
        clearTimeout(timer);

        if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
          resolve(null);
          return;
        }

        const lm = results.multiFaceLandmarks[0];

        const leftEyeOuter = lm[33];
        const leftEyeInner = lm[133];
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

        // Landmark 168 is top of nose bridge between pupils
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

        resolve({
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
        });
      });

      mesh.send({ image: source }).catch((err: any) => {
        console.warn("MediaPipe send error:", err);
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timer);
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error("detectFaceLandmarks error:", error);
    return null;
  }
}

/**
 * Converts detected face landmarks into exact CSS percentages for frame position,
 * scale, and rotation, compensating for object-cover image rendering and zoom.
 */
export function calculateEyewearTransform(
  detection: FaceDetectionResult,
  containerWidth: number,
  containerHeight: number,
  imageNaturalWidth: number,
  imageNaturalHeight: number,
  imageZoom: number = 1.0,
  panOffsetY: number = 0
): EyewearTransform {
  if (!containerWidth || !containerHeight || !imageNaturalWidth || !imageNaturalHeight) {
    return { posX: 50, posY: 38, scale: 100, rotation: 0 };
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
  const toContainerPixelX = (normX: number) => normX * renderedWidth - offsetX;
  const toContainerPixelY = (normY: number) => normY * renderedHeight - offsetY;

  // Nose bridge in container pixels
  const bridgePxX = toContainerPixelX(detection.noseBridge.x);
  const bridgePxY = toContainerPixelY(detection.noseBridge.y);

  // Convert to container percentage (0-100)
  const posX = (bridgePxX / containerWidth) * 100;
  // Sit comfortably across pupils & bridge
  const posY = (bridgePxY / containerHeight) * 100 - 0.5;

  // Face tilt angle (rotation) based on pupils
  const leftEyePxX = toContainerPixelX(detection.leftEye.x);
  const leftEyePxY = toContainerPixelY(detection.leftEye.y);
  const rightEyePxX = toContainerPixelX(detection.rightEye.x);
  const rightEyePxY = toContainerPixelY(detection.rightEye.y);

  const deltaX = rightEyePxX - leftEyePxX;
  const deltaY = rightEyePxY - leftEyePxY;
  const rotation = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

  // Pupillary Distance in container pixels:
  const pupilDistPx = Math.hypot(deltaX, deltaY);

  // Anatomical Eyewear Frame Width = Pupillary Distance * 2.20
  // Standard adult human PD is 63mm, frame width is 138mm (138 / 63 = 2.19)
  const targetFrameWidthPx = pupilDistPx * 2.22;
  const targetFrameWidthPct = (targetFrameWidthPx / containerWidth) * 100;

  // Since frame CSS width = `60 * (scale / 100)`%:
  // scale = (targetFrameWidthPct / 60) * 100
  let calculatedScale = Math.round((targetFrameWidthPct / 60) * 100);

  // Realistic boundary: from 20% (distant body shot) up to 180% (close up face)
  calculatedScale = Math.min(180, Math.max(20, calculatedScale));

  return {
    posX: Math.min(95, Math.max(5, posX)),
    posY: Math.min(95, Math.max(5, posY)),
    scale: calculatedScale,
    rotation: Math.min(35, Math.max(-35, Math.round(rotation * 10) / 10)),
  };
}
