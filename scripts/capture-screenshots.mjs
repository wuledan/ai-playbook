import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

const TARGETS = [
  {
    name: 'mimo-code-review-2026',
    url: 'https://github.com/XiaomiMiMo/MiMo-Code',
    filename: 'mimo-code-cover.png',
    selector: 'main'
  },
  {
    name: 'guard-skills-review-2026',
    url: 'https://github.com/amElnagdy/guard-skills',
    filename: 'guard-skills-cover.png',
    selector: 'main'
  },
  {
    name: 'sandboxd-review-2026',
    url: 'https://github.com/tastyeffectco/sandboxd',
    filename: 'sandboxd-cover.png',
    selector: 'main'
  }
];

const baseDir = path.join(PROJECT_ROOT, 'public', 'images', 'reviews');

async function main() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--proxy-server=socks5://127.0.0.1:7897', '--no-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
  });

  for (const target of TARGETS) {
    const page = await context.newPage();
    const dir = path.join(baseDir, target.name);
    fs.mkdirSync(dir, { recursive: true });
    
    try {
      console.log(`Navigating to ${target.url}...`);
      await page.goto(target.url, { waitUntil: 'networkidle', timeout: 45000 });
      await page.waitForTimeout(3000);
      
      const element = await page.$(target.selector);
      if (element) {
        const box = await element.boundingBox();
        console.log(`  Element box: ${JSON.stringify(box)}`);
        if (box && box.width >= 800) {
          await element.screenshot({ path: path.join(dir, target.filename) });
          console.log(`✅ ${target.name}/${target.filename} — ${Math.round(box.width)}x${Math.round(box.height)}px`);
        } else {
          console.log(`⚠️  Element too small, taking full page`);
          await page.screenshot({ path: path.join(dir, target.filename), fullPage: true });
        }
      } else {
        console.log(`⚠️  No element found, taking full page`);
        await page.screenshot({ path: path.join(dir, target.filename) });
      }
    } catch (err) {
      console.error(`❌ ${target.name}: ${err.message}`);
      try {
        await page.screenshot({ path: path.join(dir, target.filename) });
      } catch {}
    } finally {
      await page.close();
    }
  }
  
  await browser.close();
  console.log('Done!');
}

main().catch(console.error);
