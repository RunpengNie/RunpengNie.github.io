import React from 'react';
import { scrollBehavior } from '../lib/motion';

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  };

  return (
    <footer className="bg-backGroundColor text-white mt-16 border-t border-gray-700">
      <div className="max-w-6xl mx-auto pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Copyright */}
        <p className="text-sm">
          © {new Date().getFullYear()} Jerry Nie. All rights reserved.
        </p>

        {/* Back to Top */}
        <button
          type="button"
          onClick={scrollToTop}
          className="min-h-11 px-4 py-2 rounded bg-accentColor text-black text-sm transition hover:opacity-80 active:opacity-80 active:scale-95"
        >
          ↑ Back to Top
        </button>
      </div>
    </footer>
  );
}

export default Footer;
