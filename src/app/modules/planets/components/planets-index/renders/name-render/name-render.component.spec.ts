import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NameRenderComponent } from './name-render.component';

describe('NameRenderComponent', () => {
  let component: NameRenderComponent;
  let fixture: ComponentFixture<NameRenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NameRenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
