import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguagesMenuComponent } from './languages-menu.component';

describe('LanguagesMenuComponent', () => {
  let component: LanguagesMenuComponent;
  let fixture: ComponentFixture<LanguagesMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [LanguagesMenuComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguagesMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
