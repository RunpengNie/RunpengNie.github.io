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
 * The target is the smallest variant covering (rendered CSS width x devicePixelRatio x zoom);
 * the original file is only used when even the 4K variant is too small.
 *
 * fit="frame" (default): the frame's height comes from the image aspect ratio, so set its width.
 * fit="cover": the frame is sized by the caller and the image is cropped to fill it.
 * zoom: extra magnification applied by the caller (e.g. pinch zoom), raising the required resolution.
 * maxDpr: caps the device pixel ratio used for selection, to save bandwidth on less important images.
 */
function ProgressiveImage({
  src,
  alt,
  className = '',
  style,
  fit = 'frame',
  zoom = 1,
  maxDpr = Infinity,
  priority = false,
  ...rest
}) {
  const entry = getImage(src);
  const frameRef = useRef(null);
  const dpr = Math.min(useDevicePixelRatio(), maxDpr);
  const [box, setBox] = useState({ width: 0, height: 0 });
  const maxRequired = useRef({ src, width: 0 });

  useLayoutEffect(() => {
    const el = frameRef.current;
    // offsetWidth ignores transforms (e.g. entry scale animations), unlike getBoundingClientRect.
    const update = () => setBox({ width: el.offsetWidth, height: el.offsetHeight });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // With "cover" the image can be wider than its frame.
  const renderedWidth =
    fit === 'cover' ? Math.max(box.width, box.height * (entry.width / entry.height)) : box.width;

  // Never downgrade: once a larger size was needed, keep using it.
  if (maxRequired.current.src !== src) maxRequired.current = { src, width: 0 };
  const required = Math.ceil(renderedWidth * dpr * zoom);
  if (required > maxRequired.current.width) maxRequired.current.width = required;

  const target = box.width > 0 ? pickVariant(entry, maxRequired.current.width) : null;
  const thumb = entry.variants[0];
  const base = target && (bestLoadedBelow(entry, target) ?? (target === thumb ? null : thumb));

  return (
    <div
      ref={frameRef}
      role="img"
      aria-label={alt}
      className={`relative overflow-hidden ${className}`}
      style={fit === 'frame' ? { aspectRatio: `${entry.width} / ${entry.height}`, ...style } : style}
      {...rest}
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
