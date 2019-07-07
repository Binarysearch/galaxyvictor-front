import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndpointListComponent } from './endpoint-list.component';
import { of } from 'rxjs';
import { EndPointService } from '../../../../services/end-point.service';

describe('EndpointListComponent', () => {
  let component: EndpointListComponent;
  let fixture: ComponentFixture<EndpointListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndpointListComponent ],
      providers: [
        { provide: EndPointService, useValue: { getApiInfo(){ return of() } } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndpointListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
