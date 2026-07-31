import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceDirectory = path.resolve("images");
const outputDirectory = path.resolve(".cache/generated/images");
const cacheFile = path.resolve(".cache/images.json");
const widths = [360, 720, 1200];

const slugify = (filename) => filename
  .replace(/\.[^.]+$/, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

await rm(path.resolve(".cache/generated"), { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

const files = (await readdir(sourceDirectory))
  .filter((filename) => /\.(gif|jpe?g|png)$/i.test(filename))
  .sort((a, b) => a.localeCompare(b));

const catalog = [];
for (const filename of files) {
  const input = path.join(sourceDirectory, filename);
  const metadata = await sharp(input, { animated: false }).metadata();
  const sourceWidth = metadata.width || 1;
  const sourceHeight = metadata.height || 1;
  const generatedWidths = [...new Set(widths.map((width) => Math.min(width, sourceWidth)))];
  const outputs = [];

  for (const width of generatedWidths) {
    const height = Math.max(1, Math.round(sourceHeight * width / sourceWidth));
    const basename = `${slugify(filename)}--${width}`;
    const jpegPath = path.join(outputDirectory, `${basename}.jpg`);
    const webpPath = path.join(outputDirectory, `${basename}.webp`);
    const resized = sharp(input, { animated: false }).resize({ width, withoutEnlargement: true });
    await Promise.all([
      resized.clone().flatten({ background: "#f4efe5" }).jpeg({ quality: 82, mozjpeg: true }).toFile(jpegPath),
      resized.clone().webp({ quality: 80 }).toFile(webpPath),
    ]);
    outputs.push({
      width,
      height,
      jpeg: `/generated/images/${basename}.jpg`,
      webp: `/generated/images/${basename}.webp`,
    });
  }

  catalog.push({
    filename,
    source: `/images/${encodeURIComponent(filename)}`,
    width: sourceWidth,
    height: sourceHeight,
    format: metadata.format,
    outputs,
  });
}

const bicycle = path.join(sourceDirectory, "Gustave_and_Nhar_2_colorized.jpg");
const textSvg = Buffer.from(`
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#f4efe5"/>
  <text x="665" y="250" fill="#201f1c" font-family="Georgia, serif" font-size="68">
    <tspan x="665" dy="0">Harrington</tspan>
    <tspan x="665" dy="84">&amp; Kauffman</tspan>
  </text>
  <line x1="665" y1="390" x2="1120" y2="378" stroke="#201f1c" stroke-width="5"/>
  <text x="665" y="448" fill="#201f1c" font-family="Arial, sans-serif" font-size="28">COMEDY THEATER</text>
</svg>`);
const portrait = await sharp(bicycle)
  .resize(600, 630, { fit: "cover", position: "center" })
  .toBuffer();
await sharp(textSvg)
  .composite([{ input: portrait, left: 0, top: 0 }])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(path.resolve(".cache/generated/social-default.jpg"));

await mkdir(path.dirname(cacheFile), { recursive: true });
await writeFile(cacheFile, JSON.stringify(catalog, null, 2) + "\n");
console.log(`Generated responsive derivatives for ${catalog.length} originals.`);
