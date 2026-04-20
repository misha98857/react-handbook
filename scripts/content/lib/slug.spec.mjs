import { describe, it, expect } from 'vitest';
import { toAppSlug, toAppPath, rewriteLink, resolveLink, externalReactDevUrl } from './slug.mjs';

describe('toAppSlug', () => {
  it('маппит learn/* в learn-<tail>', () => {
    expect(toAppSlug('learn/thinking-in-react')).toEqual({
      slug: 'learn-thinking-in-react',
      section: 'learn',
      tail: 'thinking-in-react',
    });
  });

  it('берёт самый длинный matching section первым', () => {
    const r = toAppSlug('reference/react-dom/client/createRoot');
    expect(r.slug).toBe('reference-react-dom-client-createRoot');
    expect(r.section).toBe('reference/react-dom/client');
  });

  it('даёт сам префикс, если tail пустой', () => {
    expect(toAppSlug('learn').slug).toBe('learn');
    expect(toAppSlug('community').slug).toBe('community');
  });

  it('top-level страницы склеивает как root', () => {
    expect(toAppSlug('versions')).toEqual({ slug: 'versions', section: 'root', tail: 'versions' });
  });

  it('нормализует лишние слеши и backslashes', () => {
    expect(toAppSlug('/learn//thinking-in-react/').slug).toBe('learn-thinking-in-react');
    expect(toAppSlug('learn\\thinking-in-react').slug).toBe('learn-thinking-in-react');
  });

  it('пустая строка даёт index', () => {
    expect(toAppSlug('').slug).toBe('index');
  });
});

describe('toAppPath', () => {
  it('префиксует /react/', () => {
    expect(toAppPath('learn-thinking-in-react')).toBe('/react/learn-thinking-in-react');
  });
});

describe('resolveLink', () => {
  const cur = 'learn/thinking-in-react';

  it('возвращает external для чужих absolute URL', () => {
    expect(resolveLink('https://example.com/foo', cur)).toEqual({
      kind: 'external',
      url: 'https://example.com/foo',
    });
  });

  it('строит internal из absolute react.dev URL', () => {
    expect(resolveLink('https://react.dev/learn/state-a-components-memory', cur)).toMatchObject({
      kind: 'internal',
      appPath: '/react/learn-state-a-components-memory',
      originalPath: 'learn/state-a-components-memory',
    });
  });

  it('поддерживает локализованные react.dev хосты', () => {
    expect(resolveLink('https://ru.react.dev/learn', cur)).toMatchObject({
      kind: 'internal',
      appPath: '/react/learn',
      originalPath: 'learn',
    });
  });

  it('чисто fragment-ссылка → kind fragment', () => {
    expect(resolveLink('#usage', cur)).toEqual({ kind: 'fragment', url: '#usage', hash: 'usage' });
  });

  it('mailto: → external', () => {
    expect(resolveLink('mailto:x@y.z', cur)).toEqual({ kind: 'external', url: 'mailto:x@y.z' });
  });

  it('root-relative путь режется и мапится', () => {
    expect(resolveLink('/reference/react/useState#parameters', cur)).toMatchObject({
      kind: 'internal',
      appPath: '/react/reference-react-useState',
      hash: 'parameters',
      originalPath: 'reference/react/useState',
    });
  });

  it('root-only "/" → index /react', () => {
    expect(resolveLink('/', cur)).toMatchObject({ kind: 'internal', appPath: '/react', originalPath: '' });
  });

  it('section-prefixed relative ссылки без / ведущего', () => {
    expect(resolveLink('reference/react/useEffect', cur)).toMatchObject({
      kind: 'internal',
      appPath: '/react/reference-react-useEffect',
      originalPath: 'reference/react/useEffect',
    });
  });

  it('resolves sibling relative из текущей страницы', () => {
    expect(resolveLink('state-a-components-memory', cur)).toMatchObject({
      kind: 'internal',
      appPath: '/react/learn-state-a-components-memory',
      originalPath: 'learn/state-a-components-memory',
    });
  });

  it('../ поднимается на уровень выше', () => {
    expect(resolveLink('../versions', 'learn/thinking-in-react')).toMatchObject({
      kind: 'internal',
      appPath: '/react/versions',
      originalPath: 'versions',
    });
  });

  it('пустой href → external без url', () => {
    expect(resolveLink('', cur)).toEqual({ kind: 'external', url: '' });
  });
});

describe('rewriteLink', () => {
  it('возвращает appPath + #hash для internal', () => {
    expect(rewriteLink('/reference/react/useState#parameters', 'learn/x')).toBe(
      '/react/reference-react-useState#parameters',
    );
  });

  it('пропускает external URLs без изменений', () => {
    expect(rewriteLink('https://example.com', 'learn/x')).toBe('https://example.com');
  });

  it('пропускает fragment-only', () => {
    expect(rewriteLink('#top', 'learn/x')).toBe('#top');
  });
});

describe('externalReactDevUrl', () => {
  it('для en использует react.dev без префикса', () => {
    expect(externalReactDevUrl('blog/2024-04-25-react-19', '', 'en')).toBe(
      'https://react.dev/blog/2024-04-25-react-19',
    );
  });

  it('для локали добавляет поддомен', () => {
    expect(externalReactDevUrl('community', '', 'ru')).toBe('https://ru.react.dev/community');
    expect(externalReactDevUrl('learn', 'setup', 'zh-hans')).toBe('https://zh-hans.react.dev/learn#setup');
  });

  it('пустой путь → корень домена', () => {
    expect(externalReactDevUrl('', '', 'en')).toBe('https://react.dev');
  });

  it('ведущий слеш нормализуется', () => {
    expect(externalReactDevUrl('/blog', '', 'en')).toBe('https://react.dev/blog');
  });
});
