import { Injectable } from '@angular/core';
import { ApiService } from '@piros/api';

@Injectable({
  providedIn: 'root'
})
export class CommandService {

  constructor(
    private api: ApiService
  ) { }

  public startTravel(fleet: string, destination: string) {
    this.api.request('start-travel', { fleet: fleet, destination: destination });
  }
  
}
