import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPhotograph, HiViewGrid } from 'react-icons/hi';
import ProgressiveImage from '../components/ProgressiveImage';
import FullscreenViewer from '../components/FullscreenViewer';
import { fitWidth, getImage, markLoaded, pickVariant, preloadImage } from '../lib/images';
import { scrollBehavior } from '../lib/motion';
import useDevicePixelRatio from '../lib/useDevicePixelRatio';
import useScrollLock from '../lib/useScrollLock';

// Main viewer height limit, as a fraction of the small viewport height.
const VIEWER_MAX_HEIGHT = 0.8;
const SWIPE_THRESHOLD = 60;

const aspectRatio = (src) => {
  const { width, height } = getImage(src);
  return width / height;
};

const slideVariants = {
  enter: (direction) => ({ opacity: 0, x: direction >= 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction >= 0 ? -60 : 60 }),
};

const categories = [
  {
    name: 'Non-portraits',
    images: [
      '/assets/non-portrait/1.jpg',
      '/assets/non-portrait/2.jpg',
      '/assets/non-portrait/3.jpg',
      '/assets/non-portrait/4.jpg',
      '/assets/non-portrait/5.jpg',
      '/assets/non-portrait/6.jpg',
      '/assets/non-portrait/7.jpg',
      '/assets/non-portrait/8.jpg',
      '/assets/non-portrait/9.jpg',
      '/assets/non-portrait/10.jpg',
      '/assets/non-portrait/11.jpg',
      '/assets/non-portrait/12.jpg',
      '/assets/non-portrait/13.jpg',
      // '/assets/non-portrait/14.dng', need more work here
      '/assets/non-portrait/15.jpg',
      '/assets/non-portrait/16.jpg',
      '/assets/non-portrait/17.jpg',
      '/assets/non-portrait/18.jpg',
      '/assets/non-portrait/19.jpg',
      '/assets/non-portrait/20.jpg',
    ],
    descriptions: [
      { location: 'Bird Rock, CA, United States' },
      { location: 'Seattle/Bellevue, WA, United States' },
      { location: 'I90, WA, United States' },
      { location: 'Cancún, Mexico' },
      { location: 'Cancún, Mexico' },
      { location: 'Fog Harbor Fish House, CA, United States' },
      { location: 'Yunnan, China' },
      { location: 'Longs Peak, CO, United States' },
      { location: 'Sipsongpanna, Yunnan, China' },
      { location: 'University of Colorado Boulder, CO, United States' },
      { location: 'Minneapolis, MN, United States' },
      { location: '44.783949°N 117.813169°W, Oregon, United States' },
      { location: 'Minneapolis, MN, United States' },
      // { location: 'Las Vegas, NV, United States' },
      { location: 'Las Vegas, NV, United States' },
      { location: 'Bellevue, WA, United States' },
      { location: 'San Juan, PR, United States' },
      { location: 'San Juan, PR, United States' },
      { location: 'Seattle/Bellevue, WA, United States' },
      { location: 'Sipsongpanna, Yunnan, China' },
    ],
  },
  {
    name: 'Portraits',
    images: [
      '/assets/portrait/1.jpg',
      '/assets/portrait/2.jpg',
      '/assets/portrait/3.jpg',
      '/assets/portrait/4.jpg',
      '/assets/portrait/5.jpg',
      '/assets/portrait/6.jpg',
      '/assets/portrait/7.jpg',
      '/assets/portrait/8.jpg',
      '/assets/portrait/9.jpg',
      '/assets/portrait/10.jpg',
      '/assets/portrait/11.jpg',
    ],
    descriptions: [
      { title: '花间佳人', location: 'Olalla Canyon, WA, United States', model: 'Iris C.' },
      { title: 'Twilight Silhouette by the Sea', location: 'Bird Rock, CA, United States', model: 'Sherry J.' },
      { title: 'Light and Shadow', location: '37.501311°N 122.472303°W, CA, United States', model: 'Vincent X.' },
      { title: 'Serenity Afloat', location: 'Lake Washington, WA, United States', model: 'Jerry N.' },
      { title: 'Climber', location: 'Hurricane Ridge, WA, United States', model: 'Tony L.' },
      { title: 'Lakeside Glance', location: 'Sipsongpanna, Yunnan, China', model: 'Yuxin Z.' },
      { title: 'Garita Gaze', location: 'San Juan, PR, United States', model: 'Tony L.' },
      { title: 'Swing', location: 'Vieques, PR, United States', model: 'LL.' },
      { title: 'Public Storage', location: 'Seattle, WA, United States', model: 'N/A' },
      { title: 'Breathe in Blue', location: 'Sipsongpanna, Yunnan, China', model: 'Dr. Jenny Z.' },
      { title: '桜の下で', location: 'University of Washington, WA, United States', model: 'N/A' },
    ],
  },
];

