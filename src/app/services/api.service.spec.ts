import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { RequestService } from './request.service';
import { SocketService, SocketStatus } from './socket.service';
import { of } from 'rxjs';

describe('ApiService', () => {

  let requestServiceSpy: jasmine.SpyObj<RequestService>;
  let socketServiceSpy: jasmine.SpyObj<SocketService>;

  beforeEach(() => {

    requestServiceSpy = jasmine.createSpyObj('RequestService', ['request']);
    socketServiceSpy = jasmine.createSpyObj('SocketService', ['getStatus']);

    TestBed.configureTestingModule({
      providers: [
        { provide: RequestService, useValue: requestServiceSpy },
        { provide: SocketService, useValue: socketServiceSpy }
      ]
    });


  });

  it('should be created', () => {
    const service: ApiService = TestBed.get(ApiService);
    expect(service).toBeTruthy();
  });

  it('should return ready=true when socket status is session_started', (done: DoneFn) => {
    const service: ApiService = TestBed.get(ApiService);

    socketServiceSpy.getStatus.and.returnValue(of(SocketStatus.SESSION_STARTED));

    service.getReady().subscribe(result => {
      expect(result).toBeTruthy();
      expect(socketServiceSpy.getStatus).toHaveBeenCalled();
      done();
    });
    
  });

  it('should pass request to requestService', (done: DoneFn) => {
    const service: ApiService = TestBed.get(ApiService);

    requestServiceSpy.request.and.returnValue(of('something'));

    service.request({ type: '', payload: '' }).subscribe(result => {
      expect(result).toEqual('something');
      expect(requestServiceSpy.request).toHaveBeenCalledWith({ type: '', payload: '' });
      done();
    });
    
  });


});
