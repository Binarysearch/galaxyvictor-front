import { Injectable } from '@angular/core';
import { Session } from '../../../model/session.interface';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private sessionSubject: BehaviorSubject<Session>;

  constructor() {
    this.sessionSubject = new BehaviorSubject(this.loadFromStorage());
  }

  public setSession(session: Session) {
    this.sessionSubject.next(session);
    localStorage.setItem('galaxyvictor-session', JSON.stringify(session));
  }

  public getSession(): Observable<Session> {
    return this.sessionSubject.asObservable();
  }

  private loadFromStorage(): Session {
    const sessionString = localStorage.getItem('galaxyvictor-session');
    if (sessionString) {
      return JSON.parse(sessionString);
    } else {
      return null;
    }
  }
}
