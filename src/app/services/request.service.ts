import { Injectable } from '@angular/core';
import { SocketService, SocketStatus } from './socket.service';
import { Observable, Subject } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import * as uuid from 'uuid';

export interface WsRequest {
  id?: string;
  type: string;
  payload: any;
}

export interface WsResponse<T> {
  id: string;
  type: string;
  payload: T;
}

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private subjects: Map<string, Subject<any>> = new Map<string, Subject<any>>();

  constructor(private socketService: SocketService) {
    this.socketService.getMessages()
    .pipe(
      map(msg => <WsResponse<any>>JSON.parse(msg)),
      tap(msg => console.log('MESSAGE', msg)),
      filter(msg => {
        // Filtra los mensajes y solo procesa los que traigan payload, id
        // y tengan un subject escuchando
        return msg.payload !== undefined &&
          msg.id !== undefined && 
          this.subjects.has(msg.id);
      })
    )
    .subscribe(msg => {
      const subject = this.subjects.get(msg.id);
      this.subjects.delete(msg.id);
      subject.next(msg.payload);
      subject.complete();
    });
  }

  public request<T>(request: WsRequest, timeout?: number): Observable<T> {
    request.id = uuid.v4();
    const subject = new Subject<T>();
    this.subjects.set(request.id, subject);

    let subscription;
    subscription = this.socketService.getStatus().subscribe(status => {
      if (status === SocketStatus.SESSION_STARTED) {
        this.socketService.send(JSON.stringify(request));
        if (subscription) {
          subscription.unsubscribe();
        }
      }
    });

    if (timeout) {
      // cancela el subject y lanza error
      setTimeout(() => {
        const subject = this.subjects.get(request.id);
        this.subjects.delete(request.id);
        subject.error(new Error(`Timeout ${timeout}ms has passed with no response`));
      }, timeout);
    }

    return subject.asObservable();
  }

  public getSubjects(): Map<string, Subject<any>> {
    return this.subjects;
  }
}
