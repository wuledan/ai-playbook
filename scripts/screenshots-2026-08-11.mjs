import { chromium } from 'playwright';
import { mkdirSync, statSync } from 'fs';
import { dirname } from 'path';

const tasks = [
  { url: 'https://research.meta.ai/blog/introducing-muse-glimmer-open-agentic-model', dir: 'muse-glimmer-review-2026', kind: 'reviews' },
  { url: 'https://bobdahacker.com/blog/tldv-hack', dir: 'ai-meeting-recorder-security-audit-workflow-2026', kind: 'workflows' },
  { url: 'https://patentsgazette.uspto.gov/week26/OG/html/1547-5/US12670045-20260630.html', dir: 'mistral-tool-call-patent-tutorial-2026', kind: 'tutorials' },
];

for (const { url, dir, kind } of tasks) {
  console.log(`Taking: ${url} → ${kind}/${dir}/cover.png`);
  let ok = false;
  for (const proxy of ['socks5://127.0.0.1:7897', null]) {
    if (ok) break;
    try {
      const browser = await chromium.launch({
        headless: true,
        ...(proxy ? { proxy: { server: proxy } } : {}),
      });
      const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(9000);
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
