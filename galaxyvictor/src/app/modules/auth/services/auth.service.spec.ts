import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });

  it('should store session token', (done) => {
    const service: AuthService = TestBed.get(AuthService);
   
    const sessionToSet = {
      user: { id: '12', email: 'someEmail' },
      token: 'someToken'
    };

    service.setSession(sessionToSet);

    const storedSession = localStorage.getItem('galaxyvictor-session');
    expect(storedSession).toEqual(JSON.stringify(sessionToSet));

    service.getSession().subscribe(session => {
      expect(session).toEqual(sessionToSet);
      done();
    });
  });


});
