import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFrameComponent } from './modal-frame.component';

describe('ModalFrameComponent', () => {
  let component: ModalFrameComponent;
  let fixture: ComponentFixture<ModalFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
