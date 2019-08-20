import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor() { }

  get gameTime(): number {
    return new Date().getTime();
  }
}
