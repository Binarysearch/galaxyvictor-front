import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { SessionState } from '../model/session.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapStateService {

  constructor(
    private localStorageService: LocalStorageService
  ) {
    
  }  
  
  public setSessionstate(newState: SessionState): Observable<SessionState> {
    this.localStorageService.saveSessionState(newState);
    return of(newState);
  }

  public getSessionState(): Observable<SessionState> {
    return of(this.localStorageService.getSessionState());
  }
}
