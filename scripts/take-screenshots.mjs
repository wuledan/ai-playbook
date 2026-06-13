import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'public/images/reviews';
const VIEWPORT = { width: 1920, height: 1080 };

const tasks = [
  {
    dir: 'lovable-dev-review-2026',
    shots: [
      { name: 'lovable-homepage.png', url: 'https://lovable.dev' },
      { name: 'lovable-pricing.png', url: 'https://lovable.dev/pricing' },
    ]
  },
  {
    dir: 'google-veo-2-review-2026',
    shots: [
      { name: 'veo2-interface.png', url: 'https://deepmind.google/technologies/veo/' },
      { name: 'veo2-features.png', url: 'https://labs.google/fx/tools/video-fx' },
    ]
  },
  {
    dir: 'midjourney-v7-review-2026',
    shots: [
      { name: 'midjourney-homepage.png', url: 'https://www.midjourney.com' },
    ]
  }
];

const browser = await chromium.connectOverCDP('ws://127.0.0.1:9222/devtools/browser/5ad16f63-50db-445c-bdf1-bc52411adcfc');
const ctx = browser.contexts()[0];

for (const task of tasks) {
  mkdirSync(`${BASE}/${task.dir}`, { recursive: true });
  for (const shot of task.shots) {
    const page = await ctx.newPage();
    await page.setViewportSize(VIEWPORT);
    try {
      await page.goto(shot.url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);
      await page.screenshot({ path: `${BASE}/${task.dir}/${shot.name}`, fullPage: false });
      console.log(`✓ ${shot.name}`);
    } catch (e) {
      console.log(`✗ ${shot.name}: ${e.message}`);
      try {
        await page.screenshot({ path: `${BASE}/${task.dir}/${shot.name}`, fullPage: false });
        console.log(`  ⚠ partial capture`);
      } catch(e2) { console.log(`  ✗ no capture: ${e2.message}`); }
    }
    await page.close();
  }
}

await browser.close();
console.log('Done!');
