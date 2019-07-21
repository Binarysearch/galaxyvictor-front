import { Injectable } from '@angular/core';
import { EndPointService } from '../../../services/end-point.service';
import { Observable } from 'rxjs';
import { User } from '../../../model/user.interface';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

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

  constructor(private endPoint: EndPointService, private http: HttpClient) {
    this.endPoint.ready().subscribe(() => {
      this.registerUrl = this.endPoint.getEndPointPath(REGISTER_ENPOINT_ID);
    });
  }

  public register(email: string, password: string): Observable<User> {
    return this.http.post<User>(this.registerUrl, { email: email, password: password });
  }

}
