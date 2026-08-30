import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';

interface HeroFrameCanvasProps {
  totalFrames?: number;
  targetFps?: number;
  fullScreenBackground?: boolean;
}

export const HeroFrameCanvas: React.FC<HeroFrameCanvasProps> = ({
  totalFrames = 300,
  targetFps = 25,
  fullScreenBackground = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Animation & Cache state in Refs (Zero React state re-renders during loop!)
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedCountRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const isIntersectingRef = useRef<boolean>(true);
  const isReducedMotionRef = useRef<boolean>(false);

  // UI state for initial loading indicator & reduced motion
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [isInitialReady, setIsInitialReady] = useState<boolean>(false);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Check prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    isReducedMotionRef.current = motionQuery.matches;
    setIsReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotionRef.current = e.matches;
      setIsReducedMotion(e.matches);
    };
    motionQuery.addEventListener('change', handleMotionChange);

    // 2. Responsive Device Directory
    const isMobile = window.innerWidth < 768;
    const folder = isMobile ? '/animation/mobile' : '/animation/desktop';

    // 3. Canvas Dynamic Cover Resize
    const updateCanvasDimensions = () => {
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round((rect.width || window.innerWidth) * dpr);
      canvas.height = Math.round((rect.height || window.innerHeight) * dpr);
    };

    updateCanvasDimensions();

    const handleResize = () => {
      updateCanvasDimensions();
      drawFrame(currentFrameRef.current);
    };
    window.addEventListener('resize', handleResize);

    // 4. Draw Frame in object-fit: cover mode
    const imagesCache: HTMLImageElement[] = new Array(totalFrames);
    imagesRef.current = imagesCache;
    loadedCountRef.current = 0;
    currentFrameRef.current = 0;

    const drawFrame = (frameIdx: number) => {
      const img = imagesCache[frameIdx];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const containerW = canvas.width;
      const containerH = canvas.height;
      const imgW = img.naturalWidth;
      const imgH = img.naturalHeight;

      const imgAspect = imgW / imgH;
      const containerAspect = containerW / containerH;

      let renderW = containerW;
      let renderH = containerH;
      let offsetX = 0;
      let offsetY = 0;

      if (containerAspect > imgAspect) {
        renderH = containerW / imgAspect;
        offsetY = (containerH - renderH) / 2;
      } else {
        renderW = containerH * imgAspect;
        offsetX = (containerW - renderW) / 2;
      }

      ctx.clearRect(0, 0, containerW, containerH);
      ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
    };

    // Fast-path: Load Poster / Frame 1 immediately
    const firstImg = new Image();
    firstImg.src = `${folder}/frame_001.webp`;
    firstImg.onload = () => {
      imagesCache[0] = firstImg;
      loadedCountRef.current += 1;
      drawFrame(0);
      setIsInitialReady(true);
    };

    // Load initial batch (frames 2 to 15) for fast smooth start
    const initialBatch = 15;
    for (let i = 1; i < Math.min(initialBatch, totalFrames); i++) {
      const img = new Image();
      const numStr = String(i + 1).padStart(3, '0');
      img.src = `${folder}/frame_${numStr}.webp`;
      img.onload = () => {
        imagesCache[i] = img;
        loadedCountRef.current += 1;
        setLoadProgress(Math.floor((loadedCountRef.current / totalFrames) * 100));
      };
    }

    // Progressive background chunk loader for remaining frames
    let bgIndex = initialBatch;
    const loadNextBatchInIdle = () => {
      if (bgIndex >= totalFrames) return;
      const chunkSize = 10;
      const end = Math.min(bgIndex + chunkSize, totalFrames);

      for (let i = bgIndex; i < end; i++) {
        const img = new Image();
        const numStr = String(i + 1).padStart(3, '0');
        img.src = `${folder}/frame_${numStr}.webp`;
        img.onload = () => {
          imagesCache[i] = img;
          loadedCountRef.current += 1;
          const prog = Math.floor((loadedCountRef.current / totalFrames) * 100);
          setLoadProgress(prog);
        };
      }

      bgIndex = end;
      if (bgIndex < totalFrames) {
        if ('requestIdleCallback' in window) {
          (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(loadNextBatchInIdle);
        } else {
          setTimeout(loadNextBatchInIdle, 50);
        }
      }
    };

    const idleTimer = setTimeout(loadNextBatchInIdle, 200);

    // 5. Animation Loop (requestAnimationFrame)
    const frameInterval = 1000 / targetFps;

    const renderLoop = (timestamp: number) => {
      if (!isIntersectingRef.current || isReducedMotionRef.current) {
        // Pause playback when offscreen or reduced motion enabled
        animFrameIdRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      const elapsed = timestamp - lastTimeRef.current;

      if (elapsed >= frameInterval) {
        lastTimeRef.current = timestamp - (elapsed % frameInterval);

        // Advance to next available frame
        let nextFrame = (currentFrameRef.current + 1) % totalFrames;
        let attempts = 0;

        while (!imagesCache[nextFrame] && attempts < totalFrames) {
          nextFrame = (nextFrame + 1) % totalFrames;
          attempts++;
        }

        if (imagesCache[nextFrame]) {
          currentFrameRef.current = nextFrame;
          drawFrame(nextFrame);
        }
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    // 6. IntersectionObserver Pause / Resume
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersectingRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(container);

    // Cleanup
    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      observer.disconnect();
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, [totalFrames, targetFps]);

  if (fullScreenBackground) {
    return (
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950 pointer-events-none"
      >
        {/* Full-Screen Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full block transition-opacity duration-700"
          style={{ opacity: isInitialReady ? 1 : 0 }}
        />

        {/* Poster Skeleton Fallback */}
        {!isInitialReady && (
          <div className="absolute inset-0 bg-[#0d2319] flex flex-col items-center justify-center space-y-3 text-white">
            <Sparkles className="w-8 h-8 text-emerald-400 animate-spin" />
            <span className="text-xs font-bold text-emerald-200 tracking-wider">
              Initializing AI Agricultural Environment...
            </span>
          </div>
        )}

        {/* Subtle Preload Line Bar */}
        {loadProgress < 100 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40 z-30">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-amber-300 to-emerald-400 transition-all duration-300"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
        )}
      </div>
    );
  }

  // Card view fallback (if used inside non-fullscreen container)
  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-xl mx-auto rounded-3xl overflow-hidden border-2 border-white/80 bg-slate-900 shadow-2xl"
      style={{ aspectRatio: '16 / 9' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block transition-opacity duration-500"
        style={{ opacity: isInitialReady ? 1 : 0 }}
      />
      {isReducedMotion && (
        <div className="absolute top-4 right-4 z-20 bg-amber-900/80 backdrop-blur-md px-3 py-1 rounded-full text-amber-200 text-[10px] font-bold flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          <span>Reduced Motion</span>
        </div>
      )}
    </div>
  );
};
