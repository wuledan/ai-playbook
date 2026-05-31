#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PROJECT_ROOT = path.resolve(import.meta.dirname, '..');
const PUBLIC_IMAGES = path.join(PROJECT_ROOT, 'public', 'images');

// Color palettes by category
const PALETTES = {
  comparisons: [
    { bg1: '#667eea', bg2: '#764ba2' },  // purple-blue
    { bg1: '#f093fb', bg2: '#f5576c' },  // pink-red
    { bg1: '#4facfe', bg2: '#00f2fe' },  // light blue
    { bg1: '#43e97b', bg2: '#38f9d7' },  // green-teal
    { bg1: '#fa709a', bg2: '#fee140' },  // pink-yellow
    { bg1: '#a18cd1', bg2: '#fbc2eb' },  // lavender-pink
  ],
  reviews: [
    { bg1: '#0f0c29', bg2: '#302b63', bg3: '#24243e' },  // dark blue
    { bg1: '#1a1a2e', bg2: '#16213e', bg3: '#0f3460' },  // navy
    { bg1: '#0d0d0d', bg2: '#1a1a2e', bg3: '#16213e' },  // near-black
    { bg1: '#000428', bg2: '#004e92' },                    // deep blue
    { bg1: '#141e30', bg2: '#243b55' },                    // slate blue
    { bg1: '#2c3e50', bg2: '#3498db' },                    // blue
  ],
  tutorials: [
    { bg1: '#11998e', bg2: '#38ef7d' },  // teal-green
    { bg1: '#00b4db', bg2: '#0083b0' },  // blue
    { bg1: '#fc4a1a', bg2: '#f7b733' },  // orange
    { bg1: '#8e2de2', bg2: '#4a00e0' },  // purple
    { bg1: '#ff6a00', bg2: '#ee0979' },  // orange-pink
    { bg1: '#56ab2f', bg2: '#a8e063' },  // green
  ],
  workflows: [
    { bg1: '#e96443', bg2: '#904e95' },  // warm
    { bg1: '#2193b0', bg2: '#6dd5ed' },  // cool blue
    { bg1: '#cc2b5e', bg2: '#753a88' },  // magenta
    { bg1: '#42275a', bg2: '#734b6d' },  // plum
    { bg1: '#bdc3c7', bg2: '#2c3e50' },  // grey-slate
    { bg1: '#de6262', bg2: '#ffb88c' },  // coral
  ],
};

// Word lists for generating subtitles
const CATEGORY_LABELS = {
  comparisons: 'AI Tools Comparison',
  reviews: 'AI Tool Review',
  tutorials: 'Step-by-Step Tutorial',
  workflows: 'AI Workflow Guide',
};

function slugToTitle(slug) {
  return slug
    .split('-')
    .map(w => {
      // Capitalize common abbreviations
      const upper = w.toUpperCase();
      if (['AI', 'UI', 'UX', 'API', 'SEO', 'LLM', 'GPT', 'CLI', 'V0', 'RAG', 'HQ', 'OS', 'N8N'].includes(upper)) return upper;
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(' ');
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getPalette(category, slug) {
  const palettes = PALETTES[category] || PALETTES.reviews;
  return palettes[hashString(slug) % palettes.length];
}

function buildGradientDef(colors) {
  if (colors.bg3) {
    return `
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${colors.bg1}"/>
        <stop offset="50%" style="stop-color:${colors.bg2}"/>
        <stop offset="100%" style="stop-color:${colors.bg3}"/>
      </linearGradient>
    </defs>`;
  }
  return `
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${colors.bg1}"/>
        <stop offset="100%" style="stop-color:${colors.bg2}"/>
      </linearGradient>
    </defs>`;
}

function getIconForCategory(category) {
  const icons = {
    comparisons: '⚖️',
    reviews: '🔍',
    tutorials: '📚',
    workflows: '⚡',
  };
  return icons[category] || '🤖';
}

function wrapText(text, maxCharsPerLine) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).length > maxCharsPerLine && current) {
      lines.push(current.trim());
      current = word;
    } else {
      current += (current ? ' ' : '') + word;
    }
  }
  if (current) lines.push(current.trim());
  return lines;
}

