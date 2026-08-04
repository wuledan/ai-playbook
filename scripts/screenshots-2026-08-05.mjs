import { chromium } from 'playwright';
import { mkdirSync, statSync } from 'fs';
import { dirname } from 'path';

const tasks = [
  { url: 'https://github.com/ryanzhou/deepseek-v4-flash-mi300x', dir: 'deepseek-v4-flash-mi300x-review-2026', kind: 'reviews' },
  { url: 'https://mistral.ai/news/shieldstral/', dir: 'shieldstral-review-2026', kind: 'reviews' },
  { url: 'https://www.warp.dev/blog/introducing-the-warp-agent-cli-coding-agent', dir: 'warp-agent-cli-review-2026', kind: 'reviews' },
];

for (const { url, dir, kind } of tasks) {
  console.log(`Taking: ${url} → ${kind}/${dir}/cover.png`);
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(6000);
    const out = `public/images/${kind}/${dir}/cover.png`;
    mkdirSync(dirname(out), { recursive: true });
    await page.screenshot({ path: out, type: 'png' });
    const st = statSync(out);
    console.log(`  OK: ${(st.size/1024).toFixed(0)}KB`);
    await browser.close();
  } catch (e) {
    console.log(`  FAIL: ${e.message}`);
  }
}
console.log('ALL DONE');
