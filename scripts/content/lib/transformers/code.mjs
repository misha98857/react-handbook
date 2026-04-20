/**
 * Fenced code blocks → HTML compatible with the existing Prism theme.
 *
 * The app already ships prism-okaidia + the Gatsby `.gatsby-highlight`
 * wrapper CSS, so we pre-tokenize server-side via `refractor` and emit:
 *
 *   <div class="gatsby-highlight" data-language="jsx">
 *     <pre class="language-jsx"><code class="language-jsx">…</code></pre>
 *   </div>
 */

import { visit } from 'unist-util-visit';
import { refractor } from 'refractor/lib/common.js';
import { toHtml } from 'hast-util-to-html';

const LANG_ALIAS = {
  js: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
  sh: 'bash',
  shell: 'bash',
  console: 'bash',
  html: 'markup',
  xml: 'markup',
  json: 'json',
  css: 'css',
  diff: 'diff',
  md: 'markdown',
  mdx: 'markdown',
  text: null,
  txt: null,
  '': null,
};

/** @param {any} tree */
export function applyCode(tree) {
  visit(tree, 'code', node => {
    const rawLang = (node.lang || '').toLowerCase().split(/\s+/)[0];
    const lang = rawLang in LANG_ALIAS ? LANG_ALIAS[rawLang] : rawLang;
    let innerHtml;
    if (lang && refractor.registered(lang)) {
      const hast = refractor.highlight(node.value || '', lang);
      innerHtml = toHtml(hast);
    } else {
      innerHtml = escapeHtml(node.value || '');
    }
    const languageClass = lang ? `language-${lang}` : 'language-text';
    const html =
      `<div class="gatsby-highlight" data-language="${escapeHtml(rawLang || 'text')}">` +
      `<pre class="${languageClass}"><code class="${languageClass}">${innerHtml}</code></pre>` +
      `</div>`;
    node.type = 'html';
    node.value = html;
    delete node.lang;
    delete node.meta;
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
}
