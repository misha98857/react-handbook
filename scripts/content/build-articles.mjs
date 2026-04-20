#!/usr/bin/env node
/**
 * MDX → *.articles.json / *.examples.json builder.
 *
 * For every declared locale:
 *   1. Read src/sidebarLearn.json + src/sidebarReference.json from the
 *      cloned source.
 *   2. For each page in the flattened sidebar:
 *        - locate src/content/<path>.md (fall back to en if missing)
 *        - strip YAML frontmatter, extract title
 *        - pipe through lib/mdx.mjs
 *   3. Emit output files under
 *        src/shared/assets/articles/react/<lang>.articles.json
 *        src/shared/assets/articles/react/<lang>.examples.json
 *
 * Usage:
 *   node build-articles.mjs                       # all locales
 *   node build-articles.mjs --lang en             # single locale
 *   node build-articles.mjs --lang en --section learn
 *   node build-articles.mjs --lang en --max 5     # only first N pages (smoke)
 */

import { readFile, writeFile, mkdir, access, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { flattenSidebar } from './lib/sidebar.mjs';
import { renderMdx } from './lib/mdx.mjs';
import { ExamplesStore } from './lib/examples-store.mjs';
import { toAppPath, toAppSlug } from './lib/slug.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..', '..');

const SECTION_FILES = [
  { key: 'learn', file: 'src/sidebarLearn.json' },
  { key: 'reference/react', file: 'src/sidebarReference.json' },
];

function parseArgs(argv) {
  /** @type {{ langs: string[]|null, sections: string[]|null, max: number|null }} */
  const args = { langs: null, sections: null, max: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--lang') args.langs = splitList(argv[++i]);
    else if (a.startsWith('--lang=')) args.langs = splitList(a.slice(7));
    else if (a === '--section') args.sections = splitList(argv[++i]);
    else if (a.startsWith('--section=')) args.sections = splitList(a.slice(10));
    else if (a === '--max') args.max = Number(argv[++i]);
    else if (a.startsWith('--max=')) args.max = Number(a.slice(6));
  }
  return args;
}

