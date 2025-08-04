import React from 'react';

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-seaBlack text-white mt-16 border-t border-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Copyright */}
        <p className="text-sm">
          © {new Date().getFullYear()} Jerry Nie. All rights reserved.
        </p>

        {/* Back to Top */}
        <button
          onClick={scrollToTop}
          className="px-3 py-1 rounded bg-myOrange text-black text-sm hover:opacity-80 transition"
        >
          ↑ Back to Top
        </button>
      </div>
    </footer>
  );
}

export default Footer;
