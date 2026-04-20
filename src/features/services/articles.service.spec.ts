import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ArticlesService } from './articles.service';
import { ArticlesStore } from '../../store/articles.store';
import { ArticleGroup } from '../../entities/articles/models/articles';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let store: InstanceType<typeof ArticlesStore>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideLocationMocks()],
    });
    service = TestBed.inject(ArticlesService);
    store = TestBed.inject(ArticlesStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('создан', () => {
    expect(service).toBeTruthy();
  });

  it('загружает articles json по языку и кладёт результат в store', () => {
    const articles: ArticleGroup[] = [
      { key: 'group1', values: [{ key: 'a', value: 'A' }] },
    ] as unknown as ArticleGroup[];

    service.loadArticlesFile('ru');

    const req = httpMock.expectOne('shared/assets/articles/react/ru.articles.json');
    expect(req.request.method).toBe('GET');
    req.flush(articles);

    const examplesReq = httpMock.expectOne('shared/assets/articles/react/ru.examples.json');
    examplesReq.flush({});

    expect(store.articleGroups()).toEqual(articles);
    httpMock.verify();
  });

  it('использует переданный язык в URL', () => {
    service.loadArticlesFile('en');
    const articlesReq = httpMock.expectOne('shared/assets/articles/react/en.articles.json');
    articlesReq.flush([]);
    const examplesReq = httpMock.expectOne('shared/assets/articles/react/en.examples.json');
    examplesReq.flush({});
    httpMock.verify();
  });

  it('загружает examples json рядом с articles', () => {
    service.loadArticlesFile('ja');
    httpMock.expectOne('shared/assets/articles/react/ja.articles.json').flush([]);
    const examplesReq = httpMock.expectOne('shared/assets/articles/react/ja.examples.json');
    expect(examplesReq.request.method).toBe('GET');
    examplesReq.flush({ 'learn-001': { files: {}, entry: '/App.js', dependencies: {}, environment: 'react' } });

    expect(store.getExample('learn-001')).toBeDefined();
    httpMock.verify();
  });

  it('игнорирует отсутствие examples json (graceful 404)', () => {
    service.loadArticlesFile('uk');
    httpMock.expectOne('shared/assets/articles/react/uk.articles.json').flush([]);
    const examplesReq = httpMock.expectOne('shared/assets/articles/react/uk.examples.json');
    examplesReq.flush('not found', { status: 404, statusText: 'Not Found' });

    // Не падает и сохраняет пустую карту examples
    expect(store.getExample('nonexistent')).toBeUndefined();
    httpMock.verify();
  });
});
