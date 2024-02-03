import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FutureHandlerComponent } from './future-handler.component';

describe('FutureHandlerComponent', () => {
    let component: FutureHandlerComponent;
    let fixture: ComponentFixture<FutureHandlerComponent>;

    beforeEach(async(() => {
        void TestBed.configureTestingModule({
            declarations: [FutureHandlerComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(FutureHandlerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        void expect(component).toBeTruthy();
    });
});
