import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetsIndexComponent } from './fleets-index.component';

describe('FleetsIndexComponent', () => {
  let component: FleetsIndexComponent;
  let fixture: ComponentFixture<FleetsIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetsIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
