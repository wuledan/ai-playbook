import { chromium } from 'playwright';
import { mkdirSync, statSync } from 'fs';
import { dirname } from 'path';

const tasks = [
  { url: 'https://github.com/microsoft/flint-chart', dir: 'flint-visualization-language-review-2026', kind: 'reviews' },
  { url: 'https://seed.bytedance.com/seedance2_5', dir: 'seedance-2-5-review-2026', kind: 'reviews' },
  { url: 'https://forum.cursor.com/t/usage-page-to-token-amount-what/167153', dir: 'cursor-cost-tracking-tutorial-2026', kind: 'tutorials' },
];

for (const { url, dir, kind } of tasks) {
  console.log(`Taking: ${url} → ${kind}/${dir}/cover.png`);
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(4000);
    const out = `public/images/${kind}/${dir}/cover.png`;
    mkdirSync(dirname(out), { recursive: true });
    await page.screenshot({ path: out, type: 'png' });
    const st = statSync(out);
    console.log(`  OK: ${(st.size/1024).toFixed(0)}KB ${st.size}`);
    await browser.close();
  } catch (e) {
    console.log(`  FAIL: ${e.message}`);
  }
}
console.log('ALL DONE');
