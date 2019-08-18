import { Injectable } from '@angular/core';
import { Session, SessionState } from '../../../model/session.interface';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private sessionStateSubject: ReplaySubject<SessionState> = new ReplaySubject(1);
  private sessionSubject: ReplaySubject<Session> = new ReplaySubject(1);

  constructor() { }

  public setSession(session: Session) {
    this.sessionSubject.next(session);
    localStorage.setItem('galaxyvictor-session', JSON.stringify(session));
  }

  public getSession(): Observable<Session> {
    return this.sessionSubject.asObservable();
  }

  public setSessionState(sessionState: SessionState) {
    this.sessionStateSubject.next(sessionState);
  }

  public getSessionState(): Observable<SessionState> {
    return this.sessionStateSubject.asObservable();
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
  
  public closeSession(): void {
    this.sessionSubject.next(null);
    this.removeSessionFromStorage();
  }
}
