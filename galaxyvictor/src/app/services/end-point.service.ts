import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { tap, map } from 'rxjs/operators';

export interface AppInfo {
  apiHost: string;
  appVersion: string;
}

export interface ApiInfo {
  apiVersion: string;
  endpoints: Endpoint[];
}

export interface Endpoint{
  id: string;
  path: string;
}

export const APP_INFO_URL = '/app-info';

@Injectable({
  providedIn: 'root'
})
export class EndPointService {

  private info: AppInfo;
  private apiInfo: ApiInfo;
  private endPointMap: Map<string, string>;
  private readySubject: Subject<boolean> = new Subject();

  constructor(private http: HttpClient) {
    
  }

  public loadEndPoints(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      this.getApiInfo().subscribe(info => {
        this.endPointMap = new Map();
        info.endpoints.forEach(endPoint => this.endPointMap.set(endPoint.id, endPoint.path) );
        this.readySubject.next(true);
        resolve();
      }, (error) => {
        console.error('Error loading endpoints', error);
        resolve();
      });
    });
  }

  public getAppInfo(): Observable<AppInfo> {
    if (this.info) {
      return of(this.info);
    }
    return this.http.get<AppInfo>(APP_INFO_URL).pipe(tap( info => this.info = info ));
  }

  public getApiInfo(): Observable<ApiInfo> {
    if (this.apiInfo) {
      return of(this.apiInfo);
    }
    const subject: Subject<ApiInfo> = new Subject();

    this.getAppInfo().subscribe(appInfo => {
      this.http.get<ApiInfo>(appInfo.apiHost)
        .pipe(tap( info => this.apiInfo = info ))
        .subscribe(apiInfo => subject.next(apiInfo), error => subject.error(error));
    }, error => subject.error(error));

    return subject.asObservable();
  }

  public ready(): Observable<boolean> {
    return this.readySubject.asObservable();
  }

  public getEndPointPath(id: string): string {
    return this.endPointMap.get(id);
  }

}
