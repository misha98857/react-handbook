#!/usr/bin/env node
/**
 * Light-weight validator for the output produced by
 * build-articles.mjs.
 *
 * Checks:
 *   - Every `path` is unique within a locale.
 *   - Every internal link `/react/<slug>` resolves to a known page
 *     (emits a warning otherwise; not a hard error because some react.dev
 *     links intentionally point at not-yet-translated pages).
 *   - Every `data-example="…"` placeholder has a matching entry in the
 *     examples JSON.
 */

import { readFile, readdir } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
const STAGING = join(REPO_ROOT, 'src', 'shared', 'assets', 'articles', 'react');

async function main() {
  let hardErrors = 0;
  const files = await readdir(STAGING).catch(() => []);
  const locales = [
    ...new Set(files.filter(f => f.endsWith('.articles.json')).map(f => f.replace('.articles.json', ''))),
  ];
  if (locales.length === 0) {
    console.error(`No staging files found in ${STAGING}. Run \`npm run content:build\` first.`);
    process.exit(1);
  }

  for (const locale of locales) {
    const groups = JSON.parse(await readFile(join(STAGING, `${locale}.articles.json`), 'utf8'));
    const examples = await readFile(join(STAGING, `${locale}.examples.json`), 'utf8').then(
      s => JSON.parse(s),
      () => ({}),
    );
    const all = groups.flatMap(g => g.values);
    const paths = new Set(all.map(a => a.path));

    // unique paths
    const seen = new Set();
    for (const a of all) {
      if (seen.has(a.path)) {
        console.error(`[${locale}] duplicate path ${a.path}`);
        hardErrors++;
      }
      seen.add(a.path);
    }

    // placeholder ↔ examples
    const placeholderRe = /data-example="([^"]+)"/g;
    let placeholders = 0,
      missingEx = 0;
    for (const a of all) {
      let m;
      while ((m = placeholderRe.exec(a.value)) !== null) {
        placeholders++;
        if (!examples[m[1]]) {
          console.error(`[${locale}] missing example ${m[1]} referenced in ${a.path}`);
          missingEx++;
          hardErrors++;
        }
      }
    }

    // dead internal links
    const linkRe = /href="(\/react\/[^"#]+)(#[^"]*)?"/g;
    let deadLinks = 0;
    for (const a of all) {
      let m;
      while ((m = linkRe.exec(a.value)) !== null) {
        if (!paths.has(m[1])) {
          console.warn(`[${locale}] dead link ${m[1]} in ${a.path}`);
          deadLinks++;
        }
      }
    }

    console.log(
      `[${locale}] pages=${all.length} placeholders=${placeholders} missingExamples=${missingEx} deadLinks=${deadLinks}`,
    );
  }

  if (hardErrors > 0) {
    console.error(`\nValidation failed with ${hardErrors} hard error(s).`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err.stack || err.message || err);
  process.exit(1);
});
