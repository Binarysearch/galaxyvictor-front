import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeRenderComponent } from './type-render.component';

describe('TypeRenderComponent', () => {
  let component: TypeRenderComponent;
  let fixture: ComponentFixture<TypeRenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeRenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
