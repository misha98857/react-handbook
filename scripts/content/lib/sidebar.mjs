/**
 * Flatten react.dev's sidebarLearn/sidebarReference JSON into a linear list
 * of pages per section with { title, groupTitle, contentPath, section }.
 *
 * Each sidebar.json is a tree:
 *  {
 *    "title": "...",
 *    "path": "/learn",
 *    "routes": [
 *      { "title": "Quick Start", "path": "/learn",
 *        "routes": [ { "title": "...", "path": "/learn/thinking-in-react" } ] }
 *    ]
 *  }
 */

/**
 * @typedef {Object} SidebarPage
 * @property {string} title        visible article title
 * @property {string} groupTitle   visible group title (for the menu)
 * @property {string} contentPath  path under src/content/ without extension
 *                                 e.g. "learn/thinking-in-react"
 * @property {string} section      "learn" | "reference/react" | ...
 * @property {number} order        absolute ordinal within the section
 */

/**
 * @param {any} node
 * @returns {string | null}
 */
function pathOf(node) {
  if (!node || typeof node !== 'object') return null;
  const p = node.path || node.href || null;
  return typeof p === 'string' ? p : null;
}

/**
 * Walk a sidebar tree recursively.
 *
 * @param {any} node
 * @param {string} currentGroupTitle
 * @param {SidebarPage[]} out
 */
function walk(node, currentGroupTitle, out) {
  if (!node || typeof node !== 'object') return;
  const p = pathOf(node);
  const title = node.title || '';

  // This node is a leaf page if it has a path AND either no routes
  // or it has routes but is itself a real content page.
  const hasRoutes = Array.isArray(node.routes) && node.routes.length > 0;

  if (p && !hasRoutes) {
    // leaf
    const contentPath = p.replace(/^\/+/, '');
    if (contentPath) {
      out.push({
        title,
        groupTitle: currentGroupTitle || title,
        contentPath,
        section: '', // filled in by caller
        order: out.length,
      });
    }
    return;
  }

  // branch — its own path (if any) is usually the "overview" page for the group
  if (p) {
    const contentPath = p.replace(/^\/+/, '');
    if (contentPath) {
      out.push({
        title,
        groupTitle: currentGroupTitle || title,
        contentPath,
        section: '',
        order: out.length,
      });
    }
  }

  if (hasRoutes) {
    const nextGroup = title || currentGroupTitle;
    for (const child of node.routes) walk(child, nextGroup, out);
  }
}

/**
 * @param {any} sidebarJson  parsed sidebar*.json
 * @param {string} section   section key ("learn", "reference/react", ...)
 * @returns {SidebarPage[]}
 */
export function flattenSidebar(sidebarJson, section) {
  /** @type {SidebarPage[]} */
  const pages = [];
  const routes = Array.isArray(sidebarJson?.routes) ? sidebarJson.routes : [];
  for (const child of routes) walk(child, sidebarJson.title || '', pages);

  // Deduplicate by contentPath, keep first occurrence
  const seen = new Set();
  const deduped = [];
  for (const p of pages) {
    if (seen.has(p.contentPath)) continue;
    seen.add(p.contentPath);
    p.section = section;
    deduped.push(p);
  }
  deduped.forEach((p, i) => (p.order = i));
  return deduped;
}
