import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampionshipTestComponent } from './championship-test.component';

describe('ChampionshipTestComponent', () => {
  let component: ChampionshipTestComponent;
  let fixture: ComponentFixture<ChampionshipTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChampionshipTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChampionshipTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
