import { Injectable } from '@angular/core';
import { SessionState } from '../model/session.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public getSavedToken(): string {
    return localStorage.getItem('GALAXYVICTOR-AUTH-TOKEN');
  }

  public deleteSavedToken(): void {
    localStorage.removeItem('GALAXYVICTOR-AUTH-TOKEN');
  }

  public setSavedToken(authToken: string): void {
    localStorage.setItem('GALAXYVICTOR-AUTH-TOKEN', authToken);
  }

  public saveSessionState(newState: SessionState): void {
    localStorage.setItem('GALAXYVICTOR-SESSION-STATE', JSON.stringify(newState));
  }

  public getSessionState(): SessionState {
    return JSON.parse(localStorage.getItem('GALAXYVICTOR-SESSION-STATE'));
  }

}
