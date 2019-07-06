import { TestBed } from '@angular/core/testing';

import { EndPointService } from './end-point.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('EndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [{ provide: HttpClient, useValue: { get(){ return of('host') } } }]
  }));

  it('should be created', () => {
    const service: EndPointService = TestBed.get(EndPointService);
    expect(service).toBeTruthy();
  });
});
