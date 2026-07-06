import { chromium } from 'playwright';
import { mkdirSync, statSync } from 'fs';
import { dirname } from 'path';

const base = 'public/images/reviews';

const tasks = [
  { url: 'https://github.com/elder-plinius/T3MP3ST', dir: 't3mp3st-review-2026' },
  { url: 'https://github.com/Kulaxyz/self-learning-skills', dir: 'self-learning-skills-review-2026' },
  { url: 'https://github.com/lycorp-jp/sim-use', dir: 'sim-use-review-2026' },
];

for (const { url, dir } of tasks) {
  console.log(`Taking: ${url} → ${dir}/cover.png`);
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    const out = `${base}/${dir}/cover.png`;
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
