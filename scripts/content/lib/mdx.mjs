/**
 * Unified pipeline factory:
 *   MDX text → mdast → (transforms) → hast → HTML string
 *
 * We deliberately treat MDX as "markdown + JSX components". Unknown
 * JSX is rendered as best-effort HTML (tag kept, attributes kept).
 * Known components (Note/Pitfall/Sandpack/...) are intercepted by the
 * transformers in ./transformers/.
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';

import { applyCallouts } from './transformers/callouts.mjs';
import { applyCode } from './transformers/code.mjs';
import { applySandpack } from './transformers/sandpack.mjs';
import { applyConsoleBlock } from './transformers/console-block.mjs';
import { applyChallenges } from './transformers/challenges.mjs';
import { applyMisc } from './transformers/misc.mjs';
import { applyLinks } from './transformers/links.mjs';
import { applyImages } from './transformers/images.mjs';
import { applyHeadings, preprocessHeadingAnchors } from './transformers/headings.mjs';

/**
 * @typedef {Object} RenderContext
 * @property {string} locale
 * @property {string} contentPath
 * @property {import('./examples-store.mjs').ExamplesStore} examples
 * @property {Set<string>} [assetReferences]
 * @property {Set<string>} [knownSlugs]
 */

/**
 * Run the full MDX → HTML pipeline for a single page.
 *
 * @param {string} source   raw MDX (without YAML frontmatter)
 * @param {RenderContext} ctx
 * @returns {Promise<string>}
 */
export async function renderMdx(source, ctx) {
  // remark-rehype needs handlers for mdxJsx* so they survive into hast.
  // We cast every remaining JSX element into an equivalent raw HTML
  // element (name/attributes/children preserved).
  const jsxHandler = (state, node) => {
    const tagName = node.name || 'div';
    /** @type {Record<string,any>} */
    const properties = {};
    for (const attr of node.attributes || []) {
      if (attr.type !== 'mdxJsxAttribute') continue;
      if (typeof attr.value === 'string' || attr.value == null) {
        properties[attr.name] = attr.value == null ? '' : attr.value;
      }
    }
    const children = state.all(node);
    return {
      type: 'element',
      tagName,
      properties,
      children,
    };
  };

  const file = await unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkGfm)
    .use(() => tree => {
      applyHeadings(tree);
      applyCallouts(tree);
      applySandpack(tree, ctx);
      applyConsoleBlock(tree);
      applyChallenges(tree);
      applyMisc(tree);
      applyCode(tree);
      applyLinks(tree, ctx);
      applyImages(tree, ctx);
    })
    .use(remarkRehype, {
      allowDangerousHtml: true,
      handlers: {
        mdxJsxFlowElement: jsxHandler,
        mdxJsxTextElement: jsxHandler,
      },
    })
    .use(rehypeRaw)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(preprocessHeadingAnchors(source));

  return `<article>${String(file).trim()}</article>`;
}
