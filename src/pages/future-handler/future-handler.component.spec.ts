import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FutureHandlerComponent } from './future-handler.component';
import { IonicModule } from '@ionic/angular';

describe('FutureHandlerComponent', () => {
    let component: FutureHandlerComponent;
    let fixture: ComponentFixture<FutureHandlerComponent>;

    beforeEach(async(() => {
        void TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), FutureHandlerComponent],
}).compileComponents();

        fixture = TestBed.createComponent(FutureHandlerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        void expect(component).toBeTruthy();
    });
});
