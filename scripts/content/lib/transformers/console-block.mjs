/**
 * <ConsoleBlock level="info|warning|error">…</ConsoleBlock>
 *    → <pre class="console-block console-block--{level}">…</pre>
 */

import { visit } from 'unist-util-visit';
import { isJsxElement, getJsxAttr } from './_util.mjs';

/** @param {any} tree */
export function applyConsoleBlock(tree) {
  visit(tree, node => {
    if (!isJsxElement(node, 'ConsoleBlock')) return;
    const level = getJsxAttr(node, 'level') || 'info';
    node.type = 'mdxJsxFlowElement';
    node.name = 'pre';
    node.attributes = [{ type: 'mdxJsxAttribute', name: 'class', value: `console-block console-block--${level}` }];
  });
}
