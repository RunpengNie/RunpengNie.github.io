import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue } from 'framer-motion';
import ProgressiveImage from './ProgressiveImage';
import { getImage, isLoaded } from '../lib/images';
import { prefersReducedMotion } from '../lib/motion';
import useDevicePixelRatio from '../lib/useDevicePixelRatio';
import useScrollLock from '../lib/useScrollLock';

const SWIPE_DISTANCE = 60;
const CLOSE_DISTANCE = 120;
const TAP_SLOP = 10;
const DOUBLE_TAP_MS = 300;
const DOUBLE_TAP_ZOOM = 2.5;
const MAX_ZOOM_CAP = 10;
const ORIGINAL_DELAY_MS = 400;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const midpoint = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
const formatMB = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

// Keeps pointer events on overlay controls from starting a gesture on the viewer.
const stopGesture = (e) => e.stopPropagation();

/**
 * Fullscreen photo viewer. Shows the screen-sized variant first, then loads the original file.
 * Touch: pinch to zoom, drag to pan when zoomed, double-tap to zoom, swipe left/right to change
 * photo, swipe down or tap the backdrop to close.
 * Mouse/keyboard: click to toggle 100% zoom, wheel to zoom, drag to pan, arrow keys to navigate,
 * Esc to close.
 */
