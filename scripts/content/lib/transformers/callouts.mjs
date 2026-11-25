/**
 * <Note>, <Pitfall>, <Gotcha>, <Wip>, <DeepDive>, <YouWillLearn> ...
 *
 * All callout components become a blockquote-styled <div> so that the
 * existing .blockquote CSS keeps working. DeepDive becomes a <details>
 * because it's collapsible on react.dev.
 *
 * The inner MDX tree is preserved — we only rewrite the outer wrapper,
 * so nested markdown keeps flowing through the pipeline.
 */

import { visit } from 'unist-util-visit';
import { isJsxElement } from './_util.mjs';

const CALLOUT_CLASS = {
  Note: 'blockquote',
  Gotcha: 'blockquote scary',
  Pitfall: 'blockquote scary',
  Wip: 'blockquote scary',
};

/** @param {any} tree */
export function applyCallouts(tree) {
  visit(tree, node => {
    if (!isJsxElement(node)) return;

    if (CALLOUT_CLASS[node.name]) {
      wrap(node, 'div', { class: CALLOUT_CLASS[node.name] });
      return;
    }

    if (node.name === 'DeepDive') {
      const extracted = extractFirstHeading(node);
      const title = extracted || 'Deep dive';
      wrapAsDetails(node, title, 'deep-dive', !extracted);
      return;
    }

    if (node.name === 'YouWillLearn' || node.name === 'YouWillLearnCard') {
      wrap(node, 'div', { class: 'you-will-learn' });
      return;
    }

    if (node.name === 'Intro') {
      wrap(node, 'div', { class: 'intro' });
      return;
    }
  });
}

/**
 * Mutate `node` so that it becomes an mdxJsxFlowElement with a basic HTML
 * tag name (remark-rehype forwards unknown JSX tags as HTML when their
 * name is lowercase).
 */
function wrap(node, tag, attrs) {
  node.type = 'mdxJsxFlowElement';
  node.name = tag;
  node.attributes = Object.entries(attrs).map(([name, value]) => ({
    type: 'mdxJsxAttribute',
    name,
    value,
  }));
}

function wrapAsDetails(node, summary, className, translatable = false) {
  // Prepend an html node with <summary>…</summary> and wrap everything
  // in a <details> element.
  const dataAttr = translatable ? ' data-i18n="article-deep-dive"' : '';
  const summaryNode = { type: 'html', value: `<summary${dataAttr}>${escapeHtml(summary)}</summary>` };
  const children = node.children || [];
  // Drop the first heading — it's already our summary
  const body = children.filter(c => !(c && c.type === 'heading' && c.depth <= 4 && sameText(c, summary)));
  node.type = 'mdxJsxFlowElement';
  node.name = 'details';
  node.attributes = [{ type: 'mdxJsxAttribute', name: 'class', value: className }];
  node.children = [summaryNode, ...body];
}

function extractFirstHeading(node) {
  const h = (node.children || []).find(c => c && c.type === 'heading' && c.depth <= 4);
  if (!h) return null;
  return stringifyMd(h);
}

function sameText(a, b) {
  return stringifyMd(a).trim().toLowerCase() === String(b).trim().toLowerCase();
}

function stringifyMd(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value;
  if (Array.isArray(node.children)) return node.children.map(stringifyMd).join('');
  return '';
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
}
