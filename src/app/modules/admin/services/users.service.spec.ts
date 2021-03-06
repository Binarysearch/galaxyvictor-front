import { TestBed } from '@angular/core/testing';

import { UsersService, UserListDto } from './users.service';
import { of } from 'rxjs';
import { ApiService } from '@piros/api';

describe('UsersService', () => {

  const FAKE_RESULT: UserListDto = {
    total: 0,
    users: []
  };

  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {

    apiServiceSpy = jasmine.createSpyObj('ApiService', ['request']);

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    });

    apiServiceSpy.request.withArgs('get-users', '').and.returnValue(of(FAKE_RESULT));

  });

  it('should be created', () => {
    const service: UsersService = TestBed.get(UsersService);
    expect(service).toBeTruthy();
  });

  it('should call apiService with type "get-users" on getUsers', (done: DoneFn) => {
    const service: UsersService = TestBed.get(UsersService);
    
    service.getUsers().subscribe(result => {
      expect(result).toEqual(FAKE_RESULT);
      expect(apiServiceSpy.request).toHaveBeenCalledWith('get-users', '');
      done();
    });
    
  });


});
