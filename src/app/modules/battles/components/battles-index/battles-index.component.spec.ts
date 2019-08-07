import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattlesIndexComponent } from './battles-index.component';

describe('BattlesIndexComponent', () => {
  let component: BattlesIndexComponent;
  let fixture: ComponentFixture<BattlesIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattlesIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattlesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
