import { chromium } from 'playwright';
import { mkdirSync, statSync } from 'fs';
import { dirname } from 'path';

const tasks = [
  { url: 'https://platform.claude.com/docs/en/release-notes/system-prompts', dir: 'claude-system-prompts-audit-workflow-2026', kind: 'workflows', wait: 14000 },
  { url: 'https://openrouter.ai/', dir: 'openrouter-after-stripe-comparison-2026', kind: 'comparisons', wait: 14000 },
  { url: 'https://stripe.com/newsroom/news/openrouter-and-stripe', dir: 'openrouter-after-stripe-comparison-2026', kind: 'comparisons', wait: 14000, extra: 'stripe-announcement.png' },
  { url: 'https://github.com/math-ai-org/mathcode', dir: 'mathcode-review-2026', kind: 'reviews', wait: 12000 },
  { url: 'https://math-ai-org.github.io/mathcode/', dir: 'mathcode-review-2026', kind: 'reviews', wait: 12000, extra: 'project-page.png' },
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
