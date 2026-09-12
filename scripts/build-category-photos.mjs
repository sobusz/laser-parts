/**
 * Crops the downloaded Pexels originals to the 16:10 frame the offer cards use.
 *
 * `zoom` is the share of the largest possible 16:10 rectangle to keep, and
 * `focus` is the normalised point that rectangle is centred on. The Mazak shot
 * needs a tight crop because the machine it was taken on carries a visible
 * third-party brand name higher up in the frame.
 */
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "assets/pexels-kandydaci");
const dest = join(root, "client/public/photos/kategorie");
mkdirSync(dest, { recursive: true });

const ASPECT = 16 / 10;
const OUT_WIDTH = 1280;

const jobs = [
  { out: "cat-trumpf.jpg", file: "hi-39013540.jpg", focus: [0.527, 0.72], zoom: 0.3 },
  { out: "cat-bystronic.jpg", file: "hi-7254429.jpg", focus: [0.5, 0.55], zoom: 1 },
  { out: "cat-mazak.jpg", file: "hi-29988986.jpg", focus: [0.5, 0.36], zoom: 1 },
  // Cropped below the cutting head so the machine maker's name stays out of frame.
  { out: "cat-lvd.jpg", file: "hi-29988985.jpg", focus: [0.45, 0.62], zoom: 0.55 },
  { out: "cat-inne.jpg", file: "hi-29988963.jpg", focus: [0.5, 0.5], zoom: 1 },
  { out: "cat-optyka.jpg", file: "hi-9908745.jpg", focus: [0.45, 0.62], zoom: 0.8 },
];

for (const job of jobs) {
  const input = sharp(join(src, job.file));
  const { width, height } = await input.metadata();

  let rectW = width / height > ASPECT ? height * ASPECT : width;
  let rectH = rectW / ASPECT;
  rectW = Math.round(rectW * job.zoom);
  rectH = Math.round(rectH * job.zoom);

  const clamp = (v, max) => Math.max(0, Math.min(Math.round(v), max));
  const left = clamp(job.focus[0] * width - rectW / 2, width - rectW);
  const top = clamp(job.focus[1] * height - rectH / 2, height - rectH);

  await input
    .extract({ left, top, width: rectW, height: rectH })
    .resize(OUT_WIDTH, Math.round(OUT_WIDTH / ASPECT))
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(join(dest, job.out));

  console.log(`${job.out}  from ${rectW}x${rectH} at ${left},${top}`);
}
