export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function scrollBehavior() {
  return prefersReducedMotion() ? 'auto' : 'smooth';
}

// Jumps to the top regardless of the global `scroll-behavior: smooth` rule.
export function scrollToTopInstantly() {
  const root = document.documentElement;
  const previous = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
  root.style.scrollBehavior = previous;
}