// Fisher–Yates shuffle helper — returns a new shuffled copy
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const arrowButtonClass =
  'flex items-center justify-center rounded-full bg-black/50 text-white shadow-lg transition select-none hover:bg-accentColor hover:scale-110 active:scale-95';

function Gallery() {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [view, setView] = useState('slide');
  const [photoIndex, setPhotoIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPrivacyPopup, setShowPrivacyPopup] = useState(false);
  const [popupShown, setPopupShown] = useState(false);
  const [shuffledPairs, setShuffledPairs] = useState([]);
  const [viewerBox, setViewerBox] = useState({ width: 0, height: 0 });
  const viewerRef = useRef(null);
  const stripRef = useRef(null);
  const draggedRef = useRef(false);
  const dpr = useDevicePixelRatio();

  const currentCategory = categories[categoryIndex];
  const count = shuffledPairs.length;
  const current = shuffledPairs[photoIndex];

  useScrollLock(showPrivacyPopup);

  const prevPhoto = useCallback(() => {
    if (count === 0) return;
    setDirection(-1);
    setPhotoIndex((i) => (i - 1 + count) % count);
  }, [count]);

  const nextPhoto = useCallback(() => {
    if (count === 0) return;
    setDirection(1);
    setPhotoIndex((i) => (i + 1) % count);
  }, [count]);

  const goToPhoto = (index) => {
    if (index === photoIndex) return;
    setDirection(index > photoIndex ? 1 : -1);
    setPhotoIndex(index);
  };

  const closeFullscreen = useCallback(() => setIsFullscreen(false), []);

  // Privacy pop up
  useEffect(() => {
    if (currentCategory.name === 'Portraits' && !popupShown) {
      setShowPrivacyPopup(true);
      setPopupShown(true);
    }
  }, [currentCategory.name, popupShown]);

  // Build and shuffle pairs of { src, desc } for the current category
  // so images and descriptions stay matched but appear in random order.
  useEffect(() => {
    const { images, descriptions } = categories[categoryIndex];
    const pairs = images.map((src, i) => ({ src, desc: descriptions[i] || {} }));
    const shuffled = shuffleArray(pairs);
    setShuffledPairs(shuffled);
    setDirection(1);
    setPhotoIndex(0);
  }, [categoryIndex]);

  // Track the space available to the main viewer, used to size preloads.
  useLayoutEffect(() => {
    const el = viewerRef.current;
    const update = () =>
      setViewerBox({ width: el.clientWidth, height: window.innerHeight * VIEWER_MAX_HEIGHT });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  // preload ±2 photos from shuffledPairs, at the size the current view will display them
  useEffect(() => {
    const box = isFullscreen
      ? { width: window.innerWidth, height: window.innerHeight }
      : viewerBox;
    if (count === 0 || box.width === 0) return;
    const preloadIndices = [
      (photoIndex - 2 + count) % count,
      (photoIndex - 1 + count) % count,
      (photoIndex + 1) % count,
      (photoIndex + 2) % count,
    ];

    preloadIndices.forEach(i => {
      const entry = getImage(shuffledPairs[i].src);
      const cssWidth = fitWidth(entry, box.width, box.height);
      preloadImage(entry.variants[0].src);
      preloadImage(pickVariant(entry, Math.ceil(cssWidth * dpr)).src);
    });
  }, [photoIndex, shuffledPairs, count, viewerBox, isFullscreen, dpr]);

  // Keep the active thumbnail centered in the strip.
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = strip?.querySelector(`[data-index="${photoIndex}"]`);
    if (!thumb) return;
    strip.scrollTo({
      left: thumb.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2,
      behavior: scrollBehavior(),
    });
  }, [photoIndex, shuffledPairs]);

  return (
    <section className="max-w-7xl mx-auto px-4 pt-20 pb-16 md:pt-24 flex flex-col items-center">

      <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
      {/* Category tabs */}
      <div role="tablist" aria-label="Photo category" className="inline-flex rounded-full bg-white/5 p-1">
        {categories.map((category, i) => {
          const selected = i === categoryIndex;
          return (
            <button
              key={category.name}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setCategoryIndex(i)}
              className={`relative min-h-11 rounded-full px-5 text-sm font-semibold transition-colors select-none md:px-6 md:text-base ${
                selected ? 'text-white' : 'text-gray-400 hover:text-white active:text-white'
              }`}
            >
              {selected && (
                <motion.span
                  layoutId="category-pill"
                  className="absolute inset-0 rounded-full bg-accentColor"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
              <span className="relative">{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* View toggle: slideshow / grid overview */}
      <div className="inline-flex rounded-full bg-white/5 p-1" role="group" aria-label="View">
        {[
          { id: 'slide', label: 'Slideshow', Icon: HiPhotograph },
          { id: 'grid', label: 'Grid', Icon: HiViewGrid },
        ].map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            aria-label={label}
            aria-pressed={view === id}
            onClick={() => setView(id)}
            className={`flex h-11 w-11 items-center justify-center rounded-full text-xl transition-colors ${
              view === id ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white active:text-white'
            }`}
          >
            <Icon />
          </button>
        ))}
      </div>
      </div>

      {/* Slideshow. Kept mounted (just hidden) in grid view so the viewer size observer keeps working. */}
      <div className={view === 'slide' ? 'contents' : 'hidden'}>

      {/* Image Viewer */}
      <div className="flex items-center justify-center w-full md:gap-6">
        <button
          type="button"
          onClick={prevPhoto}
          aria-label="Previous Photo"
          className={`hidden md:flex h-14 w-14 flex-none text-3xl ${arrowButtonClass}`}
        >
          ‹
        </button>

        <div ref={viewerRef} className="flex-1 min-w-0">
          <AnimatePresence mode="wait" custom={direction}>
            {current && (
              <motion.div
                key={current.src}
                className="flex justify-center"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                drag={count > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onPointerDownCapture={() => {
                  draggedRef.current = false;
                }}
                onDragStart={() => {
                  draggedRef.current = true;
                }}
                onDragEnd={(_, info) => {
                  const swipe = info.offset.x + info.velocity.x * 0.2;
                  if (swipe <= -SWIPE_THRESHOLD) nextPhoto();
                  else if (swipe >= SWIPE_THRESHOLD) prevPhoto();
                }}
              >
                <ProgressiveImage
                  src={current.src}
                  alt={`${currentCategory.name} image ${photoIndex + 1}`}
                  onClick={() => {
                    if (!draggedRef.current) setIsFullscreen(true);
                  }}
                  className="cursor-pointer rounded-sm"
                  style={{
                    width: `min(100%, calc(${VIEWER_MAX_HEIGHT * 100} * var(--svh) * ${aspectRatio(current.src)}))`,
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={nextPhoto}
          aria-label="Next Photo"
          className={`hidden md:flex h-14 w-14 flex-none text-3xl ${arrowButtonClass}`}
        >
          ›
        </button>
      </div>

      {/* Position indicator, with arrow buttons on small screens */}
      {count > 0 && (
        <div className="mt-3 flex items-center gap-4">
          <button
            type="button"
            onClick={prevPhoto}
            aria-label="Previous Photo"
            className={`md:hidden h-11 w-11 text-2xl ${arrowButtonClass}`}
          >
            ‹
          </button>
          <span className="min-w-[4.5rem] text-center text-sm tabular-nums text-gray-400" aria-live="polite">
            {photoIndex + 1} / {count}
          </span>
          <button
            type="button"
            onClick={nextPhoto}
            aria-label="Next Photo"
            className={`md:hidden h-11 w-11 text-2xl ${arrowButtonClass}`}
          >
            ›
          </button>
        </div>
      )}

      {/* Picture Description */}
      <div className="mt-3 text-center text-white max-w-xl select-none whitespace-pre-line">
        {current && (
          currentCategory.name === 'Non-portraits' ? (
            <div className="text-sm text-gray-300">{current.desc.location}</div>
          ) : (
            <>
              <div className="text-gray-400 italic text-lg mb-1">{current.desc.title}</div>
              <div className="text-sm text-gray-300">{current.desc.location}</div>
              <div className="text-sm text-gray-300">Model: {current.desc.model}</div>
            </>
          )
        )}
      </div>

      {/* Thumbnail strip */}
      {count > 1 && (
        <div ref={stripRef} className="thin-scrollbar relative mt-6 w-full max-w-4xl overflow-x-auto overscroll-x-contain pb-2">
          <div className="mx-auto flex w-max gap-2 px-1 py-1">
            {shuffledPairs.map((pair, i) => {
              const thumb = getImage(pair.src).variants[0];
              const active = i === photoIndex;
              return (
                <button
                  key={pair.src}
                  type="button"
                  data-index={i}
                  onClick={() => goToPhoto(i)}
                  aria-label={`Show photo ${i + 1}`}
                  aria-current={active}
                  className={`h-14 w-14 flex-none overflow-hidden rounded-sm ring-2 transition md:h-16 md:w-16 ${
                    active ? 'ring-accentColor opacity-100' : 'ring-transparent opacity-50 hover:opacity-90 active:opacity-90'
                  }`}
                >
                  <img
                    src={thumb.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    onLoad={() => markLoaded(thumb.src)}
                    className="h-full w-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      </div>

      {/* Grid overview (masonry columns); a photo opens in the fullscreen viewer */}
      {view === 'grid' && (
        <div className="w-full columns-2 gap-3 md:columns-3 lg:columns-4">
          {shuffledPairs.map((pair, i) => (
            <button
              key={pair.src}
              type="button"
              onClick={() => {
                setPhotoIndex(i);
                setIsFullscreen(true);
              }}
              aria-label={`Open photo ${i + 1}`}
              className="mb-3 block w-full break-inside-avoid overflow-hidden rounded-sm transition-opacity hover:opacity-85 active:opacity-85"
            >
              <ProgressiveImage src={pair.src} alt={`${currentCategory.name} image ${i + 1}`} lazy className="w-full" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen viewer */}
      <AnimatePresence>
        {isFullscreen && current && (
          <FullscreenViewer
            key="fullscreen"
            src={current.src}
            alt={`${currentCategory.name} image ${photoIndex + 1}`}
            counter={`${photoIndex + 1} / ${count}`}
            onPrev={prevPhoto}
            onNext={nextPhoto}
            onClose={closeFullscreen}
          />
        )}
      </AnimatePresence>

      {/* Privacy pop up window */}
      {showPrivacyPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            className="max-w-sm rounded-xl border border-white/15 bg-white/10 p-6 text-center shadow-2xl shadow-black/40 backdrop-blur-md"
          >
            <p className="mb-5 text-sm leading-relaxed text-gray-100">
              To protect the privacy of the models, front-facing portraits of the models are not included.
            </p>
            <button
              type="button"
              onClick={() => setShowPrivacyPopup(false)}
              className="min-h-11 rounded-full bg-accentColor px-8 py-2 text-white transition hover:opacity-85 active:opacity-85"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Gallery;
