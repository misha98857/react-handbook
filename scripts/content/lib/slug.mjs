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
  const r = resolveLink(href, currentContentPath);
  if (r.kind === 'internal') return r.appPath + (r.hash ? `#${r.hash}` : '');
  return r.url;
}

/**
 * Like rewriteLink but returns a structured result:
 *   - kind:'internal' with appPath/hash/originalPath — resolved to /react/:slug
 *   - kind:'external' with url — passthrough (mailto:, https://..., etc.)
 *   - kind:'fragment' with hash — pure #fragment
 *
 * Callers can inspect originalPath (the react.dev-style path like
 * "learn/thinking-in-react") to decide whether the internal page is
 * actually built, and fall back to an absolute react.dev URL if not.
 *
 * @param {string} href
 * @param {string} currentContentPath
 * @returns {
 *   { kind:'internal', appPath:string, hash:string, originalPath:string, slug:string } |
 *   { kind:'external', url:string } |
 *   { kind:'fragment', url:string, hash:string }
 * }
 */
export function resolveLink(href, currentContentPath) {
  if (!href) return { kind: 'external', url: href };

  // absolute external (non-react.dev)
  if (/^(https?:)?\/\//i.test(href) && !/^https?:\/\/(?:\w+\.)?react\.dev/i.test(href)) {
    return { kind: 'external', url: href };
  }
  let work = href.replace(/^https?:\/\/(?:\w+\.)?react\.dev/i, '');

  // pure fragment
  if (work.startsWith('#')) return { kind: 'fragment', url: work, hash: work.slice(1) };

  // mailto:, tel:, ...
  if (/^[a-z]+:/i.test(work)) return { kind: 'external', url: work };

  // root-relative
  if (work.startsWith('/')) {
    const [pathname, hash = ''] = work.split('#');
    const trimmed = pathname.replace(/^\/+|\/+$/g, '');
    if (!trimmed) {
      return { kind: 'internal', appPath: '/react', hash, originalPath: '', slug: '' };
    }
    const mapped = toAppSlug(trimmed);
    return {
      kind: 'internal',
      appPath: toAppPath(mapped.slug),
      hash,
      originalPath: trimmed,
      slug: mapped.slug,
    };
  }

  const [pathname, hash = ''] = work.split('#');

  // Section-prefixed "relative" shorthand in react.dev MDX.
  for (const [section] of SECTION_ENTRIES) {
    if (pathname === section || pathname.startsWith(section + '/')) {
      const mapped = toAppSlug(pathname);
      return {
        kind: 'internal',
        appPath: toAppPath(mapped.slug),
        hash,
        originalPath: pathname,
        slug: mapped.slug,
      };
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
  return {
    kind: 'internal',
    appPath: toAppPath(mapped.slug),
    hash,
    originalPath: resolved,
    slug: mapped.slug,
  };
}

/**
 * Build an absolute react.dev URL for a given source path + locale.
 * Used as a fallback for links that point to pages we don't ship
 * (blog, community, deprecated APIs, …).
 *
 * @param {string} originalPath e.g. "blog/2024-04-25-react-19"
 * @param {string} hash         fragment without leading '#'
 * @param {string} locale       e.g. "en", "ru", "zh-hans"
 */
export function externalReactDevUrl(originalPath, hash, locale) {
  const host = locale === 'en' ? 'react.dev' : `${locale}.react.dev`;
  const pathname = originalPath ? `/${originalPath.replace(/^\/+/, '')}` : '';
  return `https://${host}${pathname}${hash ? `#${hash}` : ''}`;
}
