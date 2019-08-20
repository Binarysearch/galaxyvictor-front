import { TestBed } from '@angular/core/testing';

import { Store } from './store';
import { ApiService } from '../api.service';
import { of } from 'rxjs';

describe('Store', () => {

  let apiSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {

    apiSpy = jasmine.createSpyObj('ApiService', ['request', 'getReady']);

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: apiSpy }
      ]
    });

  });

  it('should be created', () => {

    apiSpy.getReady.and.returnValue(of(false));

    const store: Store = TestBed.get(Store);
    expect(store).toBeTruthy();
  });

  it('should get galaxy when ready', () => {

    apiSpy.getReady.and.returnValue(of(true));
    apiSpy.request.and.returnValue(of({starSystems:[]}));

    const store: Store = TestBed.get(Store);
    
    expect(apiSpy.request).toHaveBeenCalledWith('get-galaxy', 'test-galaxy');
  });


});
