import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevelopIndexComponent } from './develop-index.component';
import { EndPointService } from '../../../../services/end-point.service';
import { of } from 'rxjs';

describe('DevelopIndexComponent', () => {
  let component: DevelopIndexComponent;
  let fixture: ComponentFixture<DevelopIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevelopIndexComponent ],
      providers: [
        { provide: EndPointService, useValue: { getAppInfo(){ return of() } } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevelopIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
