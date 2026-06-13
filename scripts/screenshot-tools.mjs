import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = '/Users/wuledan/.openclaw/workspace/content-operator-aitools/public/images/reviews';
const VIEWPORT = { width: 1920, height: 1080 };

const tools = [
  {
    name: 'lovable-dev-review-2026',
    urls: [
      { file: 'lovable-homepage.png', url: 'https://lovable.dev' },
      { file: 'lovable-pricing.png', url: 'https://lovable.dev/pricing' },
    ]
  },
  {
    name: 'google-veo-2-review-2026',
    urls: [
      { file: 'veo2-interface.png', url: 'https://labs.google/fx/tools/video-fx' },
      { file: 'veo2-features.png', url: 'https://deepmind.google/technologies/veo/' },
    ]
  },
  {
    name: 'midjourney-v7-review-2026',
    urls: [
      { file: 'midjourney-homepage.png', url: 'https://www.midjourney.com' },
      { file: 'midjourney-pricing.png', url: 'https://docs.midjourney.com/docs/plans' },
    ]
  }
];

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');

for (const tool of tools) {
  const dir = `${BASE}/${tool.name}`;
  mkdirSync(dir, { recursive: true });
  
  const context = browser.contexts()[0];
  
  for (const { file, url } of tool.urls) {
    console.log(`Taking screenshot: ${url} -> ${dir}/${file}`);
    const page = await context.newPage();
    await page.setViewportSize(VIEWPORT);
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);
      await page.screenshot({ path: `${dir}/${file}`, fullPage: false });
      console.log(`  ✓ Saved: ${file}`);
    } catch (err) {
      console.log(`  ✗ Failed: ${url} - ${err.message}`);
      // Take what we can
      const currentUrl = page.url();
      if (currentUrl !== 'about:blank') {
        await page.screenshot({ path: `${dir}/${file}`, fullPage: false });
        console.log(`  ⚠ Partial capture: ${file}`);
      }
    }
    await page.close();
  }
}

await browser.close();
console.log('Done!');
