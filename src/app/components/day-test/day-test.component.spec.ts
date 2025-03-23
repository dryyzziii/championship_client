import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayTestComponent } from './day-test.component';

describe('DayTestComponent', () => {
  let component: DayTestComponent;
  let fixture: ComponentFixture<DayTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
