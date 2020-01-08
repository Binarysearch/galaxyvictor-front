import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentralWindowComponent } from './central-window.component';

describe('CentralWindowComponent', () => {
  let component: CentralWindowComponent;
  let fixture: ComponentFixture<CentralWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentralWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentralWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
