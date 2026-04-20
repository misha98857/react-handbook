#!/usr/bin/env node
/**
 * Clone / fast-forward every declared locale of react.dev into
 * scripts/content/sources/<lang>/ . Shallow clone (depth=1) unless --full.
 *
 * Usage:
 *   node fetch-sources.mjs                  # all locales
 *   node fetch-sources.mjs --lang en,ru     # subset
 *   node fetch-sources.mjs --full           # full history (useful for `git log`)
 */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @param {string[]} argv */
function parseArgs(argv) {
  /** @type {{ langs: string[] | null, full: boolean }} */
  const args = { langs: null, full: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--lang') {
      args.langs = (argv[++i] || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    } else if (a.startsWith('--lang=')) {
      args.langs = a
        .slice('--lang='.length)
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    } else if (a === '--full') {
      args.full = true;
    }
  }
  return args;
}

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: false, ...opts });
  if (r.status !== 0) {
    throw new Error(`${cmd} ${args.join(' ')} failed (exit ${r.status})`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const cfgPath = join(__dirname, 'locales.json');
  const cfg = JSON.parse(await readFile(cfgPath, 'utf8'));

  const langs = args.langs;
  const selected = langs ? cfg.locales.filter(l => langs.includes(l.code)) : cfg.locales;

  if (selected.length === 0) {
    console.error('No locales selected. Check --lang argument.');
    process.exit(1);
  }

  const sourcesRoot = resolve(__dirname, 'sources');

  for (const { code, repo } of selected) {
    const dest = join(sourcesRoot, code);
    console.log(`\n[${code}] ${repo} -> ${dest}`);
    if (existsSync(join(dest, '.git'))) {
      // update
      run('git', ['-C', dest, 'fetch', '--depth=1', 'origin', cfg.pinnedRef]);
      run('git', ['-C', dest, 'reset', '--hard', 'FETCH_HEAD']);
    } else {
      const depth = args.full ? [] : ['--depth=1'];
      run('git', ['clone', ...depth, '--branch', cfg.pinnedRef, '--single-branch', repo, dest]);
    }
  }

  console.log('\nAll requested locales are up to date.');
}

main().catch(err => {
  console.error(err.message || err);
  process.exit(1);
});
