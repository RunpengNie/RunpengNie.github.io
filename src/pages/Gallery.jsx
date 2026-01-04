import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
  {
    name: 'Non-people',
    images: [
      '/assets/landscape/1.jpg',
      '/assets/landscape/2.jpg',
      '/assets/landscape/3.jpg',
      '/assets/landscape/4.jpg',
      '/assets/landscape/5.jpg',
      '/assets/landscape/6.jpg',
      '/assets/landscape/7.jpg',
      '/assets/landscape/8.jpg',
      '/assets/landscape/9.jpg',
      '/assets/landscape/10.jpg',
      '/assets/landscape/11.jpg',
      '/assets/landscape/12.jpg',
      '/assets/landscape/13.jpg',
      // '/assets/landscape/14.dng', need more work here
      '/assets/landscape/15.jpg',
      '/assets/landscape/16.jpg',
      '/assets/landscape/17.jpg',
      '/assets/landscape/18.jpg',
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
      { location: 'Olympic National Park/Seattle/Bellevue, WA, United States' },
      { location: 'University of Colorado Boulder, CO, United States' },
      { location: 'Minneapolis, MN, United States' },
      { location: '44.783949°N 117.813169°W, Oregon, United States' },
      { location: 'Minneapolis, MN, United States' },
      // { location: 'Las Vegas, NV, United States' },
      { location: 'Las Vegas, NV, United States' },
      { location: 'Bellevue, WA, United States' },
      { location: 'San Juan, PR, United States' },
      { location: 'San Juan, PR, United States' },
    ],
  },
  {
    name: 'People',
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
    ],
    descriptions: [
      { title: '花间佳人', location: 'Olalla Canyon, WA, United States', model: 'Iris C.' },
      { title: 'Twilight Silhouette by the Sea', location: 'Bird Rock, CA, United States', model: 'Sherry J.' },
      { title: 'Light and Shadow', location: '37.501311°N 122.472303°W, CA, United States', model: 'Vincent X.' },
      { title: 'Serenity Afloat', location: 'Lake Washington, WA, United States', model: 'Jerry N.' },
      { title: 'Climber', location: 'Hurricane Ridge, WA, United States', model: 'Tony L.' },
      { title: 'Lost', location: 'Strat/Stratosphere, NV, United States', model: 'Yuxin Z.' },
      { title: 'Garita Gaze', location: 'San Juan, PR, United States', model: 'Tony L.' },
      { title: 'Swing', location: 'Vieques, PR, United States', model: 'LL.' },
      { title: 'Public Storage', location: 'Seattle, WA, United States', model: 'N/A' },
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

function Gallery() {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPrivacyPopup, setShowPrivacyPopup] = useState(false);
  const [popupShown, setPopupShown] = useState(false);
  const [shuffledPairs, setShuffledPairs] = useState([]);

  const currentCategory = categories[categoryIndex];
  const images = currentCategory.images;
  const descriptions = currentCategory.descriptions;

  // Switch Category 
  const prevCategory = () => {
    const newIndex = (categoryIndex - 1 + categories.length) % categories.length;
    setCategoryIndex(newIndex);
    setPhotoIndex(0);
  };

  const nextCategory = () => {
    const newIndex = (categoryIndex + 1) % categories.length;
    setCategoryIndex(newIndex);
    setPhotoIndex(0);
  };

  // Switch photos (use shuffledPairs length)
  const prevPhoto = () => {
    if (!shuffledPairs || shuffledPairs.length === 0) return;
    setPhotoIndex((photoIndex - 1 + shuffledPairs.length) % shuffledPairs.length);
  };

  const nextPhoto = () => {
    if (!shuffledPairs || shuffledPairs.length === 0) return;
    setPhotoIndex((photoIndex + 1) % shuffledPairs.length);
  };

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  // Privacy pop up
  useEffect(() => {
    if (currentCategory.name === 'People' && !popupShown) {
      setShowPrivacyPopup(true);
      setPopupShown(true);
    }
  }, [currentCategory.name, popupShown]);

  // Build and shuffle pairs of { src, desc } for the current category
  // so images and descriptions stay matched but appear in random order.
  useEffect(() => {
    const pairs = images.map((src, i) => ({ src, desc: descriptions[i] || {} }));
    const shuffled = shuffleArray(pairs);
    setShuffledPairs(shuffled);
    setPhotoIndex(0);
  }, [categoryIndex]);

  // preload ±2 photos from shuffledPairs
  useEffect(() => {
    if (!shuffledPairs || shuffledPairs.length === 0) return;

    const len = shuffledPairs.length;
    const preloadIndices = [
      (photoIndex - 2 + len) % len,
      (photoIndex - 1 + len) % len,
      (photoIndex + 1) % len,
      (photoIndex + 2) % len,
    ];

    preloadIndices.forEach(i => {
      const img = new Image();
      img.src = shuffledPairs[i].src;
    });
  }, [photoIndex, shuffledPairs]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 flex flex-col items-center">

      {/* Category Switch */}
      <div className="flex items-center justify-center gap-6 mb-8 w-full max-w-xl">
        <button
          onClick={prevCategory}
          aria-label="Previous Category"
          className="text-accentColor bg-black bg-opacity-50 hover:bg-opacity-80 rounded-full p-3 select-none"
        >
          ‹
        </button>

        <h3 className="text-accentColor text-3xl font-bold text-center select-none">{currentCategory.name}</h3>

        <button
          onClick={nextCategory}
          aria-label="Next Category"
          className="text-accentColor bg-black bg-opacity-50 hover:bg-opacity-80 rounded-full p-3 select-none"
        >
          ›
        </button>
      </div>

      {/* Image Viewer */}
      <div className="flex items-center justify-center w-full gap-6">
        <button
          onClick={prevPhoto}
          aria-label="Previous Photo"
          className="text-white text-3xl bg-black/50 hover:bg-accentColor hover:text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 select-none"
        >
          ‹
        </button>

        <div className="flex-shrink-0 max-w-full cursor-pointer" onClick={toggleFullscreen}>
          <AnimatePresence mode="wait">
            {shuffledPairs && shuffledPairs[photoIndex] && (
              <motion.img
                key={shuffledPairs[photoIndex].src}
                src={shuffledPairs[photoIndex].src}
                alt={`${currentCategory.name} image ${photoIndex + 1}`}
                className="w-full max-h-[90vh] rounded-lg shadow-lg object-contain"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={nextPhoto}
          aria-label="Next Photo"
          className="text-white text-3xl bg-black/50 hover:bg-accentColor hover:text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 select-none"
        >
          ›
        </button>
      </div>

      {/* Picture Description */}
      <div className="mt-4 text-center text-white max-w-xl select-none whitespace-pre-line">
        {shuffledPairs && shuffledPairs[photoIndex] && (
          currentCategory.name === 'Non-people' ? (
            <div className="text-sm text-gray-300">{shuffledPairs[photoIndex].desc.location}</div>
          ) : (
            <>
              <div className="text-gray-400 italic text-lg mb-1">{shuffledPairs[photoIndex].desc.title}</div>
              <div className="text-sm text-gray-300">{shuffledPairs[photoIndex].desc.location}</div>
              <div className="text-sm text-gray-300">Model: {shuffledPairs[photoIndex].desc.model}</div>
            </>
          )
        )}
      </div>

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={toggleFullscreen}
        >
          {shuffledPairs && shuffledPairs[photoIndex] && (
            <motion.img
              key={`fullscreen-${shuffledPairs[photoIndex].src}`}
              src={shuffledPairs[photoIndex].src}
              alt={`${currentCategory.name} image ${photoIndex + 1}`}
              className="max-w-full max-h-full rounded-lg shadow-xl object-contain cursor-zoom-out"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </div>
      )}

      {/* Privacy pop up window */}
      {showPrivacyPopup && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-sm text-center shadow-lg">
            <p className="text-white mb-4 text-sm leading-relaxed">
              To protect the privacy of the models, front-facing portraits of the models are not included.
            </p>
            <button
              onClick={() => setShowPrivacyPopup(false)}
              className="px-4 py-2 bg-accentColor text-black rounded hover:opacity-80 transition"
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