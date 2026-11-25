/**
 * In-memory store for <Sandpack> examples extracted from MDX.
 * Serialised to `<lang>.examples.json` at the end of a build.
 */

export class ExamplesStore {
  constructor(locale) {
    this.locale = locale;
    /** @type {Record<string, any>} */
    this.byId = {};
    this._counter = 0;
  }

  /**
   * @param {{ files: Record<string,string>, entry: string, dependencies?: Record<string,string>, environment?: string }} example
   * @param {string} contentPath
   * @returns {string} generated id
   */
  add(example, contentPath) {
    const pageKey = contentPath.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    const id = `${pageKey}-${String(++this._counter).padStart(3, '0')}`;
    this.byId[id] = example;
    return id;
  }

  toJSON() {
    return this.byId;
  }
}
