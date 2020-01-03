import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusRenderComponent } from './status-render.component';

describe('StatusRenderComponent', () => {
  let component: StatusRenderComponent;
  let fixture: ComponentFixture<StatusRenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusRenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
