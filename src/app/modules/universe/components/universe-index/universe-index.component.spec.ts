import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniverseIndexComponent } from './universe-index.component';

describe('UniverseIndexComponent', () => {
  let component: UniverseIndexComponent;
  let fixture: ComponentFixture<UniverseIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniverseIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniverseIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
