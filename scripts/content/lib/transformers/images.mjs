/**
 * Rewrite `src` on image nodes. react.dev stores images under
 * `public/images/docs/...`. We keep the same relative path but root
 * it at the Angular asset folder — the actual asset copy step is
 * handled by the build runner (build-articles.mjs).
 */

import { visit } from 'unist-util-visit';

const TARGET_PREFIX = 'shared/assets/images/react';

/** @param {any} tree @param {{ assetReferences: Set<string> }} ctx */
export function applyImages(tree, ctx) {
  visit(tree, 'image', node => {
    const src = node.url || '';
    if (!src || /^https?:\/\//i.test(src) || src.startsWith('data:')) return;
    const clean = src
      .replace(/^\.?\/+/, '')
      .replace(/^(?:\.\.\/)+/, '')
      .replace(/^public\//, '');
    ctx.assetReferences?.add(clean);
    node.url = `${TARGET_PREFIX}/${clean.replace(/^images\//, '')}`;
  });
}
