import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactHtmlArticleComponent } from './react-html-article.component';

describe('HtmlArticleComponent', () => {
    let component: ReactHtmlArticleComponent;
    let fixture: ComponentFixture<ReactHtmlArticleComponent>;

    beforeEach(async(() => {
        void TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), ReactHtmlArticleComponent],
}).compileComponents();

        fixture = TestBed.createComponent(ReactHtmlArticleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        void expect(component).toBeTruthy();
    });
});
