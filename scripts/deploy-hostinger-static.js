import { existsSync, mkdirSync, cpSync, rmSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execSync } from 'node:child_process';

const root = resolve('.');
const dist = join(root, 'dist');
const worktree = join(root, '.hostinger-static-worktree');

function run(command, options = {}) {
  execSync(command, { stdio: 'inherit', cwd: root, ...options });
}

function assertBuild() {
  if (!existsSync(join(dist, 'index.html'))) {
    throw new Error('dist/index.html is missing. Run npm run build first.');
  }
  if (!existsSync(join(dist, 'assets'))) {
    throw new Error('dist/assets is missing. Run npm run build first.');
  }
}

function copyDistToWorktree() {
  rmSync(worktree, { recursive: true, force: true });
  mkdirSync(worktree, { recursive: true });
  cpSync(dist, worktree, { recursive: true });
}

function deploy() {
  assertBuild();
  copyDistToWorktree();

  run('git fetch origin main');
  try { run('git branch -D hostinger-static', { stdio: 'ignore' }); } catch {}
  run('git checkout --orphan hostinger-static');
  run('git rm -rf .');

  for (const item of readdirSync(worktree)) {
    cpSync(join(worktree, item), join(root, item), { recursive: true });
  }
  rmSync(worktree, { recursive: true, force: true });

  run('git add .');
  run('git commit -m "Deploy built site to Hostinger"');
  run('git push origin hostinger-static --force-with-lease');
  run('git checkout main');
}

deploy();
