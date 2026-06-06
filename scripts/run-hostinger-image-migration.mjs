import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

spawnSync(process.execPath, ['scripts/apply-hostinger-image-paths.mjs'], { stdio: 'inherit' });

const app = fs.readFileSync('src/App.jsx', 'utf8');
const visual = fs.readFileSync('src/data/visualAssets.js', 'utf8');
const filenames = [...visual.matchAll(/uploaded\('([^']+)'/g)].map((match) => match[1]);
const unique = new Set(filenames);

if (unique.size !== 55) throw new Error(`Expected 55 unique uploaded images, found ${unique.size}`);
if ([...unique].some((name) => !/\.(png|jpg)$/.test(name))) throw new Error('Unexpected image extension');
if (!visual.includes("asset(`/assets/landing-uploaded/${file}`, alt)")) {
  throw new Error('Hostinger image base path is missing');
}
if (!app.includes('visualAssets.studentPortal') || !app.includes('visualAssets.teacherPortal')) {
  throw new Error('Portal image mappings are missing from App.jsx');
}

console.log(`Verified ${unique.size} Hostinger image filenames and portal mappings.`);