function FullscreenViewer({ src, alt, counter, onPrev, onNext, onClose }) {
  const entry = getImage(src);
  const original = entry.variants[entry.variants.length - 1];
  const dpr = useDevicePixelRatio();
  const containerRef = useRef(null);
  const frameRef = useRef(null);
  const pointers = useRef(new Map());
  const gesture = useRef(null);
  const lastTap = useRef(null);
  const wheelTimer = useRef(null);

  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const backdropOpacity = useMotionValue(1);
  // Zoom level committed after a gesture ends; drives which resolution gets loaded.
  const [zoom, setZoom] = useState(1);
  const [originalLoaded, setOriginalLoaded] = useState(() => isLoaded(original.src));
  const [showOriginalBadge, setShowOriginalBadge] = useState(true);
  const [wantOriginal, setWantOriginal] = useState(false);

  useScrollLock(true);

  useLayoutEffect(() => {
    scale.set(1);
    x.set(0);
    y.set(0);
    backdropOpacity.set(1);
    setZoom(1);
    setOriginalLoaded(isLoaded(original.src));
    setShowOriginalBadge(true);
    setWantOriginal(false);
    gesture.current = null;
  }, [src, original.src, scale, x, y, backdropOpacity]);

  // Only start downloading the (large) original once the user stays on a photo,
  // so swiping quickly through photos doesn't queue up many full-size downloads.
  useEffect(() => {
    const timer = setTimeout(() => setWantOriginal(true), ORIGINAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [src]);

  // Briefly confirm that the original is shown, then get out of the way.
  useEffect(() => {
    if (!originalLoaded) return undefined;
    const timer = setTimeout(() => setShowOriginalBadge(false), 2000);
    return () => clearTimeout(timer);
  }, [originalLoaded, src]);

  // Zoom up to the point where one image pixel covers one device pixel.
  const maxScale = () => {
    const width = frameRef.current?.offsetWidth || 1;
    return clamp(entry.width / (width * dpr), DOUBLE_TAP_ZOOM, MAX_ZOOM_CAP);
  };

  // Pointer position relative to the viewport center, which is also the image's transform origin.
  const toLocal = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left - rect.width / 2, y: e.clientY - rect.top - rect.height / 2 };
  };

  const panLimits = (s) => {
    const frame = frameRef.current;
    const container = containerRef.current;
    return {
      x: Math.max(0, (frame.offsetWidth * s - container.clientWidth) / 2),
      y: Math.max(0, (frame.offsetHeight * s - container.clientHeight) / 2),
    };
  };

  const settle = (s, tx, ty) => {
    const limits = panLimits(s);
    const options = prefersReducedMotion()
      ? { duration: 0 }
      : { type: 'spring', stiffness: 400, damping: 40 };
    animate(scale, s, options);
    animate(x, clamp(tx, -limits.x, limits.x), options);
    animate(y, clamp(ty, -limits.y, limits.y), options);
    setZoom(s);
  };

  // Translation that keeps the image point under `point` fixed while scaling to `nextScale`.
  const translationForZoom = (point, nextScale) => {
    const s = scale.get();
    const contentX = (point.x - x.get()) / s;
    const contentY = (point.y - y.get()) / s;
    return { x: point.x - nextScale * contentX, y: point.y - nextScale * contentY };
  };

  const resetZoom = () => settle(1, 0, 0);

  const zoomAt = (point, nextScale) => {
    const t = translationForZoom(point, nextScale);
    settle(nextScale, t.x, t.y);
  };

  const handleTap = (point, onImage, pointerType) => {
    // Mouse: a single click toggles between fit and 100% (one image pixel per device pixel).
    if (pointerType === 'mouse') {
      if (!onImage) onClose();
      else if (scale.get() > 1.01) resetZoom();
      else zoomAt(point, maxScale());
      return;
    }

    const now = performance.now();
    const previous = lastTap.current;
    if (previous && now - previous.time < DOUBLE_TAP_MS && distance(previous.point, point) < 30) {
      lastTap.current = null;
      if (scale.get() > 1.01) resetZoom();
      else zoomAt(point, Math.min(DOUBLE_TAP_ZOOM, maxScale()));
      return;
    }
    lastTap.current = { time: now, point };
    if (!onImage) onClose();
  };

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    try {
      containerRef.current.setPointerCapture(e.pointerId);
    } catch {
      // The pointer may already be gone (e.g. released before this handler ran).
    }
    pointers.current.set(e.pointerId, toLocal(e));
    [scale, x, y].forEach((value) => value.stop());

    const points = [...pointers.current.values()];
    if (points.length === 1) {
      const zoomed = scale.get() > 1.01;
      gesture.current = {
        type: zoomed ? 'pan' : 'swipe',
        start: points[0],
        origin: { x: x.get(), y: y.get() },
        axis: null,
        moved: false,
        pointerType: e.pointerType,
        onImage: Boolean(e.target.closest('[data-viewer-image]')),
      };
    } else if (points.length === 2) {
      const [a, b] = points;
      backdropOpacity.set(1);
      gesture.current = {
        type: 'pinch',
        startDistance: distance(a, b),
        startScale: scale.get(),
        startMid: midpoint(a, b),
        origin: { x: x.get(), y: y.get() },
      };
    }
  };

  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return;
    const point = toLocal(e);
    pointers.current.set(e.pointerId, point);
    const g = gesture.current;
    if (!g) return;

    if (g.type === 'pinch') {
      const [a, b] = [...pointers.current.values()];
      if (!b) return;
      const mid = midpoint(a, b);
      const nextScale = clamp(
        (g.startScale * distance(a, b)) / g.startDistance,
        0.8,
        maxScale() * 1.2
      );
      const contentX = (g.startMid.x - g.origin.x) / g.startScale;
      const contentY = (g.startMid.y - g.origin.y) / g.startScale;
      scale.set(nextScale);
      x.set(mid.x - nextScale * contentX);
      y.set(mid.y - nextScale * contentY);
      return;
    }

    const dx = point.x - g.start.x;
    const dy = point.y - g.start.y;
    if (Math.hypot(dx, dy) > TAP_SLOP) g.moved = true;

    if (g.type === 'pan') {
      x.set(g.origin.x + dx);
      y.set(g.origin.y + dy);
    } else if (g.type === 'swipe' && g.moved) {
      if (!g.axis) g.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (g.axis === 'x') {
        x.set(dx);
      } else {
        y.set(dy);
        backdropOpacity.set(1 - Math.min(Math.abs(dy) / 400, 0.6));
      }
    }
  };

  const onPointerUp = (e) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.delete(e.pointerId);
    const g = gesture.current;
    if (!g) return;
    const remaining = [...pointers.current.values()];

    if (g.type === 'pinch') {
      if (remaining.length === 1) {
        // Continue as a pan with the finger that is still down.
        gesture.current = {
          type: 'pan',
          start: remaining[0],
          origin: { x: x.get(), y: y.get() },
          moved: true,
        };
      } else if (remaining.length === 0) {
        gesture.current = null;
        const s = scale.get();
        if (s <= 1) resetZoom();
        else settle(Math.min(s, maxScale()), x.get(), y.get());
      }
      return;
    }

    if (remaining.length > 0) return;
    gesture.current = null;

    if (e.type === 'pointercancel') {
      if (g.type === 'swipe') resetZoom();
      animate(backdropOpacity, 1);
      return;
    }

    if (!g.moved) {
      handleTap(toLocal(e), g.onImage, g.pointerType);
      return;
    }

    if (g.type === 'pan') {
      settle(scale.get(), x.get(), y.get());
      return;
    }

    if (g.axis === 'x' && Math.abs(x.get()) > SWIPE_DISTANCE) {
      if (x.get() < 0) onNext();
      else onPrev();
      return;
    }
    if (g.axis === 'y' && Math.abs(y.get()) > CLOSE_DISTANCE) {
      onClose();
      return;
    }
    resetZoom();
    animate(backdropOpacity, 1);
  };

  // Wheel / trackpad pinch zoom. Registered natively because React wheel listeners are passive.
  useEffect(() => {
    const el = containerRef.current;
    const onWheel = (e) => {
      e.preventDefault();
      const s = scale.get();
      const nextScale = clamp(s * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.002)), 1, maxScale());
      const t = translationForZoom(toLocal(e), nextScale);
      const limits = panLimits(nextScale);
      scale.set(nextScale);
      x.set(clamp(t.x, -limits.x, limits.x));
      y.set(clamp(t.y, -limits.y, limits.y));
      clearTimeout(wheelTimer.current);
      wheelTimer.current = setTimeout(() => setZoom(scale.get()), 150);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      clearTimeout(wheelTimer.current);
    };
  });

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onPrev();
      else if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, onPrev, onNext]);

  const ratio = entry.width / entry.height;
  const controlClass =
    'flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-2xl text-white transition hover:bg-accentColor active:scale-90';

  return (
    <motion.div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-50 touch-none select-none overflow-hidden overscroll-contain"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <motion.div className="absolute inset-0 bg-black/95" style={{ opacity: backdropOpacity }} />

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          key={src}
          ref={frameRef}
          data-viewer-image
          style={{ x, y, scale }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className={zoom > 1.01 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'}
        >
          <ProgressiveImage
            src={src}
            alt={alt}
            zoom={zoom}
            loadOriginal={wantOriginal}
            onVariantLoad={(variant) => {
              if (variant.src === original.src) setOriginalLoaded(true);
            }}
            style={{ width: `min(100vw, calc(100 * var(--dvh) * ${ratio}))` }}
          />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4">
        <div className="flex min-w-0 items-center gap-2">
          <span className="rounded-full bg-black/50 px-3 py-1 text-sm tabular-nums text-white">
            {counter}
          </span>
          {showOriginalBadge && (
            <span
              className="truncate rounded-full bg-black/50 px-3 py-1 text-xs text-gray-300"
              aria-live="polite"
            >
              {originalLoaded
                ? `Original · ${original.width} × ${original.height}`
                : `Loading original · ${formatMB(original.bytes)}`}
            </span>
          )}
        </div>
        <button
          type="button"
          aria-label="Close"
          onPointerDown={stopGesture}
          onClick={onClose}
          className={`pointer-events-auto ${controlClass}`}
        >
          ✕
        </button>
      </div>

      <button
        type="button"
        aria-label="Previous Photo"
        onPointerDown={stopGesture}
        onClick={onPrev}
        className={`absolute left-4 top-1/2 hidden -translate-y-1/2 md:flex ${controlClass}`}
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Next Photo"
        onPointerDown={stopGesture}
        onClick={onNext}
        className={`absolute right-4 top-1/2 hidden -translate-y-1/2 md:flex ${controlClass}`}
      >
        ›
      </button>
    </motion.div>
  );
}

export default FullscreenViewer;
