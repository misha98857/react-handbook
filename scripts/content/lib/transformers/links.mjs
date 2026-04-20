/**
 * Rewrite `href` on every link node (markdown `[text](url)` and raw
 * `<a href>` in HTML passthroughs) so that inter-page links stay inside
 * the Angular router namespace `/react/:slug`.
 *
 * Links that resolve to pages we don't ship (blog, community, deprecated
 * APIs, ...) are redirected to the matching absolute react.dev URL so
 * the user can follow them externally. Such links are marked with
 * `class="external-link"` and `target="_blank"`.
 *
 * External links (non-react.dev domains, mailto:, …) are kept as-is but
 * also get `external-link` class + `target="_blank"`.
 */

import { visit } from 'unist-util-visit';
import { resolveLink, externalReactDevUrl } from '../slug.mjs';

/** @param {any} tree @param {{ contentPath: string, knownSlugs?: Set<string>, locale: string }} ctx */
export function applyLinks(tree, ctx) {
  visit(tree, 'link', node => {
    const href = node.url;
    const resolved = resolveLink(href, ctx.contentPath);

    let finalUrl;
    let external = false;

    if (resolved.kind === 'fragment') {
      finalUrl = resolved.url;
    } else if (resolved.kind === 'external') {
      finalUrl = resolved.url;
      external = /^(https?:)?\/\//i.test(finalUrl);
    } else {
      // internal
      const slugOk = ctx.knownSlugs && resolved.slug && ctx.knownSlugs.has(resolved.slug);
      if (resolved.slug === '' || slugOk) {
        finalUrl = resolved.appPath + (resolved.hash ? `#${resolved.hash}` : '');
      } else {
        finalUrl = externalReactDevUrl(resolved.originalPath, resolved.hash, ctx.locale);
        external = true;
      }
    }

    node.url = finalUrl;
    if (external) {
      node.data = node.data || {};
      const existing = node.data.hProperties || {};
      const prevClass = Array.isArray(existing.className)
        ? existing.className
        : existing.className
          ? [existing.className]
          : [];
      node.data.hProperties = {
        ...existing,
        className: Array.from(new Set([...prevClass, 'external-link'])),
        target: '_blank',
        rel: 'noopener noreferrer',
      };
    }
  });
}
