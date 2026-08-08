import { chromium } from 'playwright';
import { mkdirSync, statSync } from 'fs';
import { dirname } from 'path';

const tasks = [
  { url: 'https://deepmind.google/blog/weathernext-ai-model-achieves-breakthrough-in-forecasting-cyclones/', dir: 'weathernext-review-2026', kind: 'reviews' },
  { url: 'https://simonwillison.net/2026/Aug/7/openai-timeline/', dir: 'ai-agent-security-workflow-2026', kind: 'workflows' },
  { url: 'https://code.claude.com/docs/en/cross-session-messaging', dir: 'claude-code-cross-session-tutorial-2026', kind: 'tutorials' },
];

for (const { url, dir, kind } of tasks) {
  console.log(`Taking: ${url} → ${kind}/${dir}/cover.png`);
  try {
    const browser = await chromium.launch({
      headless: true,
      proxy: { server: 'socks5://127.0.0.1:7897' },
    });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(9000);
    const out = `public/images/${kind}/${dir}/cover.png`;
    mkdirSync(dirname(out), { recursive: true });
    await page.screenshot({ path: out, type: 'png' });
    const st = statSync(out);
    console.log(`  OK: ${(st.size / 1024).toFixed(0)}KB`);
    await browser.close();
  } catch (e) {
    console.log(`  FAIL: ${e.message}`);
  }
}
console.log('ALL DONE');
