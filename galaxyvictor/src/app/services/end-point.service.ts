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

  constructor(private http: HttpClient) { }

  public getAppInfo(): Observable<AppInfo> {
    if (this.info) {
      return of(this.info);
    }
    return this.http.get<AppInfo>(APP_INFO_URL).pipe(tap( info => this.info = info ));
  }

  public getApiInfo(): Observable<ApiInfo> {
    const subject: Subject<ApiInfo> = new Subject();

    this.getAppInfo().subscribe(appInfo => {
      this.http.get<ApiInfo>(appInfo.apiHost).subscribe(apiInfo => subject.next(apiInfo));
    });

    return subject.asObservable();
  }
}
