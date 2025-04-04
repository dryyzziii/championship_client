import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTestComponent } from './user-test.component';

describe('UserTestComponent', () => {
  let component: UserTestComponent;
  let fixture: ComponentFixture<UserTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
