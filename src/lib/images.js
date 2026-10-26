import manifest from '../data/imageManifest.json';

// Sources whose bytes are already in the browser cache (loaded or preloaded).
const loadedSrcs = new Set();

export function markLoaded(src) {
  loadedSrcs.add(src);
}

export function isLoaded(src) {
  return loadedSrcs.has(src);
}

// Accepts "/assets/landscape/1.jpg" or "landscape/1.jpg".
export function getImage(path) {
  const key = path.replace(/^\/?assets\//, '').replace(/^\//, '');
  const entry = manifest[key];
  if (!entry) throw new Error(`Image "${path}" is missing from imageManifest.json. Run "npm run images".`);
  return entry;
}

// Smallest variant at least `requiredWidth` physical pixels wide.
// The original is only chosen when every generated size (up to 4K) is too small.
export function pickVariant(entry, requiredWidth) {
  const { variants } = entry;
  return variants.find((v) => v.width >= requiredWidth) ?? variants[variants.length - 1];
}

// Largest already-loaded variant narrower than `target`, used as an instant base layer.
export function bestLoadedBelow(entry, target) {
  let best = null;
  for (const v of entry.variants) {
    if (v.width >= target.width) break;
    if (loadedSrcs.has(v.src)) best = v;
  }
  return best;
}

export function getDevicePixelRatio() {
  return typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
}

// CSS width of an image fitted ("contain") inside a box.
export function fitWidth(entry, boxWidth, boxHeight) {
  return Math.min(boxWidth, boxHeight * (entry.width / entry.height));
}

export function preloadImage(src) {
  if (loadedSrcs.has(src)) return;
  const img = new Image();
  img.decoding = 'async';
  img.onload = () => loadedSrcs.add(src);
  img.src = src;
}
