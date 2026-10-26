// Generates responsive WebP variants (thumb / 1080p / 2k / 4k) for site photos
// plus an inline blurred placeholder, and writes src/data/imageManifest.json.
// Incremental: an image is only re-encoded when its source hash changes.
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const ASSETS_DIR = path.join(PUBLIC_DIR, 'assets');
const OUTPUT_DIR = path.join(ASSETS_DIR, 'generated');
const MANIFEST_PATH = path.join(ROOT, 'src/data/imageManifest.json');

// Paths relative to public/assets. Directories are scanned for jpg/jpeg/png.
const SOURCES = ['backgroundPic.jpg', 'backgroundPic2.jpg', 'landscape/', 'portrait/'];

// Sizes are defined by the long edge of the image.
const VARIANTS = [
  { name: 'thumb', longEdge: 480, quality: 70 },
  { name: '1080p', longEdge: 1920, quality: 80 },
  { name: '2k', longEdge: 2560, quality: 80 },
  { name: '4k', longEdge: 3840, quality: 82 },
];
const PLACEHOLDER_LONG_EDGE = 24;
// Bump to force regeneration of every image when encoding settings change.
const ENCODER_VERSION = 1;

const SUPPORTED_EXT = new Set(['.jpg', '.jpeg', '.png']);
const toPosix = (p) => p.split(path.sep).join('/');
const publicUrl = (absPath) => '/' + toPosix(path.relative(PUBLIC_DIR, absPath));

async function listSources() {
  const files = [];
  for (const entry of SOURCES) {
    const abs = path.join(ASSETS_DIR, entry);
    if (entry.endsWith('/')) {
      const names = await fs.readdir(abs);
      names
        .filter((n) => SUPPORTED_EXT.has(path.extname(n).toLowerCase()))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .forEach((n) => files.push(path.join(abs, n)));
    } else {
      files.push(abs);
    }
  }
  return files;
}

async function hashFile(file) {
  const buf = await fs.readFile(file);
  return createHash('sha1').update(buf).update(String(ENCODER_VERSION)).digest('hex');
}

async function fileExists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function processImage(file, key) {
  const meta = await sharp(file).metadata();
  // EXIF orientations 5-8 rotate the image by 90°, swapping width and height.
  const rotated = meta.orientation >= 5;
  const width = rotated ? meta.height : meta.width;
  const height = rotated ? meta.width : meta.height;
  const longEdge = Math.max(width, height);

  const base = () => sharp(file, { limitInputPixels: false }).rotate().withIccProfile('srgb');
  const fit = (edge) => ({ width: edge, height: edge, fit: 'inside', withoutEnlargement: true });

  const outBase = path.join(OUTPUT_DIR, key.replace(/\.[^.]+$/, ''));
  await fs.mkdir(path.dirname(outBase), { recursive: true });

  const variants = [];
  for (const v of VARIANTS) {
    // Skip variants that would not be smaller than the original (no upscaling).
    if (v.name !== 'thumb' && v.longEdge >= longEdge) continue;
    const outFile = `${outBase}-${v.name}.webp`;
    const info = await base()
      .resize(fit(v.longEdge))
      .webp({ quality: v.quality, effort: 5 })
      .toFile(outFile);
    variants.push({ name: v.name, src: publicUrl(outFile), width: info.width, height: info.height, bytes: info.size });
  }

  const stat = await fs.stat(file);
  variants.push({ name: 'original', src: publicUrl(file), width, height, bytes: stat.size });

  const placeholderBuf = await base()
    .resize(fit(PLACEHOLDER_LONG_EDGE))
    .webp({ quality: 40 })
    .toBuffer();

  return {
    width,
    height,
    placeholder: `data:image/webp;base64,${placeholderBuf.toString('base64')}`,
    variants,
  };
}

async function main() {
  const force = process.argv.includes('--force');
  let previous = {};
  if (!force && (await fileExists(MANIFEST_PATH))) {
    previous = JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf8'));
  }

  const files = await listSources();
  const manifest = {};
  let generated = 0;

  for (const file of files) {
    const key = toPosix(path.relative(ASSETS_DIR, file));
    const hash = await hashFile(file);
    const prev = previous[key];
    const upToDate =
      prev &&
      prev.hash === hash &&
      (await Promise.all(
        prev.variants
          .filter((v) => v.name !== 'original')
          .map((v) => fileExists(path.join(PUBLIC_DIR, v.src)))
      )).every(Boolean);

    if (upToDate) {
      manifest[key] = prev;
      continue;
    }

    const started = Date.now();
    manifest[key] = { hash, ...(await processImage(file, key)) };
    generated++;
    console.log(`[images] ${key} (${((Date.now() - started) / 1000).toFixed(1)}s)`);
  }

  // Remove generated files that are no longer referenced by the manifest.
  const referenced = new Set(
    Object.values(manifest).flatMap((e) => e.variants.map((v) => path.join(PUBLIC_DIR, v.src)))
  );
  const walk = async (dir) => {
    if (!(await fileExists(dir))) return;
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(abs);
      else if (!referenced.has(abs)) await fs.rm(abs);
    }
  };
  await walk(OUTPUT_DIR);

  await fs.mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`[images] ${generated} generated, ${files.length - generated} up to date`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
