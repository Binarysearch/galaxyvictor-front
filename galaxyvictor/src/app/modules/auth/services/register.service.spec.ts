import { TestBed } from '@angular/core/testing';

import { RegisterService, REGISTER_ENPOINT_ID } from './register.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { User } from '../../../model/user.interface';
import { Session } from '../../../model/session.interface';
import { EndPointService } from '../../../services/end-point.service';

const FAKE_REGISTER_RESPONSE: Session = {
  user: {
    id: '1',
    email: 'example@email.com'
  },
  token: 'some_token'
}

const FAKE_REGISTER_PATH = '/path/to/resgister/api';

describe('RegisterService', () => {

  let httpSpy: jasmine.SpyObj<HttpClient>;
  let endPointSpy: jasmine.SpyObj<EndPointService>;

  beforeEach(() => {

    endPointSpy = jasmine.createSpyObj('EndPointService', ['getEndPointPath']);

    endPointSpy.getEndPointPath.withArgs(REGISTER_ENPOINT_ID).and.returnValue(FAKE_REGISTER_PATH);

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: jasmine.createSpyObj('HttpClient', ['post']) },
        { provide: EndPointService, useValue: endPointSpy }
      ]
    });

    httpSpy = TestBed.get(HttpClient);

  });

  it('should be created', () => {
    const service: RegisterService = TestBed.get(RegisterService);
    expect(service).toBeTruthy();
  });

  it('should call http with register endpoint on register', (done: DoneFn) => {
    const service: RegisterService = TestBed.get(RegisterService);

    httpSpy.post.withArgs(FAKE_REGISTER_PATH, { email: 'email', password: '12345' })
      .and.returnValue(of(FAKE_REGISTER_RESPONSE));

    service.register('email', '12345').subscribe(user => {

      expect(user).toEqual(FAKE_REGISTER_RESPONSE);
      done();

    });

    expect(httpSpy.post).toHaveBeenCalledWith(FAKE_REGISTER_PATH, { email: 'email', password: '12345' });
    expect(endPointSpy.getEndPointPath).toHaveBeenCalledWith(REGISTER_ENPOINT_ID);

  });


});
