/**
 * Rewrite `href` on every link node (markdown `[text](url)` and raw
 * `<a href>` in HTML passthroughs) so that inter-page links stay inside
 * the Angular router namespace `/react/:slug`.
 *
 * External links get `class="external-link"` so the existing CSS styles
 * them consistently with the old content.
 */

import { visit } from 'unist-util-visit';
import { rewriteLink } from '../slug.mjs';

/** @param {any} tree @param {{ contentPath: string }} ctx */
export function applyLinks(tree, ctx) {
  visit(tree, 'link', node => {
    const href = node.url;
    const rewritten = rewriteLink(href, ctx.contentPath);
    node.url = rewritten;
    if (isExternal(rewritten)) {
      node.data = node.data || {};
      node.data.hProperties = { ...(node.data.hProperties || {}), className: ['external-link'] };
    }
  });
}

function isExternal(href) {
  return /^(https?:)?\/\//i.test(href || '');
}
