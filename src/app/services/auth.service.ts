import { Injectable } from '@angular/core';
import { PirosApiService, ApiServiceSession, ConnectionStatus } from '@piros/api';
import { LocalStorageService } from './local-storage.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';

export enum AuthStatus {
  SESSION_STARTING = 'SESSION_STARTING',
  SESSION_STARTED = 'SESSION_STARTED',
  SESSION_CLOSED = 'SESSION_CLOSED'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private status: BehaviorSubject<AuthStatus>;

  constructor(
    private api: PirosApiService,
    private localStorageService: LocalStorageService
  ) {
    this.api.getStatus().subscribe(status => {
      if (status.connectionStatus === ConnectionStatus.FULLY_CONNECTED) {
        this.status.next(AuthStatus.SESSION_STARTED);
      } else {
        if (this.status) {
          this.status.next(AuthStatus.SESSION_CLOSED);
        } else {
          this.status = new BehaviorSubject(AuthStatus.SESSION_CLOSED);
        }
      }
    });

    const savedToken = this.localStorageService.getSavedToken();
    if (savedToken) {
      this.status = new BehaviorSubject(AuthStatus.SESSION_STARTING);
      this.api.connectWithToken(savedToken).subscribe();
    } else {
      this.status = new BehaviorSubject(AuthStatus.SESSION_CLOSED);
    }
  }
  
  public register(username: string, password: string): Observable<string> {
    return this.api.post<string>('civilizations.register', { username: username, password: password });
  }

  public getStatus(): Observable<AuthStatus> {
    return this.status.asObservable();
  }
  
  public login(username: string, password: string): Observable<string> {
    return this.api.login(username, password).pipe(
      map(session => session.authToken),
      tap(authToken => {
        this.localStorageService.setSavedToken(authToken);
      })
    );
  }
  
  public closeSession() {
    this.localStorageService.deleteSavedToken();
    this.status.next(AuthStatus.SESSION_CLOSED);
  }

}
