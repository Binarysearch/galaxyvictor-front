import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCivilizationComponent } from './create-civilization.component';

describe('CreateCivilizationComponent', () => {
  let component: CreateCivilizationComponent;
  let fixture: ComponentFixture<CreateCivilizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCivilizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCivilizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
