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

    expect(store.articleGroups()).toEqual(articles);
    httpMock.verify();
  });

  it('использует переданный язык в URL', () => {
    service.loadArticlesFile('en');
    const req = httpMock.expectOne('shared/assets/articles/react/en.articles.json');
    req.flush([]);
    httpMock.verify();
  });
});
