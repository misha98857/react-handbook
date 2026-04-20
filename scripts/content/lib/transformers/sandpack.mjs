/**
 * <Sandpack> → placeholder `<div data-example="…">` + entry in ExamplesStore.
 *
 * react.dev syntax:
 *
 *   <Sandpack>
 *   ```js
 *   // App.js (default entry)
 *   export default function App() { ... }
 *   ```
 *
 *   ```css
 *   // styles.css
 *   ```
 *   </Sandpack>
 *
 * Each fenced block inside <Sandpack> becomes a file. The file name is
 * parsed from the code meta string (e.g. ```js App.js active``` or
 * ```js src/App.js active```). If no meta is given we fall back to
 * conventional names: App.js / styles.css / index.js.
 *
 * `dependencies={'{"use-immer":"^0.9"}'}` attribute on <Sandpack> is
 * parsed and surfaced; we do not try to execute such examples locally —
 * the Angular runtime offers a CodeSandbox fallback for them.
 */

import { visit } from 'unist-util-visit';
import { isJsxElement, getJsxAttr, replaceWithHtml } from './_util.mjs';

const EXT_TO_LANG = {
  js: 'js',
  jsx: 'js',
  mjs: 'js',
  ts: 'ts',
  tsx: 'ts',
  css: 'css',
  scss: 'css',
  html: 'html',
  json: 'json',
  txt: 'text',
  md: 'text',
};

/**
 * @param {any} tree
 * @param {{ examples: import('../examples-store.mjs').ExamplesStore, contentPath: string }} ctx
 */
export function applySandpack(tree, ctx) {
  // Process outermost-first so nested weird cases don't double-register.
  const toProcess = [];
  visit(tree, node => {
    if (isJsxElement(node, 'Sandpack')) toProcess.push(node);
  });

  let idx = 0;
  for (const node of toProcess) {
    idx += 1;
    const files = extractFiles(node);
    if (Object.keys(files).length === 0) {
      // nothing we can show, drop the whole element
      replaceWithHtml(node, '');
      continue;
    }
    const entry = pickEntry(files);

    const dependencies = parseDeps(getJsxAttr(node, 'dependencies'));
    const environment = detectEnvironment(files);

    const example = { files, entry, dependencies, environment };
    const id = ctx.examples.add(example, ctx.contentPath);

    const fileList = Object.keys(files).join(', ');
    const html =
      `<div class="sandpack-placeholder" data-example="${id}">` +
      `<div class="sandpack-placeholder__header">` +
      `<span class="sandpack-placeholder__label" data-i18n="article-sandpack-label">Interactive example</span>` +
      `<span class="sandpack-placeholder__files">${escapeHtml(fileList)}</span>` +
      `</div>` +
      `</div>`;
    replaceWithHtml(node, html);
  }
}

/** @returns {Record<string,string>} */
function extractFiles(sandpackNode) {
  /** @type {Record<string,string>} */
  const files = {};
  const children = sandpackNode.children || [];
  let autoIndex = 0;
  for (const child of children) {
    if (!child || child.type !== 'code') continue;
    const { filename, lang } = parseCodeMeta(child);
    const name = filename || defaultNameFor(lang, autoIndex++);
    files[normalizePath(name)] = child.value || '';
  }
  return files;
}

function parseCodeMeta(codeNode) {
  const lang = (codeNode.lang || '').toLowerCase();
  const meta = (codeNode.meta || '').trim();
  if (!meta) return { filename: null, lang };
  // first whitespace-separated token that looks like a path or filename
  const tokens = meta.split(/\s+/);
  for (const t of tokens) {
    if (/^[\w./-]+\.[A-Za-z0-9]+$/.test(t)) return { filename: t, lang };
  }
  return { filename: null, lang };
}

function defaultNameFor(lang, i) {
  const ext = EXT_TO_LANG[lang] ? invertExt(lang) : 'txt';
  if (lang === 'css') return i === 0 ? 'styles.css' : `styles${i}.css`;
  if (lang === 'html') return 'index.html';
  if (lang === 'json') return 'package.json';
  if (lang === 'jsx' || lang === 'js' || lang === 'mjs') {
    return i === 0 ? 'App.js' : `file${i}.js`;
  }
  if (lang === 'tsx' || lang === 'ts') {
    return i === 0 ? 'App.tsx' : `file${i}.tsx`;
  }
  return `file${i}.${ext}`;
}

function invertExt(lang) {
  return lang === 'js' ? 'js' : lang === 'jsx' ? 'jsx' : lang;
}

function normalizePath(p) {
  const clean = p.replace(/\\/g, '/').replace(/^\.\//, '');
  return clean.startsWith('/') ? clean : `/${clean}`;
}

function pickEntry(files) {
  const keys = Object.keys(files);
  const preferred = ['/App.js', '/App.jsx', '/App.tsx', '/App.ts', '/index.js', '/index.jsx', '/index.tsx'];
  for (const p of preferred) if (keys.includes(p)) return p;
  // first non-css file
  return keys.find(k => !/\.(css|scss|json|txt|md)$/i.test(k)) || keys[0];
}

/** @param {string|null} raw */
function parseDeps(raw) {
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function detectEnvironment(files) {
  const keys = Object.keys(files);
  if (keys.some(k => /\.tsx?$/i.test(k))) return 'react-ts';
  return 'react';
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
}
