import React from 'react';
import { HiArrowUp } from 'react-icons/hi';
import { scrollBehavior } from '../lib/motion';

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  };

  return (
    <footer className="bg-backGroundColor text-white border-t border-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Copyright */}
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Jerry Nie. All rights reserved.
        </p>

        {/* Back to Top */}
        <button
          type="button"
          onClick={scrollToTop}
          className="inline-flex min-h-11 items-center gap-1 px-2 text-sm text-gray-400 transition hover:text-white active:text-white"
        >
          <HiArrowUp aria-hidden="true" />
          Back to top
        </button>
      </div>
    </footer>
  );
}

export default Footer;
