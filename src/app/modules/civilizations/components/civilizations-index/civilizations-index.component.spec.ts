import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CivilizationsIndexComponent } from './civilizations-index.component';

describe('CivilizationsIndexComponent', () => {
  let component: CivilizationsIndexComponent;
  let fixture: ComponentFixture<CivilizationsIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CivilizationsIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CivilizationsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
