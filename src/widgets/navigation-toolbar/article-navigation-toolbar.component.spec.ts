import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleNavigationToolbarComponent } from './article-navigation-toolbar.component';

describe('NavigationToolbarComponent', () => {
  let component: ArticleNavigationToolbarComponent;
  let fixture: ComponentFixture<ArticleNavigationToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleNavigationToolbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArticleNavigationToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
