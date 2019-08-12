import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { SocketService, SocketStatus } from './socket.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private requestService: RequestService,
    private socketService: SocketService
  ) { }

  public getReady(): Observable<boolean> {
    return this.socketService.getStatus().pipe(
      map(status => status === SocketStatus.SESSION_STARTED)
    );
  }

  public request<T>(type: string, payload: any): Observable<T> {
    return this.requestService.request<T>(type, payload);
  }
  
}
