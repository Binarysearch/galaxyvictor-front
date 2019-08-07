import { TestBed } from '@angular/core/testing';

import { EndPointService, AppInfo, ApiInfo } from './end-point.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { APP_INFO_URL } from './end-point.service';

describe('EndPointService', () => {

  let httpSpy: jasmine.SpyObj<HttpClient>;

  const FAKE_APP_INFO: AppInfo = {
    apiHost: 'some_host',
    appVersion: '1.0.0'
  } 

  const FAKE_API_INFO: ApiInfo = {
    apiVersion: '2.0.0',
    endpoints: [
      { id: 'id-1', path: 'path-1'}
    ]
  } 

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: jasmine.createSpyObj('HttpClient', ['get']) }]
    });

    httpSpy = TestBed.get(HttpClient);

  });

  it('should be created', () => {
    const service: EndPointService = TestBed.get(EndPointService);
    expect(service).toBeTruthy();
  });

  it('should get endpoint path', (done: DoneFn) => {
    const service: EndPointService = TestBed.get(EndPointService);

    httpSpy.get.withArgs(APP_INFO_URL).and.returnValue(of(FAKE_APP_INFO));
    httpSpy.get.withArgs(FAKE_APP_INFO.apiHost).and.returnValue(of(FAKE_API_INFO));

    service.loadEndPoints().then(()=>{

      expect(httpSpy.get).toHaveBeenCalledWith(APP_INFO_URL);
      expect(httpSpy.get).toHaveBeenCalledWith(FAKE_APP_INFO.apiHost);
      
      const path = service.getEndPointPath(FAKE_API_INFO.endpoints[0].id);
      expect(path).toEqual(FAKE_APP_INFO.apiHost + FAKE_API_INFO.endpoints[0].path);
      
      const appInfo = service.getAppInfo();
      expect(appInfo).toEqual(FAKE_APP_INFO);

      const apiInfo = service.getApiInfo();
      expect(apiInfo).toEqual(FAKE_API_INFO);

      done();
    });

  });

  it('should reject on loadendpoints with error on appinfo', (done: DoneFn) => {

    const service: EndPointService = TestBed.get(EndPointService);
    const someError = { err: 'error loading' };

    httpSpy.get.withArgs(APP_INFO_URL).and.returnValue(of(FAKE_APP_INFO));
    httpSpy.get.withArgs(FAKE_APP_INFO.apiHost).and.returnValue(throwError(someError));

    
    service.loadEndPoints().then(null, error => {
      expect(httpSpy.get).toHaveBeenCalledWith(APP_INFO_URL);
      expect(httpSpy.get).toHaveBeenCalledWith(FAKE_APP_INFO.apiHost);
      expect(error).toEqual(someError);
      done();
    });
    
  });

  it('should reject on loadendpoints with error on apiinfo', (done: DoneFn) => {

    const service: EndPointService = TestBed.get(EndPointService);

    const someError = { err: 'error loading' };
    httpSpy.get.withArgs(APP_INFO_URL).and.returnValue(throwError(someError));
    
    service.loadEndPoints().then(null, error => {
      expect(httpSpy.get).toHaveBeenCalledWith(APP_INFO_URL);
      expect(httpSpy.get).toHaveBeenCalledTimes(1);
      expect(error).toEqual(someError);
      done();
    });
    
  });


});
