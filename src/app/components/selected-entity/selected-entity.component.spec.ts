import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedEntityComponent } from './selected-entity.component';

describe('SelectedEntityComponent', () => {
  let component: SelectedEntityComponent;
  let fixture: ComponentFixture<SelectedEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
