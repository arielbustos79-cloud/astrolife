import sharp from "sharp";
import { mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, "../public/icons");
mkdirSync(outDir, { recursive: true });

const svgBase = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="SIZE" height="SIZE">
  <rect width="100" height="100" fill="#100A1A"/>
  <path d="M50 10 L55 45 L90 50 L55 55 L50 90 L45 55 L10 50 L45 45 Z" fill="#C8A96E"/>
  <circle cx="50" cy="50" r="5" fill="#7B6FA0"/>
</svg>`;

for (const size of [192, 512]) {
  const svg = svgBase.replaceAll("SIZE", String(size));
  await sharp(Buffer.from(svg))
    .png()
    .toFile(resolve(outDir, `icon-${size}.png`));
  console.log(`✓ icon-${size}.png`);
}
