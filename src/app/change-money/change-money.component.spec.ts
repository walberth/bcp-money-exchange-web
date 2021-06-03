import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeMoneyComponent } from './change-money.component';

describe('ChangeMoneyComponent', () => {
  let component: ChangeMoneyComponent;
  let fixture: ComponentFixture<ChangeMoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeMoneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
