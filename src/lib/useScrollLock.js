import { useEffect } from 'react';

let activeLocks = 0;

// Prevents the page behind an overlay from scrolling while `active` is true.
export default function useScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined;
    const root = document.documentElement;
    const { body } = document;
    if (activeLocks === 0) {
      // Keep the layout from shifting when the desktop scrollbar disappears.
      body.style.paddingRight = `${window.innerWidth - root.clientWidth}px`;
      root.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
    }
    activeLocks += 1;
    return () => {
      activeLocks -= 1;
      if (activeLocks === 0) {
        root.style.overflow = '';
        body.style.overflow = '';
        body.style.paddingRight = '';
      }
    };
  }, [active]);
}
