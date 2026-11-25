import { TestBed } from '@angular/core/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ArticlesStore } from './articles.store';
import { ArticleGroup } from '../entities/articles/models/articles';

const groups: ArticleGroup[] = [
  {
    key: 'hooks',
    values: [
      { key: 'usestate', value: 'useState', path: '/hooks/usestate', nav: [] },
      { key: 'useeffect', value: 'useEffect', path: '/hooks/useeffect', nav: [] },
    ],
  },
  {
    key: 'components',
    values: [{ key: 'fragment', value: 'Fragment', path: '/components/fragment', nav: [] }],
  },
];

describe('ArticlesStore', () => {
  let store: InstanceType<typeof ArticlesStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideLocationMocks()],
    });
    store = TestBed.inject(ArticlesStore);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('инициализируется значениями по умолчанию', () => {
    expect(store.articleGroups()).toEqual([]);
    expect(store.searchText()).toBe('');
    expect(store.urlPath()).toBe('/react');
    expect(store.fragment()).toBe('');
  });

  it('updateArticleGroups через rxMethod кладёт массив в state', () => {
    const subject = new Subject<ArticleGroup[]>();
    store.updateArticleGroups(subject);
    subject.next(groups);
    expect(store.articleGroups()).toEqual(groups);
  });

  it('updateSearchText обновляет строку поиска', () => {
    store.updateSearchText('use');
    expect(store.searchText()).toBe('use');
  });

  it('searchedArticles возвращает все группы при пустом поиске (всё совпадает с пустой строкой)', () => {
    const subject = new Subject<ArticleGroup[]>();
    store.updateArticleGroups(subject);
    subject.next(groups);
    expect(store.searchedArticles()).toEqual(groups);
  });

  it('searchedArticles фильтрует по value/key статей и убирает пустые группы', () => {
    const subject = new Subject<ArticleGroup[]>();
    store.updateArticleGroups(subject);
    subject.next(groups);
    store.updateSearchText('useState');

    const result = store.searchedArticles();
    expect(result).toHaveLength(1);
    expect(result[0].key).toBe('hooks');
    expect(result[0].values).toHaveLength(1);
    expect(result[0].values[0].value).toBe('useState');
  });

  it('searchedArticles ищет по ключу статьи', () => {
    const subject = new Subject<ArticleGroup[]>();
    store.updateArticleGroups(subject);
    subject.next(groups);
    store.updateSearchText('fragment');

    const result = store.searchedArticles();
    expect(result).toHaveLength(1);
    expect(result[0].key).toBe('components');
  });

  it('обновляет urlPath/fragment по подписке на Location.onUrlChange', () => {
    const location = TestBed.inject(Location);
    location.go('/hooks/usestate', '', null);
    location.go('/hooks/useeffect#examples', '', null);
    expect(store.urlPath()).toBe('/hooks/useeffect');
    expect(store.fragment()).toBe('examples');
  });
});
