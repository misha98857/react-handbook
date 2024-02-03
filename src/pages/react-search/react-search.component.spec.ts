import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactSearchComponent } from './react-search.component';

describe('ReactSearchComponent', () => {
    let component: ReactSearchComponent;
    let fixture: ComponentFixture<ReactSearchComponent>;

    beforeEach(async(() => {
        void TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), ReactSearchComponent],
}).compileComponents();

        fixture = TestBed.createComponent(ReactSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        void expect(component).toBeTruthy();
    });
});
