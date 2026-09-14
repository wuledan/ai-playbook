import { chromium } from 'playwright';
import { mkdirSync, statSync } from 'fs';
import { dirname } from 'path';

const tasks = [
  // covers (GitHub repo pages)
  { url: 'https://github.com/NVlabs/SoL-Pi', dir: 'reviews/sol-pi-review-2026', fname: 'cover.png', wait: 15000 },
  { url: 'https://github.com/crwdla/tokentab', dir: 'reviews/tokentab-review-2026', fname: 'cover.png', wait: 15000 },
  { url: 'https://github.com/Vincentwei1021/anything2explainer', dir: 'reviews/anything2explainer-review-2026', fname: 'cover.png', wait: 15000 },
  // secondary real pages
  { url: 'https://nvlabs.github.io/SoL-Pi/', dir: 'reviews/sol-pi-review-2026', fname: 'blog.png', wait: 14000 },
  { url: 'https://github.com/crwdla/tokentab/blob/main/tokentab/pricing/prices.py', dir: 'reviews/tokentab-review-2026', fname: 'pricing.png', wait: 12000 },
  { url: 'https://github.com/Vincentwei1021/anything2explainer/blob/main/SKILL.md', dir: 'reviews/anything2explainer-review-2026', fname: 'skill.png', wait: 12000 },
];

for (const { url, dir, fname, wait } of tasks) {
  console.log(`Taking: ${url} → ${dir}/${fname}`);
  let ok = false;
  for (const proxy of [null, 'socks5://127.0.0.1:7897']) {
    if (ok) break;
    let browser;
    try {
      browser = await chromium.launch({
        headless: true,
        ...(proxy ? { proxy: { server: proxy } } : {}),
      });
      const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await page.waitForTimeout(wait);
      const out = `public/images/${dir}/${fname}`;
      mkdirSync(dirname(out), { recursive: true });
      await page.screenshot({ path: out, type: 'png' });
      const st = statSync(out);
      console.log(`  OK${proxy ? ' (proxy)' : ' (direct)'}: ${(st.size / 1024).toFixed(0)}KB`);
      await browser.close();
      ok = true;
    } catch (e) {
      console.log(`  ${proxy ? 'proxy' : 'direct'} FAIL: ${e.message.split('\n')[0]}`);
      try { await browser?.close(); } catch {}
    }
  }
  if (!ok) console.log(`  ❌ ALL FAILED: ${url}`);
}
console.log('ALL DONE');
