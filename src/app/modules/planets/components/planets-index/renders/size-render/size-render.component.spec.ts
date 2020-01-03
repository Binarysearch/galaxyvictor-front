import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeRenderComponent } from './size-render.component';

describe('SizeRenderComponent', () => {
  let component: SizeRenderComponent;
  let fixture: ComponentFixture<SizeRenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SizeRenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SizeRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
