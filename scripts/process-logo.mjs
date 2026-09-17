import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function processLogo() {
  const inputPath = 'C:/Users/Dynamo/.gemini/antigravity-ide/brain/02ba59f6-d34f-4a9d-b509-5c12e29fb2c5/.user_uploaded/media_1789671879039.jpg';
  const outDir = path.resolve('public/brand');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const { data, info } = await sharp(inputPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels; // 3 for RGB

  console.log(`Input image: ${width}x${height}, channels: ${channels}`);

  // Buffers for light and dark versions (RGBA)
  const lightBuf = Buffer.alloc(width * height * 4);
  const darkBuf = Buffer.alloc(width * height * 4);

  let minX = width, maxX = 0, minY = height, maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const outIdx = (y * width + x) * 4;

      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Calculate brightness / distance from white (255, 255, 255)
      // A pixel is white background if r, g, b are all close to 255
      // To preserve smooth anti-aliased edges:
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      
      // Check if pixel is part of the red stroke or black text
      // Red stroke has high R, low G, low B: e.g. R > 150 and R > G + 40 and R > B + 40
      const isRed = (r > 120 && r > g * 1.35 && r > b * 1.35);

      let alpha = 0;
      if (luminance < 250 || isRed) {
        // Pixel is not pure white
        // Alpha calculation: the darker it is (or the more saturated red), the higher alpha
        if (isRed) {
          // Red stroke: calculate alpha based on green/blue suppression compared to 255
          const whiteDist = 255 - Math.min(g, b);
          alpha = Math.min(255, Math.max(0, Math.round(whiteDist * 1.15)));
        } else {
          // Black / grayscale text
          alpha = Math.min(255, Math.max(0, Math.round((255 - luminance) * 1.12)));
        }

        if (alpha > 8) {
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }

      // Light mode output:
      if (isRed) {
        lightBuf[outIdx] = r;
        lightBuf[outIdx + 1] = g;
        lightBuf[outIdx + 2] = b;
        lightBuf[outIdx + 3] = alpha;
      } else {
        // Black text: keep black (0, 0, 0) with calculated alpha
        lightBuf[outIdx] = 15;
        lightBuf[outIdx + 1] = 23;
        lightBuf[outIdx + 2] = 42; // sleek dark slate
        lightBuf[outIdx + 3] = alpha;
      }

      // Dark mode output:
      if (isRed) {
        // Boost vibrancy for dark mode
        darkBuf[outIdx] = Math.min(255, Math.round(r * 1.1));
        darkBuf[outIdx + 1] = g;
        darkBuf[outIdx + 2] = b;
        darkBuf[outIdx + 3] = alpha;
      } else {
        // White / soft silver text on dark
        darkBuf[outIdx] = 248;
        darkBuf[outIdx + 1] = 250;
        darkBuf[outIdx + 2] = 252; // slate-50
        darkBuf[outIdx + 3] = alpha;
      }
    }
  }

  console.log(`Bounding box: x: [${minX}, ${maxX}], y: [${minY}, ${maxY}]`);
  const cropWidth = maxX - minX + 16;
  const cropHeight = maxY - minY + 16;
  const cropLeft = Math.max(0, minX - 8);
  const cropTop = Math.max(0, minY - 8);

  // Save light mode PNG
  await sharp(lightBuf, { raw: { width, height, channels: 4 } })
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(outDir, 'partner-in-crime-light.png'));

  // Save dark mode PNG
  await sharp(darkBuf, { raw: { width, height, channels: 4 } })
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(outDir, 'partner-in-crime-dark.png'));

  console.log('Successfully generated transparent light & dark logo PNGs in public/brand/');
}

processLogo().catch(console.error);
