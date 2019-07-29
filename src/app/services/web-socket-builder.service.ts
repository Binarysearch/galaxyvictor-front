import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebSocketBuilderService {

  constructor() { }

  public getSocket(url: string): WebSocket {
    return new WebSocket(url);
  }
}
