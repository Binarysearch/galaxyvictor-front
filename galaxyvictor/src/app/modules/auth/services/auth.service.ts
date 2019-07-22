import { Injectable } from '@angular/core';
import { Session } from '../../../model/session.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private session: Session;

  constructor() { }

  public setSession(session: Session) {
    this.session = session;
    localStorage.setItem('galaxyvictor-token', session.token);
  }

  public getSession(): Session {
    return this.session;
  }
}
