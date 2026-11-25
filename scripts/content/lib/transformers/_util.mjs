/**
 * Tiny helpers for walking mdast-mdx JSX nodes.
 *
 * remark-mdx gives us two node types for JSX:
 *   - mdxJsxFlowElement
 *   - mdxJsxTextElement
 * Both share { name, attributes[], children[] }.
 */

export function isJsxElement(node, name) {
  if (!node) return false;
  const isJsx = node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement';
  if (!isJsx) return false;
  if (name === undefined) return true;
  if (Array.isArray(name)) return name.includes(node.name);
  return node.name === name;
}

/**
 * Read a JSX attribute value as a plain string (best-effort).
 * Returns null if the attribute is missing / dynamic / spread.
 *
 * @param {any} node
 * @param {string} attrName
 * @returns {string | null}
 */
export function getJsxAttr(node, attrName) {
  if (!node || !Array.isArray(node.attributes)) return null;
  for (const attr of node.attributes) {
    if (attr.type !== 'mdxJsxAttribute') continue;
    if (attr.name !== attrName) continue;
    if (attr.value == null) return ''; // boolean shorthand
    if (typeof attr.value === 'string') return attr.value;
    // MDX expression — not supported
    return null;
  }
  return null;
}

/**
 * Replace `node` (in-place) with the given hast-style raw HTML block.
 * We produce an `html` mdast node so rehype-raw can inline it.
 *
 * @param {any} node
 * @param {string} html
 */
export function replaceWithHtml(node, html) {
  node.type = 'html';
  node.value = html;
  delete node.children;
  delete node.attributes;
  delete node.name;
}
