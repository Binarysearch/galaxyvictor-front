import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarSystemRenderComponent } from './star-system-render.component';

describe('StarSystemRenderComponent', () => {
  let component: StarSystemRenderComponent;
  let fixture: ComponentFixture<StarSystemRenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarSystemRenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarSystemRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
