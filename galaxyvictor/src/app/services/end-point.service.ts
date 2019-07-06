import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AppInfo {
  apiHost: string;
  appVersion: string;
}

const APP_INFO_URL = '/app-info';

@Injectable({
  providedIn: 'root'
})
export class EndPointService {

  constructor(private http: HttpClient) { }

  public getAppInfo(): Observable<AppInfo> {
    return this.http.get<AppInfo>(APP_INFO_URL);
  }
}
