/**
 * Slug / path helpers. Keeps the Angular router happy: we stay on
 * `/react/:name`, so a two-level URL like `/learn/thinking-in-react`
 * becomes `/react/learn-thinking-in-react`.
 */

/**
 * Section prefix order must remain stable because prev/next nav relies on it.
 * @type {Record<string, string>}
 */
export const SECTION_PREFIX = {
  learn: 'learn',
  'reference/react': 'reference-react',
  'reference/react-dom': 'reference-react-dom',
  'reference/react-dom/client': 'reference-react-dom-client',
  'reference/react-dom/server': 'reference-react-dom-server',
  'reference/react-dom/static': 'reference-react-dom-static',
  'reference/react-compiler': 'reference-react-compiler',
  'reference/rsc': 'reference-rsc',
  'reference/rules': 'reference-rules',
  blog: 'blog',
  community: 'community',
};

const SECTION_ENTRIES = Object.entries(SECTION_PREFIX).sort(
  // longest first so `reference/react-dom/client` wins over `reference/react-dom`
  ([a], [b]) => b.length - a.length,
);

/**
 * Convert a react.dev content path (e.g. "learn/thinking-in-react" or
 * "reference/react/useState") into the app-internal slug used as the
 * `:name` router param.
 *
 * @param {string} contentPath  path under `src/content/` without extension
 * @returns {{ slug: string, section: string, tail: string } | null}
 */
export function toAppSlug(contentPath) {
  const clean = contentPath.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
  for (const [section, prefix] of SECTION_ENTRIES) {
    if (clean === section || clean.startsWith(section + '/')) {
      const tail = clean.slice(section.length).replace(/^\/+/, '');
      const slug = tail ? `${prefix}-${tail.replace(/\//g, '-')}` : prefix;
      return { slug, section, tail };
    }
  }
  // top-level pages (home, versions, ...): keep as-is
  return { slug: clean.replace(/\//g, '-') || 'index', section: 'root', tail: clean };
}

/**
 * @param {string} slug
 * @returns {string} e.g. "/react/learn-thinking-in-react"
 */
export function toAppPath(slug) {
  return `/react/${slug}`;
}

/**
 * Rewrite an in-site link found in MDX into an app-internal path.
 * Handles absolute react.dev links, root-relative links and fragment-only
 * links. Returns the original href for truly external links.
 *
 * @param {string} href
 * @param {string} currentContentPath  e.g. "learn/thinking-in-react"
 * @returns {string}
 */
export function rewriteLink(href, currentContentPath) {
  if (!href) return href;
  // absolute external
  if (/^(https?:)?\/\//i.test(href) && !/^https?:\/\/(?:\w+\.)?react\.dev/i.test(href)) {
    return href;
  }
  let work = href.replace(/^https?:\/\/(?:\w+\.)?react\.dev/i, '');

  // pure fragment stays as-is (handled by the in-app scroll logic)
  if (work.startsWith('#')) return work;

  // mailto:, tel:, etc
  if (/^[a-z]+:/i.test(work)) return work;

  // root-relative: "/learn/..." or "/reference/..."
  if (work.startsWith('/')) {
    const [pathname, hash = ''] = work.split('#');
    const trimmed = pathname.replace(/^\/+|\/+$/g, '');
    if (!trimmed) return '/react';
    const mapped = toAppSlug(trimmed);
    return mapped ? toAppPath(mapped.slug) + (hash ? `#${hash}` : '') : work;
  }

  // relative ("./foo", "bar", "../baz") — resolve against current page dir
  const [pathname, hash = ''] = work.split('#');

  // If a "relative" link happens to start with a known section prefix
  // (authoring shorthand in react.dev MDX), treat it as root-relative.
  for (const [section] of SECTION_ENTRIES) {
    if (pathname === section || pathname.startsWith(section + '/')) {
      const mapped = toAppSlug(pathname);
      return mapped ? toAppPath(mapped.slug) + (hash ? `#${hash}` : '') : work;
    }
  }

  const baseDir = currentContentPath.split('/').slice(0, -1);
  const parts = pathname.split('/');
  for (const part of parts) {
    if (part === '' || part === '.') continue;
    if (part === '..') baseDir.pop();
    else baseDir.push(part);
  }
  const resolved = baseDir.join('/');
  const mapped = toAppSlug(resolved);
  return mapped ? toAppPath(mapped.slug) + (hash ? `#${hash}` : '') : work;
}
