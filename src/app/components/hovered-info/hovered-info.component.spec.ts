import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoveredInfoComponent } from './hovered-info.component';

describe('HoveredInfoComponent', () => {
  let component: HoveredInfoComponent;
  let fixture: ComponentFixture<HoveredInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoveredInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoveredInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
