import React, { useLayoutEffect, useRef, useState } from 'react';
import { bestLoadedBelow, getImage, isLoaded, markLoaded, pickVariant } from '../lib/images';
import useDevicePixelRatio from '../lib/useDevicePixelRatio';

function Layer({ variant, priority }) {
  const [visible, setVisible] = useState(() => isLoaded(variant.src));

  return (
    <img
      src={variant.src}
      alt=""
      aria-hidden="true"
      draggable={false}
      decoding="async"
      fetchpriority={priority ? 'high' : undefined}
      onLoad={() => {
        markLoaded(variant.src);
        setVisible(true);
      }}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
}

/**
 * Progressive, resolution-aware image.
 * Layers: inline blurred placeholder -> thumbnail (or a smaller cached size) -> target size.
 * The target is the smallest variant covering (rendered CSS width x devicePixelRatio);
 * the original file is only used when even the 4K variant is too small.
 * The frame's height comes from the image aspect ratio, so set its width via className/style.
 */
function ProgressiveImage({ src, alt, className = '', style, onClick, priority = false }) {
  const entry = getImage(src);
  const frameRef = useRef(null);
  const dpr = useDevicePixelRatio();
  const [cssWidth, setCssWidth] = useState(0);
  const maxRequired = useRef({ src, width: 0 });

  useLayoutEffect(() => {
    const el = frameRef.current;
    // offsetWidth ignores transforms (e.g. entry scale animations), unlike getBoundingClientRect.
    const update = () => setCssWidth(el.offsetWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Never downgrade: once a larger size was needed, keep using it.
  if (maxRequired.current.src !== src) maxRequired.current = { src, width: 0 };
  const required = Math.ceil(cssWidth * dpr);
  if (required > maxRequired.current.width) maxRequired.current.width = required;

  const target = cssWidth > 0 ? pickVariant(entry, maxRequired.current.width) : null;
  const thumb = entry.variants[0];
  const base = target && (bestLoadedBelow(entry, target) ?? (target === thumb ? null : thumb));

  return (
    <div
      ref={frameRef}
      role="img"
      aria-label={alt}
      onClick={onClick}
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: `${entry.width} / ${entry.height}`, ...style }}
    >
      <img
        src={entry.placeholder}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl"
      />
      {base && <Layer key={base.src} variant={base} priority={priority} />}
      {target && <Layer key={target.src} variant={target} priority={priority} />}
    </div>
  );
}

export default ProgressiveImage;
