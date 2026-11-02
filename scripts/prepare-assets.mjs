#!/usr/bin/env node
/**
 * Asset pipeline: numbered source images -> optimized, trimmed, transparent shoes.
 *
 *   npm run assets            incremental (skips unchanged inputs)
 *   npm run assets -- --force rebuild everything
 *
 * Reads `Assets/` (or `assets/`) in the project root, expects files named 1, 2, 3 ...
 * with any of png/jpg/jpeg/webp/avif extensions. Writes:
 *   public/shoes/shoe-<n>-<width>.{avif,webp,png}
 *   src/data/generated/shoes.assets.json   (sizes, blur placeholder, colors, suggested palette)
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "shoes");
const JSON_OUT = path.join(ROOT, "src", "data", "generated", "shoes.assets.json");
const OVERRIDES_FILE = path.join(ROOT, "scripts", "asset-overrides.json");
const SCRIPT_VERSION = "4";
const WIDTHS = [480, 960, 1440];
const FORCE = process.argv.includes("--force");
const EXT_RE = /^(\d+)\.(png|jpe?g|webp|avif)$/i;

const log = (...a) => console.log("[assets]", ...a);

// ---------- helpers ----------
const hex = (r, g, b) =>
  "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
const parseHex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lin = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const luminance = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

function findSourceDir() {
  for (const name of readdirSync(ROOT)) {
    if (name.toLowerCase() === "assets" && existsSync(path.join(ROOT, name, "."))) {
      return path.join(ROOT, name);
    }
  }
  throw new Error("No Assets/ (or assets/) folder found in the project root.");
}

function listSources(dir) {
  return readdirSync(dir)
    .map((file) => ({ file, m: EXT_RE.exec(file) }))
    .filter((x) => x.m)
    .map((x) => ({ file: x.file, id: Number(x.m[1]) }))
    .sort((a, b) => a.id - b.id); // numeric: 1, 2, ... 10, 11
}

// ---------- background handling ----------
/** Returns { data (RGBA raw), width, height, hadAlpha, bgRemoved } */
async function loadRgba(file) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

function transparentRatio(data) {
  let n = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] < 250) n++;
  return n / (data.length / 4);
}

/** Remove a flat (white / solid) background connected to the image border. */
function removeFlatBackground(data, w, h) {
  const px = (x, y) => (y * w + x) * 4;
  const corners = [px(0, 0), px(w - 1, 0), px(0, h - 1), px(w - 1, h - 1)].map((i) => [
    data[i],
    data[i + 1],
    data[i + 2],
  ]);
  const bg = [0, 1, 2].map((c) => corners.map((p) => p[c]).sort((a, b) => a - b)[2]);
  const spread = Math.max(
    ...corners.map((p) => Math.hypot(p[0] - bg[0], p[1] - bg[1], p[2] - bg[2])),
  );
  if (spread > 30) return false; // corners disagree: not a flat backdrop, leave alone
  const tol = 22;
  const isBg = (i) => Math.hypot(data[i] - bg[0], data[i + 1] - bg[1], data[i + 2] - bg[2]) <= tol;
  const seen = new Uint8Array(w * h);
  const stack = [];
  const push = (x, y) => {
    const k = y * w + x;
    if (!seen[k] && isBg(k * 4)) {
      seen[k] = 1;
      stack.push(k);
    }
  };
  for (let x = 0; x < w; x++) (push(x, 0), push(x, h - 1));
  for (let y = 0; y < h; y++) (push(0, y), push(w - 1, y));
  while (stack.length) {
    const k = stack.pop();
    const x = k % w;
    const y = (k / w) | 0;
    if (x > 0) push(x - 1, y);
    if (x < w - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < h - 1) push(x, y + 1);
  }
  const alpha = Buffer.alloc(w * h);
  for (let k = 0; k < alpha.length; k++) alpha[k] = seen[k] ? 0 : 255;
  return alpha;
}

/** Gaussian blur of a 1-channel mask, returned as a 1-channel buffer. */
async function blurMask(mask, w, h, sigma) {
  return sharp(mask, { raw: { width: w, height: h, channels: 1 } })
    .blur(sigma)
    .extractChannel(0)
    .raw()
    .toBuffer();
}

const cut = (buf, at) => {
  const out = Buffer.allocUnsafe(buf.length);
  for (let i = 0; i < buf.length; i++) out[i] = buf[i] >= at ? 255 : 0;
  return out;
};

