"use client";

import React, { useState, useEffect, Suspense, Component, ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { getDeviceCapabilities } from "@/lib/3d/webglDetection";
import { LoadingSurprise3D } from "./LoadingSurprise3D";
import { FallbackRenderer } from "./FallbackRenderer";

// Error boundary to catch WebGL context crashes
interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("WebGL Context Encountered Error, falling back to 2D:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export interface ExperienceCanvasProps {
  children?: ReactNode;
  className?: string;
  fallbackSceneType?: string;
  onFallbackClick?: () => void;
}

export function ExperienceCanvas({
  children,
  className = "",
  fallbackSceneType = "gift",
  onFallbackClick,
}: ExperienceCanvasProps) {
  const [isClient, setIsClient] = useState(false);
  const [canRenderWebGL, setCanRenderWebGL] = useState(true);
  const [caps, setCaps] = useState(() => getDeviceCapabilities());

  useEffect(() => {
    setIsClient(true);
    const detected = getDeviceCapabilities();
    setCaps(detected);
    setCanRenderWebGL(detected.isWebGLAvailable);
  }, []);

  if (!isClient) {
    return <LoadingSurprise3D message="Loading 3D Engine..." />;
  }

  if (!canRenderWebGL) {
    return (
      <FallbackRenderer
        sceneType={fallbackSceneType}
        onObjectClick={onFallbackClick}
        className={className}
      />
    );
  }

  return (
    <div className={`relative w-full h-full min-h-[360px] overflow-hidden ${className}`}>
      <WebGLErrorBoundary
        fallback={
          <FallbackRenderer
            sceneType={fallbackSceneType}
            onObjectClick={onFallbackClick}
          />
        }
      >
        <Suspense fallback={<LoadingSurprise3D />}>
          <Canvas
            shadows={caps.enableShadows}
            gl={{
              antialias: caps.qualityTier !== "low",
              alpha: true,
              powerPreference: caps.qualityTier === "low" ? "default" : "high-performance",
            }}
            dpr={[1, caps.maxDpr]}
            camera={{ position: [0, 1.2, 4.5], fov: 48 }}
            className="w-full h-full"
          >
            {children}
          </Canvas>
        </Suspense>
      </WebGLErrorBoundary>
    </div>
  );
}