function splitList(v) {
  return String(v || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Strip YAML frontmatter and return { title, body }.
 * @param {string} raw
 */
function stripFrontmatter(raw) {
  let title = '';
  let body = raw;
  if (raw.startsWith('---')) {
    const end = raw.indexOf('\n---', 3);
    if (end !== -1) {
      const fm = raw.slice(3, end);
      body = raw.slice(end + 4).replace(/^\s*\r?\n/, '');
      const m = fm.match(/^\s*title:\s*(.*?)\s*$/m);
      if (m) title = m[1].replace(/^["']|["']$/g, '');
    }
  }
  // react.dev's first H1 doubles as the title when no frontmatter.
  if (!title) {
    const m = body.match(/^#\s+(.+?)\s*$/m);
    if (m) title = m[1];
  }
  return { title, body };
}

async function loadSource(sourcesRoot, locale, contentPath) {
  // Candidate file locations: .md / .mdx / index.md
  const candidates = [
    join(sourcesRoot, locale, 'src', 'content', `${contentPath}.md`),
    join(sourcesRoot, locale, 'src', 'content', `${contentPath}.mdx`),
    join(sourcesRoot, locale, 'src', 'content', contentPath, 'index.md'),
  ];
  for (const p of candidates) {
    if (await exists(p)) return { path: p, raw: await readFile(p, 'utf8') };
  }
  return null;
}

async function buildLocale(locale, args) {
  const sourcesRoot = join(__dirname, 'sources');
  const localeRoot = join(sourcesRoot, locale);
  const enRoot = join(sourcesRoot, 'en');

  if (!existsSync(localeRoot)) {
    console.warn(`[${locale}] sources not fetched — run \`npm run content:fetch\` first. Skipping.`);
    return { locale, pages: 0, fallbacks: 0, examples: 0 };
  }

  // Sidebar files: always taken from the English tree (they are the same
  // structure everywhere; titles come from the per-page frontmatter).
  const sidebars = [];
  for (const { key, file } of SECTION_FILES) {
    if (args.sections && !args.sections.includes(key)) continue;
    const abs = join(enRoot, file);
    if (!(await exists(abs))) continue;
    const json = await readJson(abs);
    const pages = flattenSidebar(json, key);
    sidebars.push({ key, pages });
  }

  const examples = new ExamplesStore(locale);
  const assetReferences = new Set();

  // Pre-compute the set of slugs that WILL be built this run. Link
  // transformer uses it to redirect dead internal links to external
  // react.dev URLs instead of emitting broken /react/:name hrefs.
  const knownSlugs = new Set();
  for (const { pages } of sidebars) {
    for (const page of pages) {
      knownSlugs.add(toAppSlug(page.contentPath).slug);
    }
  }

  /** @type {Record<string, {key:string, title:string, value:string, path:string, nav:[string,string], examples:string[], fallback?:boolean}[]>} */
  const groups = {};
  /** @type {string[]} */
  const missing = [];

  let pageCount = 0;
  let fallbackCount = 0;

  outer: for (const { pages } of sidebars) {
    for (let i = 0; i < pages.length; i++) {
      if (args.max != null && pageCount >= args.max) break outer;
      const page = pages[i];

      // locate source MD(X)
      let src = await loadSource(sourcesRoot, locale, page.contentPath);
      let fallback = false;
      if (!src) {
        if (locale !== 'en') {
          src = await loadSource(sourcesRoot, 'en', page.contentPath);
          if (src) {
            fallback = true;
            fallbackCount += 1;
          }
        }
      }
      if (!src) {
        missing.push(page.contentPath);
        continue;
      }

      const { title: fmTitle, body } = stripFrontmatter(src.raw);
      const title = fmTitle || page.title || page.contentPath;

      const ctx = {
        locale,
        contentPath: page.contentPath,
        examples,
        assetReferences,
        knownSlugs,
      };

      let html;
      try {
        html = await renderMdx(body, ctx);
      } catch (e) {
        console.error(`[${locale}] render failed for ${page.contentPath}: ${e.message}`);
        continue;
      }

      const slug = toAppSlug(page.contentPath).slug;
      const path = toAppPath(slug);

      // prev / next navigation — computed after the loop
      const exampleIds = Object.keys(examples.byId).filter(id =>
        id.startsWith(`${page.contentPath.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-`),
      );

      const group = page.groupTitle || 'General';
      (groups[group] ||= []).push({
        key: slug,
        title,
        value: html,
        path,
        nav: ['', ''],
        examples: exampleIds,
        ...(fallback ? { fallback: true } : {}),
      });

      pageCount += 1;
    }
  }

  // Compute prev/next within the full ordered list of emitted pages.
  const ordered = Object.values(groups).flat();
  for (let i = 0; i < ordered.length; i++) {
    const prev = i > 0 ? ordered[i - 1].path : '/react';
    const next = i < ordered.length - 1 ? ordered[i + 1].path : '/react';
    ordered[i].nav = [prev, next];
  }

  // Re-shape into ArticleGroup[] keeping insertion order.
  /** @type {Array<{key:string, values: any[]}>} */
  const articleGroups = [];
  for (const [groupKey, values] of Object.entries(groups)) {
    articleGroups.push({ key: groupKey, values });
  }

  const outDir = join(REPO_ROOT, 'src', 'shared', 'assets', 'articles', 'react');
  await mkdir(outDir, { recursive: true });

  const articlesOut = join(outDir, `${locale}.articles.json`);
  const examplesOut = join(outDir, `${locale}.examples.json`);
  await writeFile(articlesOut, JSON.stringify(articleGroups), 'utf8');
  await writeFile(examplesOut, JSON.stringify(examples.toJSON()), 'utf8');

  if (missing.length) {
    const missOut = join(outDir, `${locale}.missing.txt`);
    await writeFile(missOut, missing.join('\n') + '\n', 'utf8');
  }

  // Copy referenced images once (from en tree) into app assets.
  if (assetReferences.size > 0) {
    const imagesTargetRoot = join(REPO_ROOT, 'src', 'shared', 'assets', 'images', 'react');
    await mkdir(imagesTargetRoot, { recursive: true });
    for (const ref of assetReferences) {
      const rel = ref.replace(/^images\//, '');
      const candidates = [join(enRoot, 'public', ref), join(enRoot, 'public', 'images', rel)];
      for (const from of candidates) {
        if (!(await exists(from))) continue;
        const to = join(imagesTargetRoot, rel);
        await mkdir(dirname(to), { recursive: true });
        try {
          await copyFile(from, to);
        } catch {
          /* ignore */
        }
        break;
      }
    }
  }

  console.log(
    `[${locale}] pages=${pageCount} fallbacks=${fallbackCount} missing=${missing.length} examples=${Object.keys(examples.toJSON()).length}`,
  );
  console.log(`  -> ${articlesOut}`);
  console.log(`  -> ${examplesOut}`);
  return { locale, pages: pageCount, fallbacks: fallbackCount, examples: Object.keys(examples.toJSON()).length };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const cfg = await readJson(join(__dirname, 'locales.json'));
  const selected = args.langs ? cfg.locales.filter(l => args.langs.includes(l.code)) : cfg.locales;

  for (const { code } of selected) {
    await buildLocale(code, args);
  }
}

main().catch(err => {
  console.error(err.stack || err.message || err);
  process.exit(1);
});
