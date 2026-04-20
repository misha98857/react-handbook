/**
 * Builds a `https://codesandbox.io/api/v1/sandboxes/define?parameters=...`
 * URL that mirrors react.dev's "Open in CodeSandbox" button.
 *
 * The parameters payload is JSON compressed with LZ-string's
 * `compressToBase64` variant, with standard base64 re-encoded as
 * URL-safe base64 per CodeSandbox spec.
 *
 * Reference: https://codesandbox.io/docs/api/#define-api
 */
import { SandpackExample } from '../../entities/articles/models/articles';
import { compressToBase64 } from 'lz-string';

interface CsbFile {
  content: string;
  isBinary?: boolean;
}

interface CsbParameters {
  files: Record<string, CsbFile>;
  template?: string;
}

export function codeSandboxUrl(example: SandpackExample, title = 'React example'): string {
  const files: Record<string, CsbFile> = {};
  for (const [path, content] of Object.entries(example.files)) {
    // CodeSandbox expects paths without leading slash.
    const key = path.replace(/^\//, '');
    files[key] = { content };
  }

  // Add a minimal package.json so the sandbox boots even when the
  // author didn't provide one explicitly.
  if (!files['package.json']) {
    const deps = {
      react: '18.3.1',
      'react-dom': '18.3.1',
      ...example.dependencies,
    };
    files['package.json'] = {
      content: JSON.stringify(
        {
          name: slugify(title),
          version: '1.0.0',
          main: example.entry.replace(/^\//, ''),
          dependencies: deps,
          scripts: { start: 'react-scripts start', build: 'react-scripts build' },
        },
        null,
        2,
      ),
    };
  }

  // Ensure an index.html exists (required by create-react-app template).
  if (!files['public/index.html'] && !files['index.html']) {
    files['public/index.html'] = {
      content:
        '<!DOCTYPE html><html><head><meta charset="UTF-8" /><title>' +
        escapeHtml(title) +
        '</title></head><body><div id="root"></div></body></html>',
    };
  }

  const params: CsbParameters = {
    files,
    template: example.environment === 'react-ts' ? 'create-react-app-typescript' : 'create-react-app',
  };

  const compressed = compressToBase64(JSON.stringify(params))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return `https://codesandbox.io/api/v1/sandboxes/define?parameters=${compressed}&query=file=${encodeURIComponent(example.entry.replace(/^\//, ''))}`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

/**
 * True when the example depends on packages outside our local runtime's
 * whitelist (react, react-dom). Such examples fall back to the
 * CodeSandbox button.
 */
export function requiresExternalSandbox(example: SandpackExample): boolean {
  const keys = Object.keys(example.dependencies || {});
  if (keys.length === 0) return false;
  return keys.some(k => k !== 'react' && k !== 'react-dom');
}
