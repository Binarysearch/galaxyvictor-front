import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CivilizationRenderComponent } from './civilization-render.component';

describe('CivilizationRenderComponent', () => {
  let component: CivilizationRenderComponent;
  let fixture: ComponentFixture<CivilizationRenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CivilizationRenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CivilizationRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
