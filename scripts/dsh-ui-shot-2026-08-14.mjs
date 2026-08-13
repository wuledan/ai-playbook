import { chromium } from 'playwright';
import { mkdirSync, statSync } from 'fs';
import { dirname } from 'path';

const out = 'public/images/reviews/deepseek-harness-developer-preview-review-2026/ui-session.png';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
try {
  await page.goto('http://127.0.0.1:3080', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);
  // Click Continue button to dismiss testing notice
  const btns = page.locator('button, [role="button"]');
  const n = await btns.count();
  console.log('buttons:', n);
  for (let i = 0; i < n; i++) {
    const t = (await btns.nth(i).innerText().catch(() => '')).trim();
    if (t.toLowerCase().includes('continue')) {
      await btns.nth(i).click();
      console.log('clicked Continue');
      break;
    }
  }
  await page.waitForTimeout(6000);
  mkdirSync(dirname(out), { recursive: true });
  await page.screenshot({ path: out, type: 'png' });
  const st = statSync(out);
  console.log('OK:', (st.size / 1024).toFixed(0) + 'KB');
  const text = await page.evaluate(() => document.body.innerText.slice(0, 1500));
  console.log('TEXT:', text);
} catch (e) {
  console.log('FAIL:', e.message.split('\n')[0]);
}
await browser.close();
