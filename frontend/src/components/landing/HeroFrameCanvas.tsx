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

  // Animation & Cache state in Refs
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedCountRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const isIntersectingRef = useRef<boolean>(true);
  const isReducedMotionRef = useRef<boolean>(false);

  // UI state
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

    // 2. Responsive Device Directory (/animation/mobile or /animation/desktop)
    const isMobile = window.innerWidth < 768;
    const folder = isMobile ? '/mobile' : '/desktop';

    // 3. Canvas Cover Resize
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

    // 5. Preload ALL 300 Frames Concurrently in Parallel Chunks
    let isCancelled = false;

    const loadAllFrames = () => {
      const concurrencyLimit = 16;
      let activeIndex = 0;

      const loadNext = () => {
        if (isCancelled || activeIndex >= totalFrames) return;
        const i = activeIndex++;
        const numStr = String(i + 1).padStart(3, '0');
        
        const img = new Image();
        img.src = `${folder}/frame_${numStr}.webp`;

        img.onload = () => {
          if (isCancelled) return;
          imagesCache[i] = img;
          loadedCountRef.current += 1;

          if (i === 0) {
            drawFrame(0);
            setIsInitialReady(true);
          }

          const prog = Math.floor((loadedCountRef.current / totalFrames) * 100);
          setLoadProgress(prog);

          // Chain next image load
          loadNext();
        };

        img.onerror = () => {
          if (isCancelled) return;
          // Fallback to root png frame if webp missing
          const fallbackImg = new Image();
          fallbackImg.src = `/ezgif-frame-${numStr}.png`;
          fallbackImg.onload = () => {
            if (isCancelled) return;
            imagesCache[i] = fallbackImg;
            loadedCountRef.current += 1;
            if (i === 0) {
              drawFrame(0);
              setIsInitialReady(true);
            }
            setLoadProgress(Math.floor((loadedCountRef.current / totalFrames) * 100));
            loadNext();
          };
          fallbackImg.onerror = () => loadNext();
        };
      };

      // Launch initial concurrent batch workers
      for (let w = 0; w < concurrencyLimit; w++) {
        loadNext();
      }
    };

    loadAllFrames();

    // 6. Continuous Sequential Animation Loop (Plays frames 0 -> 299 continuously)
    const frameInterval = 1000 / targetFps;

    const renderLoop = (timestamp: number) => {
      if (!isIntersectingRef.current || isReducedMotionRef.current) {
        animFrameIdRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      const elapsed = timestamp - lastTimeRef.current;

      if (elapsed >= frameInterval) {
        lastTimeRef.current = timestamp - (elapsed % frameInterval);

        // Advance to exact next sequential frame
        const nextFrame = (currentFrameRef.current + 1) % totalFrames;

        if (imagesCache[nextFrame] && imagesCache[nextFrame].complete) {
          currentFrameRef.current = nextFrame;
          drawFrame(nextFrame);
        } else {
          // If next frame is still loading, find closest preloaded frame without resetting to 0
          let lookahead = 1;
          let found = false;
          while (lookahead < 5) {
            const checkIdx = (currentFrameRef.current + lookahead) % totalFrames;
            if (imagesCache[checkIdx] && imagesCache[checkIdx].complete) {
              currentFrameRef.current = checkIdx;
              drawFrame(checkIdx);
              found = true;
              break;
            }
            lookahead++;
          }
          if (!found && imagesCache[currentFrameRef.current]) {
            drawFrame(currentFrameRef.current);
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    // 7. IntersectionObserver Pause / Resume
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
      isCancelled = true;
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

  // Card view fallback
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
