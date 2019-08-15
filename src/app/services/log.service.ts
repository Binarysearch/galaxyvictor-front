import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor() { }

  public i(item: any): void {
    console.log(item);
  }
}
