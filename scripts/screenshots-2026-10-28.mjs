import { chromium } from 'playwright';
import { mkdirSync, statSync } from 'fs';
import { dirname } from 'path';

const tasks = [
  // earshot
  { url: 'https://github.com/Leonxlnx/earshot', dir: 'reviews/earshot-review-2026', fname: 'cover.png', wait: 15000, scroll: 0 },
  { url: 'https://github.com/Leonxlnx/earshot', dir: 'reviews/earshot-review-2026', fname: 'cli-commands.png', wait: 12000, scroll: 2600 },
  { url: 'https://github.com/Leonxlnx/earshot/blob/main/docs/VALIDATION.md', dir: 'reviews/earshot-review-2026', fname: 'validation.png', wait: 12000, scroll: 200 },
  // git-ai
  { url: 'https://github.com/feder-cr/git-ai', dir: 'reviews/git-ai-review-2026', fname: 'cover.png', wait: 15000, scroll: 0 },
  { url: 'https://github.com/feder-cr/git-ai/blob/main/doc/graft/LIMITATIONS.md', dir: 'reviews/git-ai-review-2026', fname: 'limitations.png', wait: 12000, scroll: 100 },
  { url: 'https://github.com/feder-cr/git-ai/blob/main/doc/graft/BENCH.md', dir: 'reviews/git-ai-review-2026', fname: 'benchmark.png', wait: 12000, scroll: 600 },
  // esp32 iphone agent
  { url: 'https://github.com/onehumanbeing/esp32-iphone-agent', dir: 'reviews/esp32-iphone-agent-review-2026', fname: 'cover.png', wait: 15000, scroll: 0 },
  { url: 'https://github.com/onehumanbeing/esp32-iphone-agent', dir: 'reviews/esp32-iphone-agent-review-2026', fname: 'how-it-works.png', wait: 12000, scroll: 2100 },
  { url: 'https://handsy.tech', dir: 'reviews/esp32-iphone-agent-review-2026', fname: 'project-site.png', wait: 12000, scroll: 0 },
];

for (const { url, dir, fname, wait, scroll } of tasks) {
  console.log(`Taking: ${url} -> ${dir}/${fname}`);
  let ok = false;
  for (const proxy of [null, 'socks5://127.0.0.1:7897']) {
    if (ok) break;
    let browser;
    try {
      browser = await chromium.launch({ headless: true, ...(proxy ? { proxy: { server: proxy } } : {}) });
      const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await page.waitForTimeout(wait);
      if (scroll) { await page.evaluate((y) => window.scrollTo(0, y), scroll); await page.waitForTimeout(2500); }
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
  if (!ok) console.log(`  FAILED: ${url}`);
}
console.log('ALL DONE');
