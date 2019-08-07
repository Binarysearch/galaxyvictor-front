import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalaxyIndexComponent } from './galaxy-index.component';

describe('GalaxyIndexComponent', () => {
  let component: GalaxyIndexComponent;
  let fixture: ComponentFixture<GalaxyIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalaxyIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalaxyIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
