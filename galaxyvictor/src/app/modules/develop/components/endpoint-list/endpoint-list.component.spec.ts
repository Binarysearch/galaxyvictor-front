import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndpointListComponent } from './endpoint-list.component';
import { of } from 'rxjs';
import { EndPointService, ApiInfo } from '../../../../services/end-point.service';
import { CrudTablesModule } from '@binarysearch/crud-tables';

describe('EndpointListComponent', () => {
  let component: EndpointListComponent;
  let fixture: ComponentFixture<EndpointListComponent>;
  
  const FAKE_API_INFO: ApiInfo = {
    apiVersion: '2.0.0',
    endpoints: [
      { id: 'id-1', path: 'path-1'}
    ]
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndpointListComponent ],
      imports: [ CrudTablesModule ],
      providers: [
        { provide: EndPointService, useValue: { getApiInfo(){ return of(FAKE_API_INFO) } } }
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