/** Soft, slightly choked edge so no light halo remains after background removal. */
async function softenAlpha(alpha, w, h) {
  return blurMask(cut(await blurMask(alpha, w, h, 1.2), 150), w, h, 0.7);
}

/** Drop thin features (hanging threads) from the alpha mask without growing the silhouette. */
async function despeckleAlpha(alpha, w, h, sigma = 2.6) {
  const opened = await blurMask(cut(await blurMask(alpha, w, h, sigma), 128), w, h, 0.6);
  const out = Buffer.alloc(alpha.length);
  for (let i = 0; i < out.length; i++) out[i] = Math.min(alpha[i], opened[i]);
  return out;
}

function alphaBounds(data, w, h, threshold = 8) {
  let x0 = w,
    y0 = h,
    x1 = -1,
    y1 = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > threshold) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) throw new Error("image is fully transparent");
  return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}

// ---------- colors ----------
function extractColors(data, w, h) {
  const step = Math.max(1, Math.floor(Math.max(w, h) / 220));
  const buckets = new Map();
  let sr = 0,
    sg = 0,
    sb = 0,
    count = 0;
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const i = (y * w + x) * 4;
      if (data[i + 3] < 220) continue;
      const r = data[i],
        g = data[i + 1],
        b = data[i + 2];
      sr += r;
      sg += g;
      sb += b;
      count++;
      const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
      const e = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
      e.n++;
      e.r += r;
      e.g += g;
      e.b += b;
      buckets.set(key, e);
    }
  }
  const list = [...buckets.values()]
    .map((e) => ({ n: e.n, rgb: [e.r / e.n, e.g / e.n, e.b / e.n] }))
    .sort((a, b) => b.n - a.n);
  const dominant = list[0].rgb;
  const secondary =
    list.find((c) => c.n > count * 0.02 && Math.hypot(...c.rgb.map((v, i) => v - dominant[i])) > 70)
      ?.rgb ??
    list.find((c) => Math.hypot(...c.rgb.map((v, i) => v - dominant[i])) > 40)?.rgb ??
    mix(dominant, [255, 255, 255], 0.5);
  return {
    dominant: hex(...dominant),
    secondary: hex(...secondary),
    average: hex(sr / count, sg / count, sb / count),
  };
}

/** Auto palette: a starting point for new images. Hand-tuned values live in src/data/palettes.ts. */
function suggestPalette({ dominant, secondary }) {
  const WHITE = [255, 255, 255],
    INK = [14, 14, 14];
  let bg = parseHex(dominant);
  const lum = luminance(bg);
  // keep the stage readable: avoid mid-grey slush by pushing extreme tones outward
  if (lum < 0.02) bg = mix(bg, WHITE, 0.12);
  const text = contrast(bg, WHITE) >= contrast(bg, INK) ? WHITE : INK;
  const bgDark = mix(bg, [0, 0, 0], 0.45);
  let accent = parseHex(secondary);
  const towards = text === WHITE ? WHITE : INK;
  for (let t = 0; contrast(accent, bg) < 3 && t <= 1; t += 0.05)
    accent = mix(parseHex(secondary), towards, t);
  return { bg: hex(...bg), bgDark: hex(...bgDark), accent: hex(...accent), text: hex(...text) };
}

