import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const partDir = path.join(root, 'public', 'assets', 'generated');
const target = path.join(root, 'public', 'assets', 'hero-brand-poster-photo.jpg');
const parts = [
  'hero-brand-poster-photo.part01.b64',
  'hero-brand-poster-photo.part02.b64',
  'hero-brand-poster-photo.part03.b64',
  'hero-brand-poster-photo.part04.b64',
  'hero-brand-poster-photo.part05.b64',
  'hero-brand-poster-photo.part06.b64'
];

const base64 = parts
  .map((name) => fs.readFileSync(path.join(partDir, name), 'utf8').trim())
  .join('');

const buffer = Buffer.from(base64, 'base64');
if (buffer.length < 10000) {
  throw new Error(`Restored hero image is unexpectedly small: ${buffer.length} bytes`);
}

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, buffer);
console.log(`Restored hero image: ${path.relative(root, target)} (${buffer.length} bytes)`);
