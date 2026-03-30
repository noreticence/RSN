#!/usr/bin/env node
// Drop your 5 photos into the images/ folder (named work-10.jpg through work-14.jpg),
// then run:  node embed-images.js
// It will base64-encode them directly into index.html so the site stays single-file.

const fs = require('fs');
const path = require('path');

const files = [
  { name: 'work-10.jpg', placeholder: 'images/work-10.jpg' },
  { name: 'work-11.jpg', placeholder: 'images/work-11.jpg' },
  { name: 'work-12.jpg', placeholder: 'images/work-12.jpg' },
  { name: 'work-13.jpg', placeholder: 'images/work-13.jpg' },
  { name: 'work-14.jpg', placeholder: 'images/work-14.jpg' },
];

let html = fs.readFileSync('index.html', 'utf8');
let changed = 0;

for (const f of files) {
  const imgPath = path.join('images', f.name);
  if (!fs.existsSync(imgPath)) {
    console.log(`⚠  Skipping ${f.name} — not found in images/`);
    continue;
  }
  const ext = path.extname(f.name).slice(1).replace('jpg', 'jpeg');
  const b64 = fs.readFileSync(imgPath).toString('base64');
  const dataUrl = `data:image/${ext};base64,${b64}`;
  html = html.replaceAll(`src="${f.placeholder}"`, `src="${dataUrl}"`);
  console.log(`✓  Embedded ${f.name}`);
  changed++;
}

if (changed > 0) {
  fs.writeFileSync('index.html', html);
  console.log(`\nDone — ${changed} image(s) embedded into index.html`);
  console.log('Run: git add index.html && git commit -m "Embed project photos" && git push');
} else {
  console.log('\nNo images embedded. Add photos to the images/ folder and try again.');
}