// ---------- main ----------
async function processShoe({ file, id }, srcDir, override) {
  const abs = path.join(srcDir, file);
  const { data, width: w0, height: h0 } = await loadRgba(abs);
  const hadAlpha = transparentRatio(data) > 0.02;
  let bgRemoved = false;

  let alpha = null;
  if (!hadAlpha) {
    alpha = removeFlatBackground(data, w0, h0);
    bgRemoved = Boolean(alpha);
    if (alpha) alpha = await softenAlpha(alpha, w0, h0);
  }
  if (override.despeckle) {
    const base = alpha ?? Buffer.from(data.filter((_, i) => i % 4 === 3));
    alpha = await despeckleAlpha(
      base,
      w0,
      h0,
      override.despeckle === true ? undefined : override.despeckle,
    );
  }
  if (alpha) for (let k = 0; k < alpha.length; k++) data[k * 4 + 3] = alpha[k];
  // clear colour under fully transparent pixels so edges never bleed dark/white fringes
  for (let i = 0; i < data.length; i += 4)
    if (data[i + 3] < 3) data[i] = data[i + 1] = data[i + 2] = data[i + 3] = 0;

  const box = alphaBounds(data, w0, h0);
  const trimmed = await sharp(data, { raw: { width: w0, height: h0, channels: 4 } })
    .extract(box)
    .png()
    .toBuffer();
  const rawTrim = await sharp(trimmed).raw().toBuffer({ resolveWithObject: true });
  const colors = extractColors(rawTrim.data, rawTrim.info.width, rawTrim.info.height);

  const native = box.width;
  const targets = [
    ...new Set([...WIDTHS.filter((v) => v < native), Math.min(native, WIDTHS.at(-1))]),
  ].sort((a, b) => a - b);
  const sizes = [];
  for (const tw of targets) {
    const img = sharp(trimmed).resize({ width: tw, withoutEnlargement: true });
    const meta = await img.clone().png().toBuffer({ resolveWithObject: true });
    const base = path.join(OUT_DIR, `shoe-${id}-${tw}`);
    await Promise.all([
      img.clone().avif({ quality: 58, effort: 5 }).toFile(`${base}.avif`),
      img.clone().webp({ quality: 82, alphaQuality: 92, effort: 5 }).toFile(`${base}.webp`),
      img
        .clone()
        .png({ palette: true, quality: 88, effort: 7, compressionLevel: 9 })
        .toFile(`${base}.png`),
    ]);
    sizes.push({ w: meta.info.width, h: meta.info.height });
  }
  const blurBuf = await sharp(trimmed)
    .resize({ width: 24 })
    .blur(1.2)
    .webp({ quality: 40 })
    .toBuffer();

  return {
    id,
    source: file,
    width: sizes.at(-1).w,
    height: sizes.at(-1).h,
    aspect: +(sizes.at(-1).w / sizes.at(-1).h).toFixed(4),
    widths: sizes.map((s) => s.w),
    blur: `data:image/webp;base64,${blurBuf.toString("base64")}`,
    colors,
    suggestedPalette: suggestPalette(colors),
    hadAlpha,
    bgRemoved,
  };
}

async function main() {
  const srcDir = findSourceDir();
  const sources = listSources(srcDir);
  if (!sources.length) throw new Error(`No numbered images found in ${srcDir}`);
  log(`source: ${path.relative(ROOT, srcDir)}/ -> ${sources.map((s) => s.file).join(", ")}`);

  const overrides = existsSync(OVERRIDES_FILE)
    ? JSON.parse(readFileSync(OVERRIDES_FILE, "utf8"))
    : {};
  const previous = existsSync(JSON_OUT)
    ? JSON.parse(readFileSync(JSON_OUT, "utf8"))
    : { shoes: [] };
  const prevById = new Map(previous.shoes.map((s) => [s.id, s]));

  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(path.dirname(JSON_OUT), { recursive: true });

  const shoes = [];
  for (const src of sources) {
    const override = overrides[src.id] ?? {};
    const hash = createHash("sha1")
      .update(readFileSync(path.join(srcDir, src.file)))
      .update(JSON.stringify(override))
      .update(SCRIPT_VERSION)
      .digest("hex")
      .slice(0, 16);
    const cached = prevById.get(src.id);
    const outputsExist = cached?.widths?.every((w) =>
      ["avif", "webp", "png"].every((e) =>
        existsSync(path.join(OUT_DIR, `shoe-${src.id}-${w}.${e}`)),
      ),
    );
    if (!FORCE && cached?.hash === hash && outputsExist) {
      log(`#${src.id} unchanged`);
      shoes.push(cached);
      continue;
    }
    const entry = { ...(await processShoe(src, srcDir, override)), hash };
    log(
      `#${src.id} ${src.file} -> ${entry.width}x${entry.height} ` +
        `(alpha:${entry.hadAlpha ? "native" : entry.bgRemoved ? "bg removed" : "none"}) ` +
        `${entry.colors.dominant}/${entry.colors.secondary}`,
    );
    shoes.push(entry);
  }

  // drop outputs of images that no longer exist
  const keep = new Set(shoes.map((s) => s.id));
  for (const f of readdirSync(OUT_DIR)) {
    const m = /^shoe-(\d+)-/.exec(f);
    if (m && !keep.has(Number(m[1]))) rmSync(path.join(OUT_DIR, f));
  }

  writeFileSync(JSON_OUT, JSON.stringify({ version: 1, shoes }, null, 2) + "\n");
  log(`wrote ${path.relative(ROOT, JSON_OUT)} (${shoes.length} shoes)`);
}

main().catch((err) => {
  console.error("[assets] failed:", err);
  process.exit(1);
});
