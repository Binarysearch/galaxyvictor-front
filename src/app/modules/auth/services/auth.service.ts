import { Injectable } from '@angular/core';
import { Session } from '../../../model/session.interface';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private sessionSubject: ReplaySubject<Session> = new ReplaySubject(1);

  constructor() { }

  public setSession(session: Session) {
    this.sessionSubject.next(session);
    localStorage.setItem('galaxyvictor-session', JSON.stringify(session));
  }

  public getSession(): Observable<Session> {
    return this.sessionSubject.asObservable();
  }

  public loadFromStorage(): Session {
    const sessionString = localStorage.getItem('galaxyvictor-session');
    if (sessionString) {
      return JSON.parse(sessionString);
    } else {
      return null;
    }
  }

  public removeSessionFromStorage() {
    localStorage.removeItem('galaxyvictor-session');
  }
}
