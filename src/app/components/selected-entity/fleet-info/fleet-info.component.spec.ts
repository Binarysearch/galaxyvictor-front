import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetInfoComponent } from './fleet-info.component';

describe('FleetInfoComponent', () => {
  let component: FleetInfoComponent;
  let fixture: ComponentFixture<FleetInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
