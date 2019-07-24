import { TestBed } from '@angular/core/testing';

import { SocketService, SOCKET_ENPOINT_ID } from './socket.service';
import { AuthService } from '../modules/auth/services/auth.service';
import { EndPointService } from './end-point.service';
import { of } from 'rxjs';

const FAKE_SOCKET_PATH = '/path/to/resgister/api';

describe('SocketService', () => {

  let endPointSpy: jasmine.SpyObj<EndPointService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {

    endPointSpy = jasmine.createSpyObj('EndPointService', ['getEndPointPath']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getSession']);

    endPointSpy.getEndPointPath.withArgs(SOCKET_ENPOINT_ID).and.returnValue(FAKE_SOCKET_PATH);
    authServiceSpy.getSession.and.returnValue(of(null));

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: EndPointService, useValue: endPointSpy }
      ]
    });

  });

  it('should be created', () => {
    const service: SocketService = TestBed.get(SocketService);
    expect(service).toBeTruthy();
  });
});
