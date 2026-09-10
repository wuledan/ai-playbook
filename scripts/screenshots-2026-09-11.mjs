import { chromium } from 'playwright';
import { mkdirSync, statSync } from 'fs';
import { dirname } from 'path';

const tasks = [
  // cover images (GitHub repo pages)
  { url: 'https://github.com/okf-memory/okf-agent-memory', dir: 'reviews/okf-agent-memory-review-2026', fname: 'cover.png', wait: 15000 },
  { url: 'https://github.com/Atomburstofficial/geiger', dir: 'reviews/geiger-review-2026', fname: 'cover.png', wait: 15000 },
  { url: 'https://github.com/browser-use/browser-use-pi', dir: 'reviews/browser-use-pi-review-2026', fname: 'cover.png', wait: 15000 },
  // secondary real screenshots
  { url: 'https://okf-memory.dev', dir: 'reviews/okf-agent-memory-review-2026', fname: 'homepage.png', wait: 12000 },
  { url: 'https://atomburst.io/geiger', dir: 'reviews/geiger-review-2026', fname: 'report.png', wait: 12000 },
  { url: 'https://browser-use.com', dir: 'reviews/browser-use-pi-review-2026', fname: 'homepage.png', wait: 12000 },
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
