import { chromium } from 'playwright';
import { mkdirSync, statSync } from 'fs';
import { dirname } from 'path';

const tasks = [
  { url: 'https://github.com/lajosdeme/mole', dir: 'mole-deep-research-review-2026', kind: 'reviews', wait: 12000 },
  { url: 'https://www.netlify.com/blog/one-prompt-11-models-very-different-results/', dir: 'netlify-11-models-comparison-2026', kind: 'comparisons', wait: 15000 },
  { url: 'https://blog.google/security/how-google-is-making-private-ai-practical-with-homomorphic-encryption/', dir: 'google-heir-private-ai-workflow-2026', kind: 'workflows', wait: 15000 },
  { url: 'https://github.com/google/heir', dir: 'google-heir-private-ai-workflow-2026', kind: 'workflows', wait: 12000, extra: 'github-heir.png' },
  { url: 'https://github.com/lajosdeme/mole', dir: 'mole-deep-research-review-2026', kind: 'reviews', wait: 12000, extra: 'github.png' },
];

for (const { url, dir, kind, wait, extra } of tasks) {
  const fname = extra || 'cover.png';
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
