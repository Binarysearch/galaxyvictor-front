import { Injectable } from '@angular/core';
import { EndPointService } from './end-point.service';
import { Observable, of, Subject, ReplaySubject } from 'rxjs';
import { AuthService } from '../modules/auth/services/auth.service';
import { WebSocketBuilderService } from './web-socket-builder.service';

export const SOCKET_ENPOINT_ID = 'socket';

export enum SocketStatus {
  SESSION_STARTED = 'SESSION_STARTED',
  CLOSED = 'CLOSED',
  SESSION_STARTING = 'SESSION_STARTING',
  CONNECTING = 'CONNECTING'
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: WebSocket;
  private subject: Subject<string> = new Subject();
  private statusChangesSubject: ReplaySubject<SocketStatus> = new ReplaySubject(1);

  constructor(
    private endPoint: EndPointService,
    private wsBuilder: WebSocketBuilderService,
    private auth: AuthService
  ) {
    this.connect();
  }

  private connect(): void {
    const endpoint = this.endPoint.getEndPointPath(SOCKET_ENPOINT_ID)
    .replace('http', 'ws')
    .replace('https', 'wss');

    this.auth.getSession().subscribe(session => {

      //si hay socket desconectar
      if(this.socket){
        console.log('CERRANDO SOCKET...');
        this.closeSocket();
      }

      // si hay sesion crear nuevo socket
      if (session) {
        console.log('NUEVO SOCKET...', session);
        this.socket = this.wsBuilder.getSocket(endpoint);
        this.statusChangesSubject.next(SocketStatus.CONNECTING);
        this.socket.onmessage = this.onFirstMessage.bind(this);
        this.socket.onclose = this.onClose.bind(this);
        this.socket.onerror = this.onError.bind(this);
        this.socket.onopen = () => {
          this.statusChangesSubject.next(SocketStatus.SESSION_STARTING);
          this.socket.send(session.token);
        };
      }
      
    });
  }

  private closeSocket() {
    this.socket.onmessage = null;
    this.socket.onclose = null;
    this.socket.onerror = null;
    this.socket.onopen = null;
    this.socket.close();
    this.statusChangesSubject.next(SocketStatus.CLOSED);
  }

  public getMessages(): Observable<string> {
    return this.subject.asObservable();
  }

  public send(msg: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(msg);
    } else {
      throw new Error('SOCKET NO CONECTADO');
    }
  }

  private onClose(event: CloseEvent) {
    this.statusChangesSubject.next(SocketStatus.CLOSED);
  }

  private onFirstMessage(msg: MessageEvent) {
    // session ok ?
    const data = JSON.parse(msg.data);
    
    if (data.type && data.type === 'SessionStartedDto') {
      this.socket.onmessage = this.onMessage.bind(this);
      this.statusChangesSubject.next(SocketStatus.SESSION_STARTED);
    } else {
      this.closeSocket();
      console.error('Closed socket due to invalid start session response.', data);
    }
  }

  private onMessage(msg: MessageEvent) {
    this.subject.next(msg.data);
  }

  private onError(error: Event) {
    console.error('WEBSOCKET ERROR', error);
  }

  public getStatus(): Observable<SocketStatus> {
    return this.statusChangesSubject.asObservable();
  }
}
