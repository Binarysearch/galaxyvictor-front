import { TestBed } from '@angular/core/testing';

import { SocketService, SOCKET_ENPOINT_ID } from './socket.service';
import { AuthService } from '../modules/auth/services/auth.service';
import { EndPointService } from './end-point.service';
import { of, Subject } from 'rxjs';
import { WebSocketBuilderService } from './web-socket-builder.service';
import { Session } from '../model/session.interface';
import { Socket } from 'net';

const FAKE_SOCKET_PATH = '/path/to/resgister/api';

describe('SocketService', () => {

  let webSocketSpy: jasmine.SpyObj<WebSocket>;
  let endPointSpy: jasmine.SpyObj<EndPointService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let webSocketBuilderServiceSpy: jasmine.SpyObj<WebSocketBuilderService>;

  beforeEach(() => {

    webSocketSpy = jasmine.createSpyObj('WebSocket', ['send', 'close' ]);
    endPointSpy = jasmine.createSpyObj('EndPointService', ['getEndPointPath']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getSession']);
    webSocketBuilderServiceSpy = jasmine.createSpyObj('WebSocketBuilderService', ['getSocket']);

    endPointSpy.getEndPointPath.withArgs(SOCKET_ENPOINT_ID).and.returnValue(FAKE_SOCKET_PATH);
    authServiceSpy.getSession.and.returnValue(of(null));

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: WebSocketBuilderService, useValue: webSocketBuilderServiceSpy },
        { provide: EndPointService, useValue: endPointSpy }
      ]
    });

  });

  it('should be created', () => {
    const service: SocketService = TestBed.get(SocketService);
    expect(service).toBeTruthy();
  });

  it('should create socket when the session changes', () => {

    const subject: Subject<Session> = new Subject();

    authServiceSpy.getSession.and.returnValue(subject.asObservable());
    webSocketBuilderServiceSpy.getSocket.and.returnValue(webSocketSpy);

    const service: SocketService = TestBed.get(SocketService);
    
    const session = {
      token: 'someToken',
      user: {
        id: 'someId',
        email: 'someEmail'
      }
    };

    subject.next(session);

    webSocketSpy.onopen.call(this);

    expect(webSocketSpy.send).toHaveBeenCalledWith('someToken');

  });

  it('should close socket when the session changes', () => {

    const subject: Subject<Session> = new Subject();

    authServiceSpy.getSession.and.returnValue(subject.asObservable());
    webSocketBuilderServiceSpy.getSocket.and.returnValue(webSocketSpy);

    const service: SocketService = TestBed.get(SocketService);
    
    const session = {
      token: 'someToken',
      user: {
        id: 'someId',
        email: 'someEmail'
      }
    };

    subject.next(session);

    webSocketSpy.onopen.call(this);

    expect(webSocketSpy.send).toHaveBeenCalledWith('someToken');

    subject.next(session);

    expect(webSocketSpy.close).toHaveBeenCalledTimes(1);

  });

  it('should send messages through socket', () => {

    const subject: Subject<Session> = new Subject();

    authServiceSpy.getSession.and.returnValue(subject.asObservable());
    webSocketBuilderServiceSpy.getSocket.and.returnValue(webSocketSpy);

    const service: SocketService = TestBed.get(SocketService);
    
    const session = {
      token: 'someToken',
      user: {
        id: 'someId',
        email: 'someEmail'
      }
    };

    subject.next(session);

    webSocketSpy.onopen.call(this);
    expect(webSocketSpy.send).toHaveBeenCalledWith('someToken');

    Object.defineProperty(webSocketSpy, 'readyState', { value:  WebSocket.OPEN });
    
    service.send('someMessage');
    expect(webSocketSpy.send).toHaveBeenCalledWith('someMessage');
  });

  it('should receive messages through getMessages', (done) => {

    const subject: Subject<Session> = new Subject();

    authServiceSpy.getSession.and.returnValue(subject.asObservable());
    webSocketBuilderServiceSpy.getSocket.and.returnValue(webSocketSpy);

    const service: SocketService = TestBed.get(SocketService);
    
    const session = {
      token: 'someToken',
      user: {
        id: 'someId',
        email: 'someEmail'
      }
    };

    subject.next(session);

    webSocketSpy.onopen.call(this);

    expect(webSocketSpy.send).toHaveBeenCalledWith('someToken');

    service.getMessages().subscribe( msg => {
      expect(msg).toEqual('someIncomingMsg');
      done();
    });

    webSocketSpy.onmessage.call(this, {data: 'someIncomingMsg'});
    //.apply({data: 'someIncomingMsg'});
  });

});
