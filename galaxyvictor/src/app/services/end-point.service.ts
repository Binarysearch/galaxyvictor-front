import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {
    
  }

  public loadEndPoints(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      
      this.http.get<AppInfo>(APP_INFO_URL).subscribe(appInfo => {

        this.info = appInfo;

        this.http.get<ApiInfo>(appInfo.apiHost)
        .subscribe(apiInfo => {

          this.apiInfo = apiInfo;
          this.endPointMap = new Map();
          apiInfo.endpoints.forEach(endPoint => {
            this.endPointMap.set(endPoint.id, appInfo.apiHost + endPoint.path);
          });

          resolve();
        }, (error) => {
          console.error('Error loading endpoints', error);
          reject(error);
        });

      }, (error) => {
        console.error('Error loading endpoints', error);
        reject(error);
      });
    });
  }

  public getAppInfo(): AppInfo {
    return this.info;
  }

  public getApiInfo(): ApiInfo {
    return this.apiInfo;
  }

  public getEndPointPath(id: string): string {
    return this.endPointMap.get(id);
  }

}
