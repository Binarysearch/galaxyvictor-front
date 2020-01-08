import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetExchangeWindowComponent } from './fleet-exchange-window.component';

describe('FleetExchangeWindowComponent', () => {
  let component: FleetExchangeWindowComponent;
  let fixture: ComponentFixture<FleetExchangeWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetExchangeWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetExchangeWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
