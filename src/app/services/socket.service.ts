import { Injectable } from '@angular/core';
import { EndPointService } from './end-point.service';
import { Observable, of, Subject, ReplaySubject } from 'rxjs';
import { AuthService } from '../modules/auth/services/auth.service';
import { WebSocketBuilderService } from './web-socket-builder.service';
import { Session } from '../model/session.interface';

export const SOCKET_ENPOINT_ID = 'socket';

export enum SocketStatus {
  CONNECTING = 'CONNECTING',
  SESSION_STARTED = 'SESSION_STARTED',
  CLOSED = 'CLOSED'
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: WebSocket;
  private subject: Subject<string> = new Subject();
  private statusChangesSubject: ReplaySubject<SocketStatus> = new ReplaySubject(1);
  private session: Session;

  constructor(
    private endPoint: EndPointService,
    private wsBuilder: WebSocketBuilderService,
    private auth: AuthService
  ) {
    this.subscribeToSessionChanges();
  }

  private subscribeToSessionChanges(): void {
    this.auth.getSession().subscribe(session => {

      this.session = session;
      
      this.closeSocket();

      if (session) {
        this.statusChangesSubject.next(SocketStatus.CONNECTING);
        this.connect();
      } else {
        this.statusChangesSubject.next(SocketStatus.CLOSED);
      }
    });
  }

  private connect() {
    const endpoint = this.endPoint.getEndPointPath(SOCKET_ENPOINT_ID)
      .replace('http', 'ws')
      .replace('https', 'wss');
    this.socket = this.wsBuilder.getSocket(endpoint);
    this.socket.onmessage = this.onFirstMessage.bind(this);
    this.socket.onclose = this.onClose.bind(this);
    this.socket.onerror = this.onError.bind(this);
    this.socket.onopen = () => {
      this.socket.send(this.session.token);
    };
  }

  private closeSocket() {
    if (this.socket) {
      this.socket.onmessage = null;
      this.socket.onclose = null;
      this.socket.onerror = null;
      this.socket.onopen = null;
      this.socket.close();
      this.socket = undefined;
    }
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
    this.socket = undefined;
    this.connect();
  }

  private onFirstMessage(msg: MessageEvent) {
    // session ok ?
    const data = JSON.parse(msg.data);
    
    if (data.type && data.type === 'SessionStartedDto') {
      this.socket.onmessage = this.onMessage.bind(this);
      this.statusChangesSubject.next(SocketStatus.SESSION_STARTED);
    } else {
      this.closeSocket();
      this.statusChangesSubject.next(SocketStatus.CLOSED);
      this.auth.removeSessionFromStorage();
      console.error('Closed socket due to invalid start session response.', data);
    }
  }

  private onMessage(msg: MessageEvent) {
    this.subject.next(msg.data);
  }

  private onError(error: Event) {
    this.closeSocket();
    this.connect();
  }

  public getStatus(): Observable<SocketStatus> {
    return this.statusChangesSubject.asObservable();
  }
}
