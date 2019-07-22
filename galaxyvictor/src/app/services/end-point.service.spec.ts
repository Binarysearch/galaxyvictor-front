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

  it('should call http on 1st getAppInfo', (done: DoneFn) => {
    const service: EndPointService = TestBed.get(EndPointService);

    httpSpy.get.and.returnValue(of(FAKE_APP_INFO));


    service.getAppInfo().subscribe((info: AppInfo) => {

      expect(info).toEqual(FAKE_APP_INFO);
      expect(httpSpy.get).toHaveBeenCalledWith(APP_INFO_URL);
      done();
      
    });
    
  });

  it('should bubble error from http on getAppInfo', (done: DoneFn) => {
    const service: EndPointService = TestBed.get(EndPointService);

    const someError = { err: 'error loading' };
    httpSpy.get.and.returnValue(throwError(someError));

    service.getAppInfo().subscribe((info: AppInfo) => {
      
    }, error => {
      expect(error).toEqual(someError);
      expect(httpSpy.get).toHaveBeenCalledWith(APP_INFO_URL);
      done();
    });
    
  });

  it('should not call http on 2nd getAppInfo', (done: DoneFn) => {
    const service: EndPointService = TestBed.get(EndPointService);

    httpSpy.get.and.returnValue(of(FAKE_APP_INFO));


    service.getAppInfo().subscribe((info: AppInfo) => {

      expect(info).toEqual(FAKE_APP_INFO);
      expect(httpSpy.get).toHaveBeenCalledWith(APP_INFO_URL);

      httpSpy.get.and.returnValue(of());

      service.getAppInfo().subscribe((info: AppInfo) => {

        expect(info).toEqual(FAKE_APP_INFO);
        expect(httpSpy.get).toHaveBeenCalledTimes(1);
        done();

      });
    });
    
  });

  it('should call http on getApiInfo with host from getAppInfo', (done: DoneFn) => {
    const service: EndPointService = TestBed.get(EndPointService);

    httpSpy.get.withArgs(APP_INFO_URL).and.returnValue(of(FAKE_APP_INFO));
    httpSpy.get.withArgs(FAKE_APP_INFO.apiHost).and.returnValue(of(FAKE_API_INFO));

    service.getApiInfo();

    expect(httpSpy.get).toHaveBeenCalledWith(APP_INFO_URL);
    expect(httpSpy.get).toHaveBeenCalledWith(FAKE_APP_INFO.apiHost);
    done();
    
  });

  it('should not call http on 2nd getApiInfo', (done: DoneFn) => {
    const service: EndPointService = TestBed.get(EndPointService);

    httpSpy.get.withArgs(APP_INFO_URL).and.returnValue(of(FAKE_APP_INFO));
    httpSpy.get.withArgs(FAKE_APP_INFO.apiHost).and.returnValue(of(FAKE_API_INFO));

    service.getApiInfo();

    expect(httpSpy.get).toHaveBeenCalledWith(APP_INFO_URL);
    expect(httpSpy.get).toHaveBeenCalledWith(FAKE_APP_INFO.apiHost);

    service.getApiInfo();

    expect(httpSpy.get).toHaveBeenCalledTimes(2);

    done();
    
  });

  it('should bubble error from http on getApiInfo', (done: DoneFn) => {
    const service: EndPointService = TestBed.get(EndPointService);

    const someError = { err: 'error loading' };
    httpSpy.get.and.returnValue(throwError(someError));

    service.getApiInfo().subscribe((info: ApiInfo) => {
      
    }, error => {
      expect(error).toEqual(someError);
      expect(httpSpy.get).toHaveBeenCalledWith(APP_INFO_URL);
      done();
    });
    
  });

  it('should call ready on loadendpoints', (done: DoneFn) => {
    const service: EndPointService = TestBed.get(EndPointService);

    httpSpy.get.withArgs(APP_INFO_URL).and.returnValue(of(FAKE_APP_INFO));
    httpSpy.get.withArgs(FAKE_APP_INFO.apiHost).and.returnValue(of(FAKE_API_INFO));

    service.getApiInfo();

    service.ready().subscribe(isReady => {
      expect(isReady).toEqual(true);
      expect(httpSpy.get).toHaveBeenCalledWith(APP_INFO_URL);
      expect(httpSpy.get).toHaveBeenCalledWith(FAKE_APP_INFO.apiHost);
      done();
    });
    
    service.loadEndPoints();
    
  });

  it('should resolve on loadendpoints with error', (done: DoneFn) => {
    const service: EndPointService = TestBed.get(EndPointService);
    const someError = { err: 'error loading' };
    httpSpy.get.withArgs(APP_INFO_URL).and.returnValue(of(FAKE_APP_INFO));
    httpSpy.get.withArgs(FAKE_APP_INFO.apiHost).and.returnValue(throwError(someError));

    service.getApiInfo();
    
    service.loadEndPoints().then(()=>{
      expect(httpSpy.get).toHaveBeenCalledWith(APP_INFO_URL);
      expect(httpSpy.get).toHaveBeenCalledWith(FAKE_APP_INFO.apiHost);
      done();
    });
    
  });

  it('should get endpoint path', (done: DoneFn) => {
    const service: EndPointService = TestBed.get(EndPointService);

    httpSpy.get.withArgs(APP_INFO_URL).and.returnValue(of(FAKE_APP_INFO));
    httpSpy.get.withArgs(FAKE_APP_INFO.apiHost).and.returnValue(of(FAKE_API_INFO));

    service.getApiInfo();
    
    service.ready().subscribe(isReady => {
      expect(isReady).toEqual(true);
      expect(httpSpy.get).toHaveBeenCalledWith(APP_INFO_URL);
      expect(httpSpy.get).toHaveBeenCalledWith(FAKE_APP_INFO.apiHost);
      
      const path = service.getEndPointPath(FAKE_API_INFO.endpoints[0].id);
      expect(path).toEqual(FAKE_API_INFO.endpoints[0].path);
      
      done();
    });
    
    service.loadEndPoints();

  });


});
