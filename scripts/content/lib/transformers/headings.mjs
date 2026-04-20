/**
 * react.dev encodes explicit heading anchors as a trailing
 * slash-star-slug-star-slash marker inside the heading text
 * (the real site uses a custom component to strip it). We do the
 * same here: move the id into the heading properties and drop the
 * marker from the rendered text.
 *
 * The marker must be handled BEFORE remark-parse because the inner
 * `*slug*` is interpreted as emphasis, which splits the trailing
 * slashes into multiple siblings and defeats an mdast-level matcher.
 */
import { visit } from 'unist-util-visit';

const SOURCE_HEADING = /^(#{1,6}[^\n]*?)\s+\{\s*\/\*\s*([a-z0-9][a-z0-9-]*)\s*\*\/\s*\}\s*$/gim;
const HEADING_ID_MARKER = 'xHIDx:';

/**
 * Rewrite `## Heading /*slug*` markers in the raw MDX source to a
 * sentinel that survives remark-parse.
 * @param {string} src
 */
export function preprocessHeadingAnchors(src) {
  return src.replace(SOURCE_HEADING, (_, head, slug) => `${head} ${HEADING_ID_MARKER}${slug}`);
}

/**
 * After mdast is built, walk headings and if the last text node ends
 * with the sentinel — attach the id as hProperties and strip it.
 * @param {any} tree
 */
export function applyHeadings(tree) {
  visit(tree, 'heading', node => {
    const children = node.children || [];
    if (!children.length) return;
    const last = children[children.length - 1];
    if (!last || last.type !== 'text') return;
    const idx = last.value.lastIndexOf(HEADING_ID_MARKER);
    if (idx === -1) return;
    const id = last.value.slice(idx + HEADING_ID_MARKER.length).trim();
    last.value = last.value.slice(0, idx).replace(/\s+$/, '');
    if (!last.value) children.pop();
    if (!id) return;
    node.data = node.data || {};
    node.data.hProperties = { ...(node.data.hProperties || {}), id };
  });
}
