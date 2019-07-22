import { Injectable } from '@angular/core';
import { EndPointService } from '../../../services/end-point.service';
import { Observable, throwError } from 'rxjs';
import { User } from '../../../model/user.interface';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Session } from '../../../model/session.interface';
import { AuthService } from './auth.service';

export interface RegisterRequest {
  email: string;
  password: string;
}

export const REGISTER_ENPOINT_ID = 'register';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  registerUrl: string;

  constructor(
    private endPoint: EndPointService, 
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.registerUrl = this.endPoint.getEndPointPath(REGISTER_ENPOINT_ID);
  }

  public register(email: string, password: string): Observable<Session> {
    return this.http.post<Session>(this.registerUrl, { email: email, password: password })
    .pipe(
      tap(result => {
        this.authService.setSession(result);
      })
    );
  }

}
