import { Injectable } from '@angular/core';
import { EndPointService } from './end-point.service';
import { Observable, of, Subject } from 'rxjs';
import { AuthService } from '../modules/auth/services/auth.service';
import { WebSocketBuilderService } from './web-socket-builder.service';

export const SOCKET_ENPOINT_ID = 'socket';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: WebSocket;
  private subject: Subject<string> = new Subject();

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
        this.socket.onmessage = null;
        this.socket.onclose = null;
        this.socket.onerror = null;
        this.socket.onopen = null;
        this.socket.close();
      }

      // si hay sesion crear nuevo socket
      if (session) {
        console.log('NUEVO SOCKET...', session);
        this.socket = this.wsBuilder.getSocket(endpoint);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onclose = this.onClose.bind(this);
        this.socket.onerror = this.onError.bind(this);
        this.socket.onopen = () => {
          this.socket.send(session.token);
        };
      }
      
    });
  }

  public getMessages(): Observable<string> {
    return this.subject.asObservable();
  }

  public send(msg: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(msg);
    } else {
      console.error(new Error('SOCKET NO CONECTADO'), this.socket);
    }
  }

  private onClose(event: CloseEvent) {
    /*if (this.autoConnect) {
        setTimeout(() => {
            this._connect();
        }, this.retryTimeout);
    }*/
  }

  private onMessage(msg: MessageEvent) {
      this.subject.next(msg.data);
  }

  private onError(error: Event) {
      console.error('WEBSOCKET ERROR', error);
  }
}
