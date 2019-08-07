import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeIndexComponent } from './trade-index.component';

describe('TradeIndexComponent', () => {
  let component: TradeIndexComponent;
  let fixture: ComponentFixture<TradeIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
