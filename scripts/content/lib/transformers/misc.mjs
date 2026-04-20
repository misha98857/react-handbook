/**
 * Catch-all for less structured react.dev components.
 *
 * Anything we don't explicitly rewrite survives because remark-rehype
 * copies MDX JSX through as HTML (for lowercase tag names) or drops it
 * (for unknown capitalized tags). Listed components here are either
 * renamed to a safe lowercase tag, unwrapped, or dropped outright.
 */

import { visit } from 'unist-util-visit';
import { isJsxElement, getJsxAttr, replaceWithHtml } from './_util.mjs';

/** @param {any} tree */
export function applyMisc(tree) {
  visit(tree, (node, index, parent) => {
    if (!isJsxElement(node)) return;

    switch (node.name) {
      // Decorative — drop entirely
      case 'HomepageHero':
      case 'TinkerWithReact':
      case 'BlogCard':
      case 'CommunityExamples':
      case 'MeetTheTeam':
      case 'TeamMember':
      case 'AcknowledgementList':
      case 'TranslationsSnippet':
      case 'Videos':
      case 'TwitterEmbed':
      case 'IframeEmbed':
        replaceWithHtml(node, '');
        return;

      // Unwrap — just render children inline
      case 'MaxWidth':
      case 'Center':
      case 'Full':
      case 'Illustration': {
        if (parent && typeof index === 'number') {
          parent.children.splice(index, 1, ...(node.children || []));
        }
        return;
      }

      case 'LearnMore': {
        const href = getJsxAttr(node, 'path') || getJsxAttr(node, 'href');
        const label = textOf(node) || 'Learn more';
        if (href) {
          replaceWithHtml(node, `<p class="learn-more"><a href="${escapeHtml(href)}">${escapeHtml(label)} →</a></p>`);
        } else {
          replaceWithHtml(node, `<p class="learn-more">${escapeHtml(label)}</p>`);
        }
        return;
      }

      case 'TerminalBlock': {
        const lvl = getJsxAttr(node, 'level') || 'info';
        node.type = 'mdxJsxFlowElement';
        node.name = 'pre';
        node.attributes = [{ type: 'mdxJsxAttribute', name: 'class', value: `terminal-block terminal-block--${lvl}` }];
        return;
      }

      case 'Recap':
      case 'Recipes':
      case 'Recipe': {
        node.type = 'mdxJsxFlowElement';
        node.name = 'section';
        node.attributes = [{ type: 'mdxJsxAttribute', name: 'class', value: node.name.toLowerCase() }];
        return;
      }

      case 'APIAnatomy':
      case 'AnatomyStep':
      case 'Diagram':
      case 'DiagramGroup': {
        node.type = 'mdxJsxFlowElement';
        node.name = 'figure';
        node.attributes = [{ type: 'mdxJsxAttribute', name: 'class', value: node.name.toLowerCase() }];
        return;
      }

      default:
        // Unknown capitalized tag — leave to fallback rules below.
        break;
    }

    // Fallback: if we see any remaining capitalized JSX tag, turn it into
    // a <div class="jsx-<name>"> so nothing visible is lost. Unknown
    // lowercase tags (e.g. <sup>, <kbd>) pass through untouched.
    if (/^[A-Z]/.test(node.name || '')) {
      const className = `jsx-${node.name.toLowerCase()}`;
      node.type = 'mdxJsxFlowElement';
      node.name = 'div';
      const existing = (node.attributes || []).filter(a => a.type === 'mdxJsxAttribute');
      const kept = existing.filter(a => a.name !== 'class');
      node.attributes = [{ type: 'mdxJsxAttribute', name: 'class', value: className }, ...kept];
    }
  });
}

function textOf(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value;
  if (Array.isArray(node.children)) return node.children.map(textOf).join('');
  return '';
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
}
