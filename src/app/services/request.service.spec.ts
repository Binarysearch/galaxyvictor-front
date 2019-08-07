import { TestBed } from '@angular/core/testing';

import { RequestService } from './request.service';
import { SocketService } from './socket.service';
import { Subject } from 'rxjs';

describe('RequestService', () => {

  let socketServiceSpy: jasmine.SpyObj<SocketService>;
  let subject: Subject<string>;

  beforeEach(() => {

    subject = new Subject<string>();
    
    socketServiceSpy = jasmine.createSpyObj('SocketService', ['getMessages', 'send']);

    socketServiceSpy.getMessages.and.returnValue(subject.asObservable());

    TestBed.configureTestingModule({
      providers: [
        { provide: SocketService, useValue: socketServiceSpy }
      ]
    });

  });

  it('should be created', () => {
    const service: RequestService = TestBed.get(RequestService);
    expect(service).toBeTruthy();
  });

  it('should receive msg and close subject', (done: DoneFn) => {
    const service: RequestService = TestBed.get(RequestService);
    
    service.request({
      type: 'some-type',
      payload: 'some-payload'
    }).subscribe(msg => {
      expect(msg).toEqual('something');
      
    }, null, ()=>{
      // complete
      done();
    });
    
    const arg = socketServiceSpy.send.calls.argsFor(0)[0];
    const id = JSON.parse(arg).id;

    subject.next(JSON.stringify({id: id, payload: 'something'}));

    expect(service.getSubjects().size).toEqual(0);
  });
});
