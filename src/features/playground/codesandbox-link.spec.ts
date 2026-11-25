import { describe, expect, it } from 'vitest';
import { decompressFromBase64 } from 'lz-string';
import { SandpackExample } from '../../entities/articles/models/articles';
import { codeSandboxUrl, requiresExternalSandbox } from './codesandbox-link';

function decodeParams(url: string): { files: Record<string, { content: string }>; template?: string } {
  const match = url.match(/parameters=([^&]+)/);
  if (!match) throw new Error('parameters not found in url');
  // Revert URL-safe base64 -> standard base64.
  const b64 = match[1].replace(/-/g, '+').replace(/_/g, '/');
  const json = decompressFromBase64(b64);
  return JSON.parse(json);
}

describe('codeSandboxUrl', () => {
  const baseExample: SandpackExample = {
    files: { '/App.js': 'export default () => <h1>Hi</h1>;' },
    entry: '/App.js',
    dependencies: {},
    environment: 'react',
  };

  it('собирает URL на CodeSandbox define API', () => {
    const url = codeSandboxUrl(baseExample);
    expect(url).toMatch(/^https:\/\/codesandbox\.io\/api\/v1\/sandboxes\/define\?parameters=/);
    expect(url).toContain('query=file=App.js');
  });

  it('удаляет ведущий слеш из путей файлов', () => {
    const params = decodeParams(codeSandboxUrl(baseExample));
    expect(Object.keys(params.files)).toContain('App.js');
    expect(Object.keys(params.files)).not.toContain('/App.js');
  });

  it('добавляет package.json с react и react-dom, если не указан', () => {
    const params = decodeParams(codeSandboxUrl(baseExample, 'Thinking in React'));
    const pkg = JSON.parse(params.files['package.json'].content);
    expect(pkg.dependencies.react).toBeDefined();
    expect(pkg.dependencies['react-dom']).toBeDefined();
    expect(pkg.main).toBe('App.js');
    expect(pkg.name).toBe('thinking-in-react');
  });

  it('мёржит пользовательские зависимости в сгенерированный package.json', () => {
    const params = decodeParams(codeSandboxUrl({ ...baseExample, dependencies: { 'react-router-dom': '6.0.0' } }));
    const pkg = JSON.parse(params.files['package.json'].content);
    expect(pkg.dependencies['react-router-dom']).toBe('6.0.0');
    expect(pkg.dependencies.react).toBeDefined();
  });

  it('не перезаписывает package.json, если он уже передан', () => {
    const custom = JSON.stringify({ name: 'custom', dependencies: { react: '19.0.0' } });
    const example: SandpackExample = {
      ...baseExample,
      files: { '/App.js': 'x', '/package.json': custom },
    };
    const params = decodeParams(codeSandboxUrl(example));
    expect(params.files['package.json'].content).toBe(custom);
  });

  it('добавляет минимальный public/index.html, если его нет', () => {
    const params = decodeParams(codeSandboxUrl(baseExample, 'Some & "Title"'));
    expect(params.files['public/index.html']).toBeDefined();
    // HTML-escape проверка заголовка
    expect(params.files['public/index.html'].content).toContain('Some &amp; &quot;Title&quot;');
    expect(params.files['public/index.html'].content).toContain('<div id="root">');
  });

  it('не добавляет index.html, если автор его уже предоставил', () => {
    const example: SandpackExample = {
      ...baseExample,
      files: { '/App.js': 'x', '/index.html': '<!doctype html><html>x</html>' },
    };
    const params = decodeParams(codeSandboxUrl(example));
    expect(params.files['public/index.html']).toBeUndefined();
    expect(params.files['index.html']).toBeDefined();
  });

  it('выбирает ts-шаблон для environment=react-ts', () => {
    const params = decodeParams(codeSandboxUrl({ ...baseExample, environment: 'react-ts' }));
    expect(params.template).toBe('create-react-app-typescript');
  });

  it('выбирает js-шаблон для environment=react', () => {
    const params = decodeParams(codeSandboxUrl(baseExample));
    expect(params.template).toBe('create-react-app');
  });
});

describe('requiresExternalSandbox', () => {
  it('false для примеров без зависимостей', () => {
    const example: SandpackExample = {
      files: { '/App.js': 'x' },
      entry: '/App.js',
      dependencies: {},
      environment: 'react',
    };
    expect(requiresExternalSandbox(example)).toBe(false);
  });

  it('false для примеров с только react/react-dom', () => {
    const example: SandpackExample = {
      files: { '/App.js': 'x' },
      entry: '/App.js',
      dependencies: { react: '18.3.1', 'react-dom': '18.3.1' },
      environment: 'react',
    };
    expect(requiresExternalSandbox(example)).toBe(false);
  });

  it('true, если есть внешняя зависимость', () => {
    const example: SandpackExample = {
      files: { '/App.js': 'x' },
      entry: '/App.js',
      dependencies: { react: '18.3.1', immer: '10.0.0' },
      environment: 'react',
    };
    expect(requiresExternalSandbox(example)).toBe(true);
  });

  it('устойчив к отсутствию поля dependencies', () => {
    const example = {
      files: { '/App.js': 'x' },
      entry: '/App.js',
      environment: 'react',
    } as unknown as SandpackExample;
    expect(requiresExternalSandbox(example)).toBe(false);
  });
});
