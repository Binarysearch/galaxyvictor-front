import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchIndexComponent } from './research-index.component';

describe('ResearchIndexComponent', () => {
  let component: ResearchIndexComponent;
  let fixture: ComponentFixture<ResearchIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResearchIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
