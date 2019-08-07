import { Injectable } from '@angular/core';
import { EndPointService } from '../../../services/end-point.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Session } from '../../../model/session.interface';
import { AuthService } from './auth.service';

export const LOGIN_ENPOINT_ID = 'login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  loginUrl: string;

  constructor(
    private endPoint: EndPointService, 
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.loginUrl = this.endPoint.getEndPointPath(LOGIN_ENPOINT_ID);
  }

  login(email: string, password: string): Observable<Session> {
    return this.http.post<Session>(this.loginUrl, { email: email, password: password })
    .pipe(
      tap(result => {
        this.authService.setSession(result);
      })
    );
  }
}
