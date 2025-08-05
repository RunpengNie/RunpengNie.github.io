import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 两个类别数据
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
    ],
    descriptions: [
      { location: 'Bird Rock, CA, United States' },
      { location: 'Bellevue, WA, United States' },
      { location: 'I90, WA, United States' },
      { location: 'Cancún, Mexico' },
      { location: 'Cancún, Mexico' },
      { location: 'Fog Harbor Fish House, CA, United States' },
      { location: 'Yunnan, China' },
      { location: 'Longs Peak, CO, United States' },
    ],
  },
  {
    name: 'People',
    images: [
      '/assets/portrait/1.jpg',
      '/assets/portrait/2.jpg',
      '/assets/portrait/3.jpg',
      '/assets/portrait/4.jpg',
    ],
    descriptions: [
      { title: 'A Lady Amidst the Flowers', location: 'Olalla Canyon, WA, United States', model: 'Iris C.' },
      { title: 'Twilight Silhouette by the Sea', location: 'Bird Rock, CA, United States', model: 'Tongyue J.' },
      { title: 'Light and Shadow', location: '37.501311N 122.472303W, CA, United States', model: 'Vincent X.' },
      { title: 'Serenity Afloat', location: 'Lake Washington, WA, United States', model: 'Jerry N.' },
    ],
  },
];

function Gallery() {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);

  const currentCategory = categories[categoryIndex];
  const images = currentCategory.images;
  const descriptions = currentCategory.descriptions;

  // 切换类别（循环）
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

  // 切换照片（循环）
  const prevPhoto = () => {
    setPhotoIndex((photoIndex - 1 + images.length) % images.length);
  };

  const nextPhoto = () => {
    setPhotoIndex((photoIndex + 1) % images.length);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-16 flex flex-col items-center">

      {/* 类别切换区 */}
      <div className="flex items-center justify-center gap-6 mb-12 w-full max-w-xl">
        <button
          onClick={prevCategory}
          aria-label="Previous Category"
          className="text-myOrange bg-black bg-opacity-50 hover:bg-opacity-80 rounded-full p-3 select-none"
        >
          ‹
        </button>

        <h3 className="text-myOrange text-4xl font-bold text-center select-none">
          {currentCategory.name}
        </h3>

        <button
          onClick={nextCategory}
          aria-label="Next Category"
          className="text-myOrange bg-black bg-opacity-50 hover:bg-opacity-80 rounded-full p-3 select-none"
        >
          ›
        </button>
      </div>

      {/* 图片展示区 */}
      <div className="flex items-center justify-center w-full max-w-5xl mx-auto gap-6">
        {/* 左箭头 */}
        <button
          onClick={prevPhoto}
          aria-label="Previous Photo"
          className="text-white text-3xl bg-black/50 hover:bg-myOrange hover:text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 select-none"
        >
          ‹
        </button>

        {/* 图片容器 */}
        <div className="flex-shrink-0 max-w-[90vw]">
          <AnimatePresence mode="wait">
            <motion.img
              key={images[photoIndex]}
              src={images[photoIndex]}
              alt={`${currentCategory.name} image ${photoIndex + 1}`}
              className="w-full max-h-[80vh] rounded-lg shadow-lg object-contain"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>
        </div>

        {/* 右箭头 */}
        <button
          onClick={nextPhoto}
          aria-label="Next Photo"
          className="text-white text-3xl bg-black/50 hover:bg-myOrange hover:text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 select-none"
        >
          ›
        </button>
      </div>

      {/* 图片介绍 */}
      <div className="mt-6 text-center text-white max-w-xl select-none whitespace-pre-line">
        {currentCategory.name === 'Non-people' ? (
          // 非人像类：只显示地点
          <div className="text-lg">{descriptions[photoIndex].location}</div>
        ) : (
          // 人像类：三行
          <>
            <div className="text-gray-400 italic text-2xl mb-1">
              {descriptions[photoIndex].title}
            </div>
            <div className="text-base text-gray-200">
              {descriptions[photoIndex].location}
            </div>
            <div className="text-base text-gray-200">
              Model: {descriptions[photoIndex].model}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Gallery;
