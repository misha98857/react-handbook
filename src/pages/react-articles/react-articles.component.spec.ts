import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactArticlesComponent } from './react-articles.component';

describe('ReactArticlesComponent', () => {
    let component: ReactArticlesComponent;
    let fixture: ComponentFixture<ReactArticlesComponent>;

    beforeEach(async(() => {
        void TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), ReactArticlesComponent],
}).compileComponents();

        fixture = TestBed.createComponent(ReactArticlesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        void expect(component).toBeTruthy();
    });
});
