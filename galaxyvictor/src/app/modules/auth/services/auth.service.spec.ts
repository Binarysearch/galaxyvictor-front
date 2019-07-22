import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });

  it('should store session token', () => {
    const service: AuthService = TestBed.get(AuthService);
   
    const sessionToSet = {
      user: { id: '12', email: 'someEmail' },
      token: 'someToken'
    };

    service.setSession(sessionToSet);

    const token = localStorage.getItem('galaxyvictor-token');
    expect(token).toEqual('someToken');

    const session = service.getSession();
    expect(session).toEqual(sessionToSet);
  });


});
