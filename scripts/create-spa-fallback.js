import { copyFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const distDir = resolve('dist');
const indexFile = join(distDir, 'index.html');
const fallbackFile = join(distDir, '404.html');

if (!existsSync(indexFile)) {
  throw new Error('dist/index.html was not found. Run vite build first.');
}

copyFileSync(indexFile, fallbackFile);
console.log('Created SPA fallback: dist/404.html');
