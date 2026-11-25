#!/usr/bin/env node
/**
 * Downloads React UMD builds and @babel/standalone into
 * src/shared/assets/playground/vendor/ so that the Sandpack runner
 * iframe works fully offline (Capacitor app bundles the assets).
 *
 * Run once per version bump:
 *   node scripts/playground/download-vendors.mjs
 *
 * Files written (~4 MB total, gzip ~1.2 MB):
 *   - react.development.js
 *   - react-dom.development.js
 *   - babel.min.js
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OUT = resolve(__dirname, '..', '..', 'src', 'shared', 'assets', 'playground', 'vendor');

const REACT_VERSION = '18.3.1';
const BABEL_VERSION = '7.25.6';

const FILES = [
  {
    name: 'react.development.js',
    url: `https://unpkg.com/react@${REACT_VERSION}/umd/react.development.js`,
  },
  {
    name: 'react-dom.development.js',
    url: `https://unpkg.com/react-dom@${REACT_VERSION}/umd/react-dom.development.js`,
  },
  {
    name: 'babel.min.js',
    url: `https://unpkg.com/@babel/standalone@${BABEL_VERSION}/babel.min.js`,
  },
];

async function download(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

async function main() {
  await mkdir(OUT, { recursive: true });
  for (const { name, url } of FILES) {
    process.stdout.write(`fetching ${name} ... `);
    const buf = await download(url);
    await writeFile(resolve(OUT, name), buf);
    console.log(`${(buf.length / 1024).toFixed(1)} kB`);
  }
  await writeFile(
    resolve(OUT, 'MANIFEST.json'),
    JSON.stringify({ react: REACT_VERSION, babel: BABEL_VERSION, fetchedAt: new Date().toISOString() }, null, 2),
  );
  console.log(`done → ${OUT}`);
}

main().catch(e => {
  console.error(e.stack || e.message);
  process.exit(1);
});
