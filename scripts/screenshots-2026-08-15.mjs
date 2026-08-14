import { chromium } from 'playwright';
import { mkdirSync, statSync } from 'fs';
import { dirname } from 'path';

const tasks = [
  { url: 'https://z.ai/blog/glm-5.3', dir: 'glm-53-review-2026', kind: 'reviews', wait: 18000 },
  { url: 'https://huggingface.co/Qwen/Qwen3.8-27B-FP8', dir: 'qwen38-27b-review-2026', kind: 'reviews', wait: 15000 },
  { url: 'https://www.mixedbread.com/blog/toast-1', dir: 'toast-1-review-2026', kind: 'reviews', wait: 15000 },
];

for (const { url, dir, kind, wait } of tasks) {
  console.log(`Taking: ${url} → ${kind}/${dir}/cover.png`);
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
      const out = `public/images/${kind}/${dir}/cover.png`;
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
