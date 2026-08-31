import { chromium } from 'playwright';
import { mkdirSync, statSync } from 'fs';
import { dirname } from 'path';

const tasks = [
  { url: 'https://github.com/cbrock84/headcount', dir: 'headcount-review-2026', kind: 'reviews', wait: 15000 },
  { url: 'https://github.com/JordyZomer/lemmalog', dir: 'lemmalog-review-2026', kind: 'reviews', wait: 15000 },
  { url: 'https://github.com/useagenthq/useagent', dir: 'useagent-review-2026', kind: 'reviews', wait: 15000 },
];

for (const { url, dir, kind, wait } of tasks) {
  const fname = 'cover.png';
  console.log(`Taking: ${url} → ${kind}/${dir}/${fname}`);
  let ok = false;
  for (const proxy of ['socks5://127.0.0.1:7897', null]) {
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
      const out = `public/images/${kind}/${dir}/${fname}`;
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
