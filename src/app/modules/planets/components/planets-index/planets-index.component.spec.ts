import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetsIndexComponent } from './planets-index.component';

describe('PlanetsIndexComponent', () => {
  let component: PlanetsIndexComponent;
  let fixture: ComponentFixture<PlanetsIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanetsIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanetsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
