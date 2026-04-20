/**
 * <Challenges>…</Challenges>
 *   holds <Challenge name="…" title="…"> siblings, each of which has
 *   a free body + a <Solution> wrapper for the collapsed answer.
 *
 * We render challenges as a <section class="challenge">, each with
 *   a <h3>title</h3>, the problem body, and a <details class="solution">.
 */

import { visit } from 'unist-util-visit';
import { isJsxElement, getJsxAttr } from './_util.mjs';

/** @param {any} tree */
export function applyChallenges(tree) {
  visit(tree, node => {
    if (!isJsxElement(node, 'Challenges')) return;
    node.type = 'mdxJsxFlowElement';
    node.name = 'section';
    node.attributes = [{ type: 'mdxJsxAttribute', name: 'class', value: 'challenges' }];
  });

  visit(tree, node => {
    if (!isJsxElement(node, 'Challenge')) return;
    const title = getJsxAttr(node, 'title') || '';
    const children = node.children || [];
    const heading = { type: 'html', value: `<h3 class="challenge__title">${escapeHtml(title)}</h3>` };
    node.type = 'mdxJsxFlowElement';
    node.name = 'article';
    node.attributes = [{ type: 'mdxJsxAttribute', name: 'class', value: 'challenge' }];
    node.children = [heading, ...children];
  });

  visit(tree, node => {
    if (!isJsxElement(node, 'Solution')) return;
    const summary = { type: 'html', value: '<summary data-i18n="article-show-solution">Show solution</summary>' };
    node.type = 'mdxJsxFlowElement';
    node.name = 'details';
    node.attributes = [{ type: 'mdxJsxAttribute', name: 'class', value: 'solution' }];
    node.children = [summary, ...(node.children || [])];
  });

  visit(tree, node => {
    if (!isJsxElement(node, 'Hint')) return;
    const summary = { type: 'html', value: '<summary data-i18n="article-hint">Hint</summary>' };
    node.type = 'mdxJsxFlowElement';
    node.name = 'details';
    node.attributes = [{ type: 'mdxJsxAttribute', name: 'class', value: 'hint' }];
    node.children = [summary, ...(node.children || [])];
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
}
