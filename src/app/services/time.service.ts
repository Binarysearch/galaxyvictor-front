import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor() { }

  getGameTime(): number {
    return new Date().getTime();
  }
}
