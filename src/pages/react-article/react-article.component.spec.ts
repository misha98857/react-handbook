import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactArticleComponent } from './react-article.component';

describe('ReactArticleComponent', () => {
    let component: ReactArticleComponent;
    let fixture: ComponentFixture<ReactArticleComponent>;

    beforeEach(async(() => {
        void TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), ReactArticleComponent],
}).compileComponents();

        fixture = TestBed.createComponent(ReactArticleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        void expect(component).toBeTruthy();
    });
});