function buildSvg(slug, title, category, palette) {
  const icon = getIconForCategory(category);
  const label = CATEGORY_LABELS[category] || 'AI Tools';
  
  // Wrap title into lines
  const titleLines = wrapText(title, 28);
  
  // Calculate vertical positions
  const iconY = 100;
  const labelY = 170;
  const titleStartY = 230;
  const lineHeight = 60;
  const subtitleY = titleStartY + titleLines.length * lineHeight + 40;
  const slugY = subtitleY + 50;
  
  const titleElements = titleLines.map((line, i) => {
    const y = titleStartY + i * lineHeight;
    return `<text x="600" y="${y}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="42" font-weight="800" fill="white" letter-spacing="0.5">${line}</text>`;
  }).join('\n');

  const gradientDef = buildGradientDef(palette);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  ${gradientDef}
  <rect width="1200" height="630" fill="url(#bg)"/>
  
  <!-- Decorative circles -->
  <circle cx="100" cy="530" r="200" fill="rgba(255,255,255,0.05)"/>
  <circle cx="1100" cy="100" r="150" fill="rgba(255,255,255,0.05)"/>
  <circle cx="600" cy="315" r="250" fill="rgba(255,255,255,0.03)"/>
  
  <!-- Category icon -->
  <text x="600" y="${iconY}" text-anchor="middle" font-size="48">${icon}</text>
  
  <!-- Category label -->
  <text x="600" y="${labelY}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="18" font-weight="600" fill="rgba(255,255,255,0.8)" letter-spacing="3" text-transform="uppercase">${label.toUpperCase()}</text>
  
  <!-- Divider line -->
  <line x1="480" y1="${labelY + 15}" x2="720" y2="${labelY + 15}" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
  
  <!-- Title -->
  ${titleElements}
  
  <!-- Slug -->
  <text x="600" y="${subtitleY}" text-anchor="middle" font-family="monospace" font-size="14" fill="rgba(255,255,255,0.5)">toolsdepth.com</text>
  
  <!-- Bottom decorative bar -->
  <rect x="0" y="620" width="1200" height="10" fill="rgba(255,255,255,0.15)"/>
</svg>`;
}

async function generateCover(svgContent, outputPath) {
  const dir = path.dirname(outputPath);
  fs.mkdirSync(dir, { recursive: true });
  
  await sharp(Buffer.from(svgContent))
    .resize(1200, 630)
    .png({ compressionLevel: 6 })
    .toFile(outputPath);
}

function getCategory(slugPath) {
  // slugPath like: images/comparisons/xxx/cover.png
  if (slugPath.includes('/comparisons/')) return 'comparisons';
  if (slugPath.includes('/reviews/')) return 'reviews';
  if (slugPath.includes('/tutorials/')) return 'tutorials';
  if (slugPath.includes('/workflows/')) return 'workflows';
  return 'reviews';
}

function getSlug(slugPath) {
  // images/comparisons/ai-agent-frameworks/cover.jpg -> ai-agent-frameworks
  const parts = slugPath.split('/');
  return parts[parts.length - 2];
}

async function main() {
  // Read missing list
  let missingList = [];
  try {
    const output = execSync(
      `cd "${PROJECT_ROOT}" && comm -23 /tmp/aitools_cover_refs.txt /tmp/aitools_actual.txt | grep -v 'images/default/'`,
      { encoding: 'utf8' }
    );
    missingList = output.trim().split('\n').filter(Boolean);
  } catch (e) {
    console.error('Failed to get missing list:', e.message);
    process.exit(1);
  }

  console.log(`Found ${missingList.length} missing cover images`);
  
  let generated = 0;
  let errors = 0;
  
  for (const relPath of missingList) {
    const category = getCategory(relPath);
    const slug = getSlug(relPath);
    const title = slugToTitle(slug);
    const palette = getPalette(category, slug);
    
    try {
      const svg = buildSvg(slug, title, category, palette);
      const outputPath = path.join(PUBLIC_IMAGES, relPath);
      await generateCover(svg, outputPath);
      generated++;
      if (generated % 20 === 0) {
        console.log(`  Progress: ${generated}/${missingList.length}`);
      }
    } catch (e) {
      console.error(`  ERROR: ${relPath} - ${e.message}`);
      errors++;
    }
  }
  
  console.log(`\nDone! Generated: ${generated}, Errors: ${errors}`);
}

main();
