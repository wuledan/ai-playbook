import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const OUTPUT = 'public/images/reviews';
const VIEWPORT = { width: 1280, height: 800 };

const shots = [
  {
    url: 'https://artificialanalysis.ai/models/glm-5-2',
    file: `${OUTPUT}/glm-5-2-review-2026/cover.png`,
    wait: 4000,
  },
  {
    url: 'https://github.com/shadcn/improve',
    file: `${OUTPUT}/shadcn-improve-review-2026/cover.png`,
    wait: 3000,
  },
  {
    url: 'https://github.com/omnigent-ai/omnigent',
    file: `${OUTPUT}/omnigent-review-2026/cover.png`,
    wait: 3000,
  },
];

const browser = await chromium.launch({ headless: true });

for (const shot of shots) {
  console.log(`📸 Capturing ${shot.url}...`);
  const page = await browser.newPage();
  await page.setViewportSize(VIEWPORT);
  await page.goto(shot.url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(shot.wait);
  mkdirSync(new URL('.', new URL(shot.file, import.meta.url)).pathname, { recursive: true });
  await page.screenshot({ path: shot.file, fullPage: false });
  console.log(`  ✅ Saved to ${shot.file}`);
  await page.close();
}

await browser.close();
console.log('🎉 All screenshots captured!');
