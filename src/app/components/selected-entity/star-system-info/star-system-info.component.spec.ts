import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarSystemInfoComponent } from './star-system-info.component';

describe('StarSystemInfoComponent', () => {
  let component: StarSystemInfoComponent;
  let fixture: ComponentFixture<StarSystemInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarSystemInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarSystemInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
