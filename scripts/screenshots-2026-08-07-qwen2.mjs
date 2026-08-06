import { chromium } from 'playwright';
import { mkdirSync, statSync } from 'fs';
import { dirname } from 'path';

const dir = 'public/images/reviews/qwen38-max-review-2026';
mkdirSync(dir, { recursive: true });

const tasks = [
  { url: 'https://qwen.ai/blog?id=qwen3.8', out: `${dir}/cover.png` },
  { url: 'https://www.qwencloud.com/models/qwen3.8-max', out: `${dir}/pricing.png` },
];

for (const { url, out } of tasks) {
  console.log(`Taking: ${url}`);
  try {
    const browser = await chromium.launch({
      headless: true,
      proxy: { server: 'socks5://127.0.0.1:7897' },
    });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(7000);
    await page.screenshot({ path: out, type: 'png' });
    const st = statSync(out);
    console.log(`  OK: ${(st.size/1024).toFixed(0)}KB`);
    await browser.close();
  } catch (e) {
    console.log(`  FAIL: ${e.message}`);
  }
}
console.log('ALL DONE');
