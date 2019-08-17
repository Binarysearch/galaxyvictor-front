import { TestBed } from '@angular/core/testing';

import { StarSystemsService } from './star-systems.service';
import { ApiService } from './api.service';
import { of } from 'rxjs';

describe('StarSystemsService', () => {

  let apiSpy: jasmine.SpyObj<ApiService>;
  
  beforeEach(() => {

    apiSpy = jasmine.createSpyObj('ApiService', ['getReady', 'request']);

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: apiSpy }
      ]
    });

    apiSpy.getReady.and.returnValue(of(true));
    apiSpy.request.and.returnValue(of({ total: 1, starSystems: [{x: 0, y: 0, type: 1, size: 1}]}));

  });

  it('should be created', () => {
    const service: StarSystemsService = TestBed.get(StarSystemsService);
    expect(service).toBeTruthy();
  });
});
