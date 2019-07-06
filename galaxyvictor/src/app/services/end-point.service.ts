import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_HOST_URL = '/api-host';

@Injectable({
  providedIn: 'root'
})
export class EndPointService {

  constructor(private http: HttpClient) { }

  public getApiHost(): Observable<string> {
    return this.http.get<string>(API_HOST_URL);
  }
}
