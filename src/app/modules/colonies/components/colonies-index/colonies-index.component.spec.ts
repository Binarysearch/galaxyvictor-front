import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColoniesIndexComponent } from './colonies-index.component';

describe('ColoniesIndexComponent', () => {
  let component: ColoniesIndexComponent;
  let fixture: ComponentFixture<ColoniesIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColoniesIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColoniesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